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

    // Mock workout data for demonstration
    const mockWorkoutData = {
      recentWorkouts: [
        {
          date: "2024-09-27",
          exercise: "Overhead Press",
          weight: 150,
          sets: 4,
          reps: 3,
          notes: "Another PR! 150 lbs overhead press!"
        },
        {
          date: "2024-09-25",
          exercise: "Squat",
          weight: 305,
          sets: 5,
          reps: 1,
          notes: "300+ SQUAT! New personal record!"
        },
        {
          date: "2024-09-21",
          exercise: "Bench Press",
          weight: 200,
          sets: 3,
          reps: 3,
          notes: "FINALLY! 200 lbs bench press achieved!"
        }
      ],
      stats: {
        totalWorkouts: 89,
        personalRecords: 12,
        currentStreak: 5,
        favoriteExercise: "Deadlift"
      }
    };

    // Create system prompt with mock workout context
    const systemPrompt = `You are a knowledgeable fitness coach and personal trainer. You have access to the user's workout data and can provide personalized advice.

User's Recent Workouts:
${JSON.stringify(mockWorkoutData.recentWorkouts, null, 2)}

User's Stats:
${JSON.stringify(mockWorkoutData.stats, null, 2)}

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
              
              // Return mock responses when Ollama is not available
              const mockResponses = {
                "hello": "Hey there! I'm your AI fitness coach. I can see you've been crushing it with your workouts! Your recent PRs on overhead press (150 lbs) and squat (305 lbs) are impressive! 💪 What would you like to work on today?",
                "help": "I'm here to help with your fitness journey! I can suggest new exercises, help with form tips, recommend progression strategies, or answer questions about your workouts. Just ask me anything!",
                "workout": "Based on your recent workouts, I'd suggest focusing on your weak points. Your deadlift could use some attention - try Romanian deadlifts for hamstring strength and rack pulls for lockout power. What do you think?",
                "form": "Great question! For your overhead press, focus on keeping your core tight and driving through your heels. For squats, make sure you're hitting proper depth and keeping your chest up. Need specific form tips for any exercise?",
                "progression": "Your progression looks solid! You've hit some great PRs recently. I'd suggest adding some accessory work for your weaker lifts. For bench press, try close-grip bench and tricep work. For deadlifts, add some glute bridges and hip thrusts.",
                "routine": "Based on your current routine, I'd suggest a 4-day split: Day 1 - Squat focus, Day 2 - Bench focus, Day 3 - Deadlift focus, Day 4 - Overhead press focus. This will help you maintain strength while adding volume. Sound good?",
                "nutrition": "Nutrition is key for recovery and performance! Make sure you're getting enough protein (1g per lb bodyweight), staying hydrated, and eating enough calories to support your training. Are you tracking your macros?",
                "recovery": "Recovery is just as important as training! Make sure you're getting 7-9 hours of sleep, staying hydrated, and taking rest days. Your current 5-day streak is great, but don't forget to rest!",
                "motivation": "You're doing amazing! 89 total workouts and 12 personal records - that's incredible progress! Remember, every workout counts and you're building something great. Keep pushing! 🏋️‍♂️",
                "tips": "Here are some quick tips: 1) Warm up properly before heavy lifts, 2) Focus on form over weight, 3) Track your workouts consistently, 4) Listen to your body and rest when needed, 5) Stay consistent - that's the key to success!"
              };
              
              const lowerMessage = message.toLowerCase();
              let mockResponse = "I'm your AI fitness coach! I can see you've been working hard with your workouts. Your recent PRs are impressive! How can I help you today?";
              
              // Find matching mock response
              for (const [key, response] of Object.entries(mockResponses)) {
                if (lowerMessage.includes(key)) {
                  mockResponse = response;
                  break;
                }
              }
              
              return NextResponse.json({
                message: mockResponse,
                model: MODEL_NAME,
                timestamp: new Date().toISOString(),
                mock: true,
                note: 'Ollama not available, using mock response'
              });
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
