import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, ChatResponse } from '../../../types/chat';
import { PERSONAS } from '../../../types/persona';

// For App Router, we use this to handle larger bodies if needed
export const maxDuration = 60; // 60 seconds

export async function POST(request: NextRequest) {
  console.log('[Chat API] POST request received');

  try {
    // 1. Safe Body Parsing
    let body: any;
    try {
      body = await request.json();
    } catch (e) {
      console.error('[Chat API] Failed to parse request JSON');
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { message, history, fileContext, personaId } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[Chat API] GEMINI_API_KEY is missing');
      return NextResponse.json({ error: 'Server API key not configured' }, { status: 500 });
    }

    // 2. Persona Selection
    const persona = PERSONAS.find(p => p.id === personaId) || PERSONAS[0];
    const messages: any[] = [
      { role: 'system', content: persona.systemPrompt }
    ];

    // 3. Safe File/Vision Context
    const imageAttachments: any[] = [];
    if (Array.isArray(fileContext) && fileContext.length > 0) {
      let fileContextString = 'Uploaded Files Context:\n';

      fileContext.forEach((file: any) => {
        try {
          if (!file || !file.fileType) return;

          if (file.fileType.startsWith('image/')) {
            // Only attach if we have actual base64 data to avoid previous crash
            if (file.base64 && file.base64.length > 50) {
              const base64Data = file.base64.includes('base64,')
                ? file.base64.split('base64,')[1]
                : file.base64;

              imageAttachments.push({
                type: "image_url",
                image_url: { url: `data:${file.fileType};base64,${base64Data}` }
              });
              fileContextString += `\n[Image Attached: ${file.fileName}]\n`;
            } else {
              fileContextString += `\n[Image Reference: ${file.fileName} (No raw data available)]\n${file.content || ''}\n`;
            }
          } else {
            // Document context
            const content = (file.content || '').substring(0, 50000);
            fileContextString += `\n--- File: ${file.fileName} ---\n${content}\n`;
          }
        } catch (fileErr) {
          console.error('[Chat API] Error processing file item:', fileErr);
        }
      });

      messages.push({
        role: 'system',
        content: `CONTEXT:\n${fileContextString}\n\nStrictly use the above context to answer. If image data is attached, use your vision to analyze it.`
      });
    }

    // 4. Safe History Processing
    if (Array.isArray(history)) {
      history.slice(-10).forEach((msg: any) => {
        if (msg && msg.role && msg.content && typeof msg.content === 'string') {
          messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          });
        }
      });
    }

    // 5. Build User Message (Multi-modal or Text)
    if (imageAttachments.length > 0) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: message },
          ...imageAttachments
        ]
      });
    } else {
      messages.push({ role: 'user', content: message });
    }

    // 6. API Call
    const model = process.env.GEMINI_MODEL || 'google/gemini-2.0-flash-001';
    console.log(`[Chat API] Calling OpenRouter with ${messages.length} messages`);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Lumo.AI",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Chat API] OpenRouter Error ${response.status}:`, errorText);
      return NextResponse.json({ error: `Provider Error: ${response.status}`, details: errorText }, { status: response.status });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "No response generated.";

    return NextResponse.json({ response: text });

  } catch (err: any) {
    console.error('[Chat API] Fatal Crash:', err);
    return NextResponse.json({
      error: 'Internal Server Error',
      message: err.message || 'Unknown error'
    }, { status: 500 });
  }
}
