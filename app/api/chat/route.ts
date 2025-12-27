import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const MODEL_NAME = "gemini-2.5-flash"

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file." },
                { status: 500 }
            );
        }

        // Initialize with the API key
        const genAI = new GoogleGenerativeAI(apiKey);

        // Explicitly using the model name
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const { message, history } = await req.json();

        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("Gemini API Error details:", error);

        // Provide a more helpful error message if it's a model not found error
        let errorMessage = error.message || "Failed to get response from Gemini";
        if (errorMessage.includes("404") || errorMessage.includes("not found")) {
            errorMessage = `The AI model (${MODEL_NAME}) could not be reached. This may be due to regional restrictions or API changes. Please check your Google AI Studio dashboard.`;
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
