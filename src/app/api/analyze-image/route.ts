import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, mimeType } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }

    // OpenRouter API call for vision
    const model = process.env.GEMINI_MODEL || 'google/gemini-2.0-flash-001';

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Lumo.AI",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this image and provide a detailed description. Include:\n- What you see in the image (objects, people, animals, etc.)\n- The setting or environment\n- Colors, lighting, and composition\n- Any text visible in the image\n- The overall mood or atmosphere\n- Any notable details or interesting elements\n\nProvide a natural, conversational description as if you're describing the image to someone who can't see it."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${image}`
                }
              }
            ]
          }
        ],
        temperature: 0.4,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const description = data.choices[0].message.content;

    return NextResponse.json({
      description: description,
      success: true
    });

  } catch (error) {
    console.error('Error in image analysis API:', error);

    let errorMessage = 'Failed to analyze image';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        success: false
      },
      { status: 500 }
    );
  }
}
