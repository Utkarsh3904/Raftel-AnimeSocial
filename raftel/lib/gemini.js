import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
        responseMimeType: "application/json"
    }
})

export async function generatePoll (){

    const prompt = `Generate an anime poll. Return ONLY valid JSON with the following structure:
    {
    "question": "Your poll question here",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
    }
    No markdown.
    No explanations.
    No code fences.`;

    try{
        const result = await model.generateContent(prompt)
        const text = result.response.text().trim()
        const poll = JSON.parse(text)
        return poll
    }
    catch(err){
        console.error("Error generating poll:", err)
        throw new Error("Failed to generate poll")
    }
}