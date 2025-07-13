import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Get the generative model with vision capabilities
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    // Create the prompt for image analysis
    const prompt = `Please analyze this image and provide a detailed description. Include:
- What you see in the image (objects, people, animals, etc.)
- The setting or environment
- Colors, lighting, and composition
- Any text visible in the image
- The overall mood or atmosphere
- Any notable details or interesting elements

Provide a natural, conversational description as if you're describing the image to someone who can't see it.`;

    // Prepare the image data for the API
    const imagePart = {
      inlineData: {
        data: image,
        mimeType: mimeType
      }
    };

    // Generate the response with image and text
    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const description = response.text();

    return NextResponse.json({
      description: description,
      success: true
    });

  } catch (error) {
    console.error('Error in image analysis API:', error);

    let errorMessage = 'Failed to analyze image';
    
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        errorMessage = 'Image analysis temporarily unavailable due to high usage';
      } else if (error.message.includes('SAFETY')) {
        errorMessage = 'Image content cannot be analyzed due to safety restrictions';
      }
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
