"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GenerateWorkoutButton } from "@/components/generate-workout-button";
import Link from "next/link";

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

export function WorkoutGenerationCard() {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory | null>(null);
  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutPlan | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Fetch workout history when component mounts
  useEffect(() => {
    const fetchWorkoutHistory = async () => {
      try {
        // Mock data for now - in real app, this would fetch from GitHub API
        const mockHistory: WorkoutHistory = {
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
        setWorkoutHistory(mockHistory);
      } catch (error) {
        console.error('Failed to fetch workout history:', error);
      }
    };

    fetchWorkoutHistory();
  }, []);

  const handleWorkoutGenerated = (workout: WorkoutPlan) => {
    setGeneratedWorkout(workout);
  };

  const recordWorkoutToGitHub = async () => {
    if (!generatedWorkout) return;
    
    setIsRecording(true);
    try {
      // Here you would implement the GitHub commit logic
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert(`Workout "${generatedWorkout.title}" recorded to GitHub! 🎉`);
      
      // Reset the workout
      setGeneratedWorkout(null);
    } catch (error) {
      console.error('Failed to record workout:', error);
      alert('Failed to record workout. Please try again.');
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-4xl">🏋️‍♂️</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            AI Workout Coach
          </h2>
        </div>
        <p className="text-gray-300 text-sm">
          Generate personalized workouts based on your fitness history
        </p>
      </div>

      {/* Stats Display */}
      {workoutHistory && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{workoutHistory.stats.totalWorkouts}</div>
            <div className="text-xs text-gray-400">Total Workouts</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{workoutHistory.stats.currentStreak}</div>
            <div className="text-xs text-gray-400">Day Streak</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-400">{workoutHistory.stats.personalRecords}</div>
            <div className="text-xs text-gray-400">Personal Records</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-orange-400">{workoutHistory.stats.favoriteExercise}</div>
            <div className="text-xs text-gray-400">Favorite Exercise</div>
          </div>
        </div>
      )}

      {/* Generate Workout Button */}
      <div className="mb-6">
        <GenerateWorkoutButton 
          workoutHistory={workoutHistory}
          onWorkoutGenerated={handleWorkoutGenerated}
        />
      </div>

      {/* Generated Workout Display */}
      {generatedWorkout && (
        <div className="space-y-4">
          {/* Workout Summary */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
            <h3 className="font-bold text-lg text-yellow-400 mb-2">{generatedWorkout.title}</h3>
            <p className="text-gray-300 text-sm mb-3">{generatedWorkout.description}</p>
            <div className="flex gap-3 text-xs">
              <span className="bg-yellow-500/20 px-2 py-1 rounded text-yellow-300">
                ⏱️ {generatedWorkout.duration}
              </span>
              <span className="bg-orange-500/20 px-2 py-1 rounded text-orange-300">
                💪 {generatedWorkout.difficulty}
              </span>
            </div>
          </div>

          {/* Quick Exercise Preview */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h4 className="font-semibold text-gray-200 mb-3">🏋️‍♂️ Exercises Preview</h4>
            <div className="space-y-2">
              {generatedWorkout.exercises.slice(0, 3).map((exercise, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{exercise.name}</span>
                  <span className="text-gray-400">{exercise.sets} sets × {exercise.reps}</span>
                </div>
              ))}
              {generatedWorkout.exercises.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{generatedWorkout.exercises.length - 3} more exercises
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={recordWorkoutToGitHub}
              disabled={isRecording}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              {isRecording ? (
                <>
                  <span className="animate-spin mr-2">⚡</span>
                  Recording...
                </>
              ) : (
                <>
                  💾 Record to GitHub
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              asChild
            >
              <Link href="/workout">
                📝 Full Workout Page
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Motivation Quote */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm italic">
          &quot;Every workout is a step closer to your goals. Make it count! 💪&quot;
        </p>
      </div>
    </div>
  );
}

