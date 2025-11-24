import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📩 Received Body:", body);

    const { jobPosition, jobDescription, duration, type } = body;

    const FINAL_PROMPT = QUESTIONS_PROMPT
      .replace("{{jobTitle}}", jobPosition || "")
      .replace("{{jobDescription}}", jobDescription || "")
      .replace("{{duration}}", duration || "")
      .replace("{{type}}", type || "");

    console.log("🧠 FINAL PROMPT:", FINAL_PROMPT);
    console.log("🔑 API KEY loaded:", !!process.env.OPENROUTER_API_KEY);

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // ✅ Use a guaranteed-free model
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    const content = completion?.choices?.[0]?.message?.content;
    console.log("✅ AI Response:", content);

    return NextResponse.json({ content });
  } catch (error) {
    console.error("❌ SERVER ERROR in /api/ai-model");
    console.error("Message:", error?.message);
    console.error("Response Data:", error?.response?.data);
    console.error("Stack:", error?.stack);

    return NextResponse.json(
      {
        error: error?.response?.data || error?.message || "Unknown server error",
      },
      { status: 500 }
    );
  }
}
