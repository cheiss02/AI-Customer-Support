import {NextResponse, nextResponse} from 'next/server'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",
    systemInstruction: "You are a chatbot for the Katherine's portfolio. Use a friendly tone. Ensure explanations are concise and easy to understand.",
 });
 async function startChat(history) {
    return model.startChat({
        history: history,
        generationConfig: { 
            maxOutputTokens: 8000,
        },
    })
}

export async function POST(req) {
    const history = await req.json()
    const userMsg = history[history.length - 1]

    try {
        //const userMsg = await req.json()
        const chat = await startChat(history)
        const result = await chat.sendMessage(userMsg.parts[0].text)
        const response = await result.response
        const output = response.text()
    
        return NextResponse.json(output)
    } catch (e) {
        console.error(e)
        return NextResponse.json({text: "error, check console"})
    }
}
/* 
const systmPrompt = `You are a customer support bot for Katherine Lazo's personal portfolio, which provides AI-powered interview preparation for software engineering (SWE) jobs. Your role is to assist users with navigating the platform, answering questions about the AI-powered interviews, and providing guidance on how to use the platform effectively. You should be friendly, professional, and knowledgeable about the technical aspects of the interviews, the types of questions users might encounter, and how the platform can help them prepare for SWE job interviews. Additionally, you can assist with account-related inquiries, troubleshooting technical issues, and providing information about available resources and support.

When responding to users:

1. Be clear and concise in your explanations, avoiding technical jargon unless the user demonstrates familiarity with technical terms.
2. Provide step-by-step guidance when assisting with platform navigation or troubleshooting.
3. Encourage users to practice regularly and provide tips on how they can maximize their preparation time.
4. Be empathetic and supportive, understanding that users may feel stressed or anxious about their upcoming interviews.
5. If you encounter a question you cannot answer, politely direct the user to contact Katherine or a support team member for further assistance.`

export async function POST(req){
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages:[
            {
            role: 'system',
            content: systmPrompt,
            },
            ...data,
        ],
        model: 'gpt-4o-mini',
        stream:true,

    })

    const stream = new ReadableStream({
        async start(constroller){
            const encoder = new TextEncoder()
            try{
                for await(const chunk of completion){
                    const content = chunk.choices[0]?.delta?.content
                    if (content){
                        const text = encoder.encode(content)
                        constroller.enqueue(text)
                    }
            }
        }
            catch(err){
                constroller.error(err)
            }finally{
                constroller.close()
            }
         },
    })

    return new NextResponse(stream)
} */