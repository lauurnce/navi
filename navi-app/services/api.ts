// THIS IS THE BRIDGE FILE
// It connects your React Native App to your Python Backend

// 1. YOUR BACKEND IP ADDRESS
export const API_URL = 'http://192.168.1.8:5000';

// --- FUNCTION 1: UPLOAD PDF ---
export const uploadCourseMaterial = async (
  fileUri: string, 
  fileName: string, 
  fileType: string,
  subject: string,
  professor: string
) => {
  try {
    const formData = new FormData();

    // 1. Append the file
    // On Web, this needs to be handled carefully. 
    // If fileUri is a blob (common on web), fetch handles it.
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: fileType || 'application/pdf',
    } as any);

    // 2. Append text data
    formData.append('subject', subject);
    formData.append('professor', professor);

    console.log(`Sending file to: ${API_URL}/upload`);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
      // --- CRITICAL FIX: DO NOT SET HEADERS FOR MULTIPART ---
      // The browser/device will automatically set the correct boundary.
      // headers: { 'Content-Type': 'multipart/form-data' }, <--- REMOVED THIS
    });

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Bridge Broken (Upload):', error);
    return { error: 'Network request failed. Is the backend running?' };
  }
};

// --- FUNCTION 2: CHAT WITH AI ---
export const chatWithAI = async (
  question: string,
  subject: string = 'General'
) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // JSON still needs this header
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