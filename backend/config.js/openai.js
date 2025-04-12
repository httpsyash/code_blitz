import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.TEST_VARIABLE)
const openai = new OpenAI({
    
  apiKey: process.env.TEST_VARIABLE,
  baseURL: "https://openrouter.ai/api/v1", 
});

export default openai;
