import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
export const dynamic = 'force-dynamic';
 
export async function POST(req: Request) {
  try {
    const prompt="Suggest 3 open ended ques on meaages in a single string seperated by ||";
 
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    max_tokens: 2000,
    stream: true,
    prompt,
  });
 
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
    
  } catch (error) {
    if(error instanceof  OpenAI.APIError){
        const {name,status,headers,message}=error
        return Response.json({name,status,error, message},{status})

    }else{
        console.log(error)
        throw error
    }
    
  }
}