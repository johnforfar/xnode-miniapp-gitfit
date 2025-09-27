"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface WorkoutPlan {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    weight: string;
    rest: string;
    notes: string;
  }>;
  tips: string[];
  motivation: string;
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

interface GenerateWorkoutButtonProps {
  workoutHistory?: WorkoutHistory | null;
  onWorkoutGenerated?: (workout: WorkoutPlan) => void;
}

export function GenerateWorkoutButton({ workoutHistory, onWorkoutGenerated }: GenerateWorkoutButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutPlan | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const generateWorkout = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ollama/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workoutHistory: workoutHistory || {
            recentWorkouts: [],
            stats: { totalWorkouts: 0, personalRecords: 0, currentStreak: 0 }
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate workout');
      }

      const data = await response.json();
      setGeneratedWorkout(data.workout);
      setIsExpanded(true);
      
      if (onWorkoutGenerated) {
        onWorkoutGenerated(data.workout);
      }
    } catch (error) {
      console.error('Error generating workout:', error);
      // You could add a toast notification here
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (generatedWorkout && isExpanded) {
    return (
      <div className="w-full">
        {/* Collapse button */}
        <Button
          onClick={toggleExpanded}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200"
        >
          🔽 Collapse Workout Plan
        </Button>
        
        {/* Expanded workout card */}
        <div className="mt-4 bg-white border-2 border-yellow-200 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 text-black">
            <h2 className="text-2xl font-bold mb-2">{generatedWorkout.title}</h2>
            <p className="text-lg opacity-90 mb-3">{generatedWorkout.description}</p>
            <div className="flex gap-4 text-sm">
              <span className="bg-black bg-opacity-20 px-3 py-1 rounded-full">
                ⏱️ {generatedWorkout.duration}
              </span>
              <span className="bg-black bg-opacity-20 px-3 py-1 rounded-full">
                💪 {generatedWorkout.difficulty}
              </span>
            </div>
          </div>

          {/* Exercises */}
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">🏋️‍♂️ Exercises</h3>
            <div className="space-y-4">
              {generatedWorkout.exercises.map((exercise, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg text-gray-800">{exercise.name}</h4>
                    <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                      {exercise.sets} sets
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Reps:</span>
                      <p className="text-gray-600">{exercise.reps}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Weight:</span>
                      <p className="text-gray-600">{exercise.weight}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Rest:</span>
                      <p className="text-gray-600">{exercise.rest}</p>
                    </div>
                    <div className="md:col-span-1 col-span-2">
                      <span className="font-medium text-gray-700">Notes:</span>
                      <p className="text-gray-600">{exercise.notes}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 p-6 border-t">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">💡 Tips</h3>
            <ul className="space-y-2">
              {generatedWorkout.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-blue-700">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Motivation */}
          <div className="bg-green-50 p-6 border-t">
            <h3 className="text-xl font-semibold mb-2 text-green-800">🔥 Motivation</h3>
            <p className="text-green-700 text-lg">{generatedWorkout.motivation}</p>
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  // Here you could implement saving the workout
                  console.log('Saving workout:', generatedWorkout);
                }}
              >
                💾 Save This Workout
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setGeneratedWorkout(null);
                  setIsExpanded(false);
                }}
              >
                🔄 Generate New One
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={generateWorkout}
      disabled={isGenerating}
      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <span className="animate-spin mr-2">⚡</span>
          Generating Your Workout...
        </>
      ) : (
        <>
          🎯 Generate Personalized Workout
        </>
      )}
    </Button>
  );
}
