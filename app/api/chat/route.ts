import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { authorBio } from "@/data/about";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    
    const { message, projects = [] } = await req.json();

    // 1. Проверка на пустые сообщения или слишком длинный текст
    // Арт-директор не будет писать поэму на 5000 символов.
    if (!message || message.length > 1000) {
      return NextResponse.json({ answer: "Message too long or empty." }, { status: 400 });
    }

    // 2. Проверка Origin (чтобы нельзя было слать запросы из Postman или с других сайтов)
    // const origin = req.headers.get('origin');
    // const host = req.headers.get('host');
    // В продакшене замени на свой реальный домен
    // if (process.env.NODE_ENV === 'production' && !origin?.includes('my-portfolio-two-liard-75.vercel.app')) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    
    const contextProjects = projects.map((p: any) => ({
      slug: p.slug,
      title: p.title,
      stack: p.details?.stack || "Not specified",
      task: p.details?.task || "Not specified"
    }));

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", // <--- Стабильная версия
      systemInstruction: `You are the Elite PR Agent for Senior Motion Designer Evgeniy Prilepskiy. 
      Your goal is to sell his expertise to European Art Directors.

      TONE & STYLE:
      - Sophisticated, confident, Senior-level professional. 
      - No "fluff", no desperation. 
      - Language: Always respond in the language of the user's message (default to English).

      STRICT FORMAT:
      1. Start with one bold sentence: "**[Direct, powerful answer to the user's core question]**". 
      2. Double newline (\\n\\n).
      3. The rest of the message must be PLAIN TEXT without any Markdown (no lists, no stars, no hashes). Use clear paragraphs.

      THE "PIVOT" RULE (CRITICAL):
      - If a specific project or skill is missing in the data, NEVER say "I cannot do this".
      - Instead, pivot: "While the current public portfolio focuses on [Related Area], Evgeniy's deep mastery of [Tool/Pipeline] in projects like [Project Name] demonstrates the technical foundation required to execute [Requested Task] at a high level."
      - Emphasize that for a Senior, the tool is secondary to the vision and result.

      STRICT HONESTY:
      - Do not invent software usage. Use only the provided 'stack' and 'task' for specific project details.

      DATA:
      Bio: ${authorBio}
      Projects: ${JSON.stringify(contextProjects)}`,
      
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `User request: "${message}". Generate a JSON response: {"answer": "string", "relevantSlugs": []}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Чистим ответ от возможного мусора (markdown блоков)
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonResponse = JSON.parse(text.slice(jsonStart, jsonEnd));

    return NextResponse.json(jsonResponse);
    
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { answer: `**Note:** My apologies, I'm momentarily offline. Please feel free to reach out to Evgeniy directly via email or LinkedIn.`, relevantSlugs: [] }, 
      { status: 500 }
    );
  }
}