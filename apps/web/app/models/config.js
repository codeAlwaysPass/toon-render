export const DEEPSEEK_CONFIG = {
  apiKey: process.env.DEEPSEEK_API_KEY || "",
  baseURL: "https://api.deepseek.com",
  model: "deepseek-reasoner",
  temperature: 0.7,
  maxTokens: 4000,
};