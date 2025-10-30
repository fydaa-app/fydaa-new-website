// Chatbot API Configuration
// Update this file to configure your FastAPI backend endpoint

export const CHATBOT_CONFIG = {
  // API endpoint - update this to point to your FastAPI backend
  API_ENDPOINT: process.env.NEXT_PUBLIC_CHATBOT_API_URL || "http://localhost:8000/chat",
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Maximum number of conversation history messages to send
  MAX_HISTORY: 10,
};

// Example FastAPI endpoint structure:
// POST /api/chat
// Content-Type: application/json
// Body: {
//   "message": "user message",
//   "conversation_history": [
//     {"role": "user", "content": "previous message"},
//     {"role": "assistant", "content": "previous response"}
//   ]
// }
// Response: {
//   "message": "AI response",
//   "status": "success"
// }
