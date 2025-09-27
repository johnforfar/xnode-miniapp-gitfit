import { NextRequest, NextResponse } from 'next/server';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const MODEL_NAME = 'llama3.2';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OllamaRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
}

interface OllamaResponse {
  message: {
    content: string;
    role: string;
  };
  done: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { message, workoutContext } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Fetch real workout data from GitHub
    let workoutData = null;
    try {
      const workoutResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/github/workouts`);
      if (workoutResponse.ok) {
        const data = await workoutResponse.json();
        workoutData = data.workouts;
      }
    } catch (error) {
      console.error('Failed to fetch workout data:', error);
    }

    // Create system prompt with real workout context
    const systemPrompt = `You are a knowledgeable fitness coach and personal trainer. You have access to the user's workout data and can provide personalized advice.

${workoutData ? `User's Recent Workouts:
${JSON.stringify(workoutData.recentWorkouts || [], null, 2)}

User's Stats:
${JSON.stringify(workoutData.stats || {}, null, 2)}` : 'No workout data available yet. Encourage the user to connect their GitHub account and start recording workouts.'}

Based on this data, provide helpful, personalized fitness advice. You can:
- Suggest new exercises based on their current routine
- Recommend progression strategies
- Provide form tips
- Suggest workout modifications
- Answer questions about their fitness journey

Keep responses concise but informative. Be encouraging and motivating.`;

    const ollamaRequest: OllamaRequest = {
      model: MODEL_NAME,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      stream: false
    };

    // Check if Ollama is available
    try {
      const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ollamaRequest),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      
      return NextResponse.json({
        message: data.message.content,
        model: MODEL_NAME,
        timestamp: new Date().toISOString()
      });

    } catch (ollamaError) {
      console.error('Ollama API error:', ollamaError);
      
      return NextResponse.json({
        error: 'Ollama service is not available. Please ensure Ollama is running with the llama3.2 model.',
        model: MODEL_NAME,
        timestamp: new Date().toISOString(),
        fallback: true
      }, { status: 503 });
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check if Ollama is running and has the model
    const response = await fetch(`${OLLAMA_HOST}/api/tags`);
    
    if (!response.ok) {
      return NextResponse.json({
        available: false,
        error: 'Ollama not available',
        fallback: true
      });
    }

    const data = await response.json();
    const hasModel = data.models?.some((model: any) => model.name.includes(MODEL_NAME));

    return NextResponse.json({
      available: true,
      model: MODEL_NAME,
      hasModel,
      models: data.models || []
    });

  } catch (error) {
    return NextResponse.json({
      available: false,
      error: 'Ollama not available',
      fallback: true
    });
  }
}
