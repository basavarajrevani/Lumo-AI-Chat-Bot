import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[Vision API] POST request received');

  try {
    const body = await request.json();
    const { image, mimeType } = body;

    if (!image) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[Vision API] GEMINI_API_KEY is missing');
      return NextResponse.json({ error: 'Server API key not configured' }, { status: 500 });
    }

    const model = process.env.GEMINI_MODEL || 'google/gemini-2.0-flash-001';
    const appUrl = process.env.RENDER_EXTERNAL_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    console.log(`[Vision API] Calling OpenRouter - Model: ${model}`);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": appUrl,
        "X-Title": "Lumo.AI Vision",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image and provide a detailed conversational description. Focus on objects, setting, colors, text, and mood."
              },
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${image}` }
              }
            ]
          }
        ],
        temperature: 0.4,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Vision API] OpenRouter Error ${response.status}:`, errorText);
      return NextResponse.json({
        error: `Provider Error: ${response.status}`,
        details: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    const description = data?.choices?.[0]?.message?.content || "No description generated.";

    return NextResponse.json({
      description: description,
      success: true
    });

  } catch (err: any) {
    console.error('[Vision API] Fatal Error:', err);
    return NextResponse.json({
      error: 'Internal Server Error',
      message: err.message || 'Unknown error',
      success: false
    }, { status: 500 });
  }
}
