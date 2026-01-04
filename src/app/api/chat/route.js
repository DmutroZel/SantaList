import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    let userMessage = body.message;

    if (!userMessage && Array.isArray(body.history)) {
      userMessage = body.history.at(-1)?.content;
    }

    if (!userMessage) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    // Повна історія чату + system prompt для ролі Санти
    const messages = [
      {
        role: "system",
        content: "Ти — веселий і добрий Санта Клаус з Північного полюса. Відповідай українською мовою, з гумором, магією та святковим настроєм! Використовуй емодзі 🎅✨❄️ де доречно."
      },
      ...(body.history || []),
      { role: "user", content: userMessage }
    ];

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
     body: JSON.stringify({
        model: "moonshotai/Kimi-K2-Instruct-0905",  // ← почни з цієї, найстабільніша безплатна
  // Або: "moonshotai/Kimi-K2-Instruct-0905"
  // Або: "deepseek-ai/DeepSeek-R1:fastest"
        messages: messages,
        max_tokens: 512,
        temperature: 0.7,
}),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF API error:", response.status, errorText);
      throw new Error(`HF API error: ${response.status}`);
    }

    const data = await response.json();
console.log("HF raw response:", JSON.stringify(data, null, 2));  // ← це ключове!

const reply = data.choices?.[0]?.message?.content?.trim() || "Хо-хо-хо, щось пішло не так! Мої ельфи сплять... Спробуй ще раз ✨";

return NextResponse.json({ reply });
  } catch (err) {
    console.error("HF ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}