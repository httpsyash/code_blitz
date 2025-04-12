import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

console.log(import.meta.env.TEST_VARIABLE)
const openai = new OpenAI({
    
  apiKey: import.meta.env.TEST_VARIABLE,
  baseURL: "https://openrouter.ai/api/v1", 
});

export default openai;
