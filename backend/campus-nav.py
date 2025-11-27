import google.generativeai as genai
from supabase import create_client, Client
import json
import os
from dotenv import load_dotenv

load_dotenv()

# --------------------------
# CONFIGURE API KEYS
# --------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Choose your embedding model
EMBED_MODEL = "models/text-embedding-004"  # recommended universal model


def create_embedding(text: str):
    """Generate an embedding vector from Gemini."""
    result = genai.embed_content(
        model=EMBED_MODEL,
        content=text,
        task_type="retrieval_document"
    )
    return result["embedding"]  # returns a Python list of floats


def insert_into_supabase(content: str, embedding: list):
    """Insert data into Supabase."""
    data = {
        "content": content,
        "embedding": embedding,
        "metadata": {"type": "campus_navigator"}
    }

    response = supabase.table("documents").insert(data).execute()
    return response


def main():
    print("\n--- Campus Navigator Content Embedding Tool ---\n")
    user_text = input("Enter your long campus content text:\n\n")

    print("\nGenerating embedding…")
    embedding = create_embedding(user_text)

    print("Embedding created! Length:", len(embedding))

    print("\nInserting into Supabase…")
    response = insert_into_supabase(user_text, embedding)

    print("\n✔ Success! Record inserted:")
    print(json.dumps(response.data, indent=2))


if __name__ == "__main__":
    main()