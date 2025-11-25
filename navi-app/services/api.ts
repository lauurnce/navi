// THIS IS THE BRIDGE FILE
// It connects your React Native App to your Python Backend

// 1. YOUR BACKEND IP ADDRESS
// Make sure your Python server is running on this IP!
export const API_URL = 'http://192.168.1.8:5000';

// --- TYPE DEFINITIONS ---
interface UploadResponse {
  message?: string;
  error?: string;
  id?: number;
}

interface ChatResponse {
  answer?: string;
  error?: string;
}

// --- FUNCTION 1: UPLOAD PDF ---
export const uploadCourseMaterial = async (
  fileUri: string, 
  fileName: string, 
  fileType: string,
  subject: string,
  professor: string
): Promise<UploadResponse> => {
  try {
    const formData = new FormData();

    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: fileType || 'application/pdf',
    } as any);

    formData.append('subject', subject);
    formData.append('professor', professor);

    console.log(`Sending file to: ${API_URL}/upload`);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Bridge Broken (Upload):', error);
    return { error: 'Network request failed. Is the python backend running?' };
  }
};

// --- FUNCTION 2: CHAT WITH AI ---
export const chatWithAI = async (
  question: string,
  subject: string = 'General'
): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question,
        subject: subject,
      }),
    });

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Bridge Broken (Chat):', error);
    return { error: 'Could not connect to AI.' };
  }
};