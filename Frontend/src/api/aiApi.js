import api from "./mangoApi";

export const sendAiChatApi = async (question) => {
  const response = await api.post("/ai-chat", { question });
  return response.data;
};

