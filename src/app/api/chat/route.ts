import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, ChatResponse } from '../../../types/chat';

// Initialize the Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history, fileContext } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    // Build conversation history for context
    const conversationHistory = history
      .slice(-10) // Keep last 10 messages for context
      .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    // Build file context if available
    let fileContextString = '';
    if (fileContext && fileContext.length > 0) {
      fileContextString = '\n\nUploaded Files Context:\n';
      fileContext.forEach((file, index) => {
        fileContextString += `\n--- File ${index + 1}: ${file.fileName} (${file.fileType}) ---\n`;

        // Handle different file types appropriately
        if (file.fileType.startsWith('image/')) {
          // For images, include the analysis but not base64 data
          if (file.content.includes('**What I can see in this image:**')) {
            // Extract just the image analysis part
            const analysisStart = file.content.indexOf('**What I can see in this image:**');
            const analysisEnd = file.content.indexOf('💡 **You can ask me more');
            if (analysisStart !== -1 && analysisEnd !== -1) {
              const imageAnalysis = file.content.substring(analysisStart, analysisEnd).trim();
              fileContextString += `Image: ${file.fileName}\n${imageAnalysis}\n`;
            } else {
              fileContextString += `Image file: ${file.fileName} (analyzed)\n`;
            }
          } else {
            fileContextString += `Image file uploaded: ${file.fileName}\n`;
            fileContextString += `File type: ${file.fileType}\n`;
            fileContextString += `Note: Image analysis available - user can ask about image content.\n`;
          }
        } else if (file.content.includes('Base64 data:')) {
          // Skip base64 data to avoid token limits
          const contentWithoutBase64 = file.content.split('Base64 data:')[0];
          fileContextString += `${contentWithoutBase64}\n`;
        } else {
          // For text files and other content, include normally but limit size
          const maxContentLength = 2000; // Limit content to prevent token overflow
          const content = file.content.length > maxContentLength
            ? file.content.substring(0, maxContentLength) + '...[content truncated]'
            : file.content;
          fileContextString += `${content}\n`;
        }

        fileContextString += `--- End of ${file.fileName} ---\n`;
      });
      fileContextString += '\nYou can reference and answer questions about the content of these uploaded files.\n';
    }

    // Create the prompt with context
    const prompt = `You are Lumo.AI, an intelligent and helpful AI assistant. You provide thoughtful, accurate, and engaging responses. You can help with a wide variety of tasks including answering questions, creative writing, coding, analysis, and more.

${fileContextString}${conversationHistory ? `Previous conversation:\n${conversationHistory}\n\n` : ''}Human: ${message}
Assistant: `;

    // Generate the response
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const chatResponse: ChatResponse = {
      response: text,
    };

    return NextResponse.json(chatResponse);
  } catch (error) {
    console.error('Error in chat API:', error);

    let errorMessage = 'I apologize, but I encountered an error while processing your request. Please try again.';
    let statusCode = 500;

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('rate limit')) {
        errorMessage = 'I\'m currently experiencing high usage. Please wait a moment and try again.';
        statusCode = 429;
      } else if (error.message.includes('token') || error.message.includes('too large')) {
        errorMessage = 'Your message is too long. Please try with a shorter message or smaller file.';
        statusCode = 413;
      }
    }

    const errorResponse: ChatResponse = {
      response: errorMessage,
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(errorResponse, { status: statusCode });
  }
}


