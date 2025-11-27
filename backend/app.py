import os
import json
import pdfplumber
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv

# --- CONFIGURATION ---
# Load environment variables from .env file
load_dotenv()

# Get keys from environment
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Basic validation to warn you in the terminal if keys are missing
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found in .env file. AI features will fail.")
if not SUPABASE_URL:
    print("WARNING: SUPABASE_URL not found in .env file. Database features will fail.")

app = Flask(__name__)
# Enable Cross-Origin Resource Sharing so the React Native app can talk to this server
CORS(app)

# Initialize Clients
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    genai.configure(api_key=GEMINI_API_KEY)
except Exception as e:
    print(f"Error initializing clients: {e}")

# Models
EMBEDDING_MODEL = "models/text-embedding-004"
CHAT_MODEL = "gemini-2.5-flash"

# --- HELPER FUNCTIONS ---

def get_embedding(text):
    """Generates vector embedding for text using Gemini."""
    try:
        result = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']
    except Exception as e:
        print(f"Embedding Error: {e}")
        return None

def extract_text_from_pdf(file_storage):
    """Extracts text from uploaded PDF."""
    text = ""
    try:
        with pdfplumber.open(file_storage) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"PDF Error: {e}")
    return text

# --- API ENDPOINTS ---

@app.route('/', methods=['GET'])
def home():
    """Simple check to see if the server is running."""
    return jsonify({"status": "online", "message": "Navi Backend is Running"})

@app.route('/upload', methods=['POST'])
def upload_material():
    """
    Handles file uploads from the 'Share Course Materials' screen.
    Expects: file (PDF), subject, professor
    """
    # 1. Check File
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    subject = request.form.get('subject', 'General') # e.g., "Mathematics"
    professor = request.form.get('professor', 'Unknown') # e.g., "Dr. Smith"

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    print(f"Processing upload: {file.filename} for {subject}")

    try:
        # 2. Extract Text
        text_content = extract_text_from_pdf(file)
        if not text_content:
            return jsonify({"error": "Could not extract text from PDF"}), 400

        # 3. Generate Embedding
        embedding = get_embedding(text_content)
        if not embedding:
            return jsonify({"error": "Failed to generate AI embedding"}), 500

        # 4. Save to Supabase
        # We store subject/professor in metadata so we can filter later!
        data = {
            "content": text_content,
            "metadata": {
                "filename": file.filename,
                "subject": subject,
                "professor": professor,
                "type": "course_material" 
            },
            "embedding": embedding
        }
        
        response = supabase.table("documents").insert(data).execute()
        
        return jsonify({
            "message": "Material saved successfully!", 
            "id": response.data[0]['id']
        }), 200

    except Exception as e:
        print(f"Upload Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat_agent():
    """
    Handles chat for BOTH:
      - 'AI Tutor' (when a subject like Mathematics, Physics, etc. is provided)
      - 'Campus Navigator' (when subject == "Campus" OR subject is None)
    """
    data = request.json
    user_question = data.get('question')
    subject = data.get('subject')  # e.g., "Mathematics" or "Campus"

    if not user_question:
        return jsonify({"error": "No question provided"}), 400

    print(f"Question: {user_question} | Subject: {subject}")

    try:
        # ------------------------------------------------------
        # 1. Determine Mode (AI Tutor or Campus Navigator)
        # ------------------------------------------------------
        if subject and subject.lower() != "campus":
            mode = "tutor"
        else:
            mode = "navigator"

        # ------------------------------------------------------
        # 2. Embed Question
        # ------------------------------------------------------
        query_embedding_result = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=user_question,
            task_type="retrieval_query"
        )
        query_vector = query_embedding_result["embedding"]

        # ------------------------------------------------------
        # 3. Prepare Vector Filter
        # ------------------------------------------------------
        match_filter = {}

        if mode == "tutor":
            # Tutor: search only documents for the subject
            match_filter = {"subject": subject}
        else:
            # Campus Navigator: search only navigation/campus files
            match_filter = {"subject": "Campus"}

        # ------------------------------------------------------
        # 4. Supabase Vector Search
        # ------------------------------------------------------
        rpc_response = supabase.rpc("match_documents", {
            "query_embedding": query_vector,
            "match_threshold": 0.4,
            "match_count": 5,
            "filter": match_filter
        }).execute()

        # ------------------------------------------------------
        # 5. Build Context
        # ------------------------------------------------------
        context_text = ""
        for doc in rpc_response.data:
            filename = doc["metadata"].get("filename")
            context_text += (
                f"-- Source ({filename}):\n"
                f"{doc['content'][:1000]}\n\n"
            )

        if not context_text:
            context_text = "No specific documents were found for this topic."

        # ------------------------------------------------------
        # 6. Build System Instructions
        # ------------------------------------------------------
        if mode == "tutor":
            mode_instruction = (
                "You are 'Navi', an AI Tutor. Explain concepts clearly and "
                "relate answers to the student's subject whenever possible."
            )
        else:
            mode_instruction = (
                "You are 'Navi', a Campus Navigator AI. Provide directions, "
                "campus information, building locations, and university resources."
            )

        system_instruction = f"""
        {mode_instruction}
        Current Mode: {mode}
        Subject Context: {subject if subject else "General"}

        Use the provided CONTEXT to answer the student's question.
        If the answer is found in the CONTEXT, cite the source filename.
        If the answer is NOT found, use general knowledge but mention that the answer
        was not found in the uploaded notes.
        Keep the answer concise and encouraging.
        """

        # ------------------------------------------------------
        # 7. Generate AI Response
        # ------------------------------------------------------
        prompt = f"""
        Context:
        {context_text}

        Student Question: {user_question}
        """

        model = genai.GenerativeModel(
            model_name=CHAT_MODEL,
            system_instruction=system_instruction
        )

        response = model.generate_content(prompt)

        return jsonify({"answer": response.text})

    except Exception as e:
        print(f"Chat Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run on 0.0.0.0 to be accessible on your local network
    app.run(host='0.0.0.0', port=5000, debug=True)