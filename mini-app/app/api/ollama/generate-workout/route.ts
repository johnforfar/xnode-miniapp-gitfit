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
    const { workoutHistory } = await request.json();

    if (!workoutHistory) {
      return NextResponse.json({ error: 'Workout history is required' }, { status: 400 });
    }

    // Create system prompt for workout generation
    const systemPrompt = `You are an expert personal trainer and fitness coach. Generate a personalized workout plan based on the user's workout history.

IMPORTANT: You must respond with ONLY a valid JSON object in this exact format:
{
  "title": "Workout Title",
  "description": "Brief description of the workout",
  "duration": "45-60 minutes",
  "difficulty": "Beginner|Intermediate|Advanced",
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": 3,
      "reps": "8-12",
      "weight": "Bodyweight or suggested weight",
      "rest": "60-90 seconds",
      "notes": "Form tips or variations"
    }
  ],
  "tips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ],
  "motivation": "Encouraging message"
}

User's Workout History:
${JSON.stringify(workoutHistory, null, 2)}

Based on this history, create a workout that:
1. Builds on their strengths
2. Addresses any weaknesses
3. Provides appropriate progression
4. Includes variety to prevent boredom
5. Is realistic for their current level

Respond with ONLY the JSON object, no additional text.`;

    const ollamaRequest: OllamaRequest = {
      model: MODEL_NAME,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: 'Generate a personalized workout plan based on my history.'
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
      
      // Try to parse the JSON response
      let workoutPlan;
      try {
        workoutPlan = JSON.parse(data.message.content);
      } catch {
        // If parsing fails, return a mock workout
        workoutPlan = getMockWorkout(workoutHistory);
      }

      return NextResponse.json({
        workout: workoutPlan,
        model: MODEL_NAME,
        timestamp: new Date().toISOString()
      });

    } catch (ollamaError) {
      console.error('Ollama API error:', ollamaError);
      
      // Return mock workout when Ollama is not available
      const mockWorkout = getMockWorkout(workoutHistory);
      
      return NextResponse.json({
        workout: mockWorkout,
        model: MODEL_NAME,
        timestamp: new Date().toISOString(),
        mock: true,
        note: 'Ollama not available, using mock workout'
      });
    }

  } catch (error) {
    console.error('Generate workout API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate workout' },
      { status: 500 }
    );
  }
}

interface WorkoutHistory {
  recentWorkouts: Array<{
    date: string;
    exercise: string;
    weight: number;
    sets: number;
    reps: number;
    notes: string;
  }>;
  stats: {
    totalWorkouts: number;
    personalRecords: number;
    currentStreak: number;
    favoriteExercise: string;
  };
}

function getMockWorkout(workoutHistory: WorkoutHistory | null) {
  // Analyze workout history to create a personalized mock workout
  const recentWorkouts = workoutHistory?.recentWorkouts || [];
  const stats = workoutHistory?.stats || {
    totalWorkouts: 0,
    personalRecords: 0,
    currentStreak: 0,
    favoriteExercise: 'Unknown'
  };
  
  // Determine workout focus based on history
  const hasDeadlift = recentWorkouts.some((w) => w.exercise?.toLowerCase().includes('deadlift'));
  const hasSquat = recentWorkouts.some((w) => w.exercise?.toLowerCase().includes('squat'));
  const hasBench = recentWorkouts.some((w) => w.exercise?.toLowerCase().includes('bench'));
  const hasOverhead = recentWorkouts.some((w) => w.exercise?.toLowerCase().includes('overhead') || w.exercise?.toLowerCase().includes('press'));
  
  // Create workout based on what they've been doing
  let exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    weight: string;
    rest: string;
    notes: string;
  }> = [];
  let title = "Personalized Strength Session";
  const difficulty = "Intermediate";
  
  if (hasDeadlift && hasSquat && hasBench) {
    // Full body powerlifting-style workout
    title = "Powerlifting Power Session";
    exercises = [
      {
        name: "Deadlift",
        sets: 4,
        reps: "3-5",
        weight: "85-90% of max",
        rest: "3-5 minutes",
        notes: "Focus on explosive lockout"
      },
      {
        name: "Squat",
        sets: 3,
        reps: "5-8",
        weight: "75-80% of max",
        rest: "2-3 minutes",
        notes: "Maintain tight core throughout"
      },
      {
        name: "Bench Press",
        sets: 3,
        reps: "6-10",
        weight: "70-75% of max",
        rest: "2-3 minutes",
        notes: "Control the descent"
      },
      {
        name: "Barbell Rows",
        sets: 3,
        reps: "8-12",
        weight: "Moderate weight",
        rest: "90 seconds",
        notes: "Pull to lower chest"
      },
      {
        name: "Overhead Press",
        sets: 3,
        reps: "8-12",
        weight: "Light to moderate",
        rest: "90 seconds",
        notes: "Keep core engaged"
      }
    ];
  } else if (hasOverhead) {
    // Upper body focused
    title = "Upper Body Strength Builder";
    exercises = [
      {
        name: "Overhead Press",
        sets: 4,
        reps: "6-8",
        weight: "Heavy",
        rest: "2-3 minutes",
        notes: "Your strongest lift - push hard!"
      },
      {
        name: "Pull-ups",
        sets: 3,
        reps: "5-10",
        weight: "Bodyweight",
        rest: "2 minutes",
        notes: "Full range of motion"
      },
      {
        name: "Dips",
        sets: 3,
        reps: "8-15",
        weight: "Bodyweight",
        rest: "90 seconds",
        notes: "Lean forward slightly"
      },
      {
        name: "Face Pulls",
        sets: 3,
        reps: "12-15",
        weight: "Light",
        rest: "60 seconds",
        notes: "External rotation focus"
      }
    ];
  } else {
    // General strength workout
    title = "Balanced Strength Workout";
    exercises = [
      {
        name: "Squat",
        sets: 4,
        reps: "8-12",
        weight: "Moderate",
        rest: "2 minutes",
        notes: "Focus on depth and form"
      },
      {
        name: "Push-ups",
        sets: 3,
        reps: "10-20",
        weight: "Bodyweight",
        rest: "90 seconds",
        notes: "Full range of motion"
      },
      {
        name: "Lunges",
        sets: 3,
        reps: "10 each leg",
        weight: "Bodyweight or light dumbbells",
        rest: "60 seconds",
        notes: "Alternate legs"
      },
      {
        name: "Plank",
        sets: 3,
        reps: "30-60 seconds",
        weight: "Bodyweight",
        rest: "60 seconds",
        notes: "Keep body straight"
      }
    ];
  }

  return {
    title,
    description: `Based on your ${stats?.totalWorkouts || 0} workouts and current ${stats?.currentStreak || 0}-day streak, this workout is designed to build on your strengths while addressing areas for improvement.`,
    duration: "45-60 minutes",
    difficulty,
    exercises,
    tips: [
      "Warm up with 5-10 minutes of light cardio",
      "Focus on form over weight - quality reps matter most",
      "Rest adequately between sets for maximum performance",
      "Listen to your body and adjust intensity as needed",
      "Cool down with stretching after your workout"
    ],
    motivation: `You've completed ${stats?.totalWorkouts || 0} workouts and hit ${stats?.personalRecords || 0} personal records! Keep pushing forward - every workout makes you stronger! 💪`
  };
}
