"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Workout() {
  const [isConnected, setIsConnected] = useState(false);
  const [workout, setWorkout] = useState({
    exercise: "",
    sets: [{ reps: 0, weight: 0, unit: "kg" }],
    notes: "",
  });

  const addSet = () => {
    setWorkout({
      ...workout,
      sets: [...workout.sets, { reps: 0, weight: 0, unit: "kg" }],
    });
  };

  const updateSet = (index: number, field: string, value: number | string) => {
    const newSets = [...workout.sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setWorkout({ ...workout, sets: newSets });
  };

  const removeSet = (index: number) => {
    if (workout.sets.length > 1) {
      const newSets = workout.sets.filter((_, i) => i !== index);
      setWorkout({ ...workout, sets: newSets });
    }
  };

  return (
    <main className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">🏋️‍♂️ Record Workout</h1>
        <p className="text-muted-foreground">
          Track your fitness progress and commit it to GitHub
        </p>
      </div>

      {/* Connection Status */}
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">GitHub Connection</h3>
            <p className="text-sm text-muted-foreground">
              {isConnected ? "✅ Connected" : "❌ Not connected"}
            </p>
          </div>
          <Button 
            variant={isConnected ? "outline" : "default"}
            onClick={() => setIsConnected(!isConnected)}
          >
            {isConnected ? "Disconnect" : "Connect GitHub"}
          </Button>
        </div>
      </div>

      {/* Workout Form */}
      <div className="space-y-6">
        {/* Exercise Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Exercise</label>
          <input
            type="text"
            placeholder="e.g., Deadlift, Squat, Bench Press"
            value={workout.exercise}
            onChange={(e) => setWorkout({ ...workout, exercise: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* Sets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Sets</label>
            <Button variant="outline" size="sm" onClick={addSet}>
              + Add Set
            </Button>
          </div>
          
          {workout.sets.map((set, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Reps"
                value={set.reps}
                onChange={(e) => updateSet(index, "reps", parseInt(e.target.value) || 0)}
                className="flex-1 p-2 border rounded"
              />
              <span className="text-muted-foreground">×</span>
              <input
                type="number"
                placeholder="Weight"
                value={set.weight}
                onChange={(e) => updateSet(index, "weight", parseInt(e.target.value) || 0)}
                className="flex-1 p-2 border rounded"
              />
              <select
                value={set.unit}
                onChange={(e) => updateSet(index, "unit", e.target.value)}
                className="p-2 border rounded"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
              {workout.sets.length > 1 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => removeSet(index)}
                >
                  ×
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <textarea
            placeholder="How did the workout feel? Any observations?"
            value={workout.notes}
            onChange={(e) => setWorkout({ ...workout, notes: e.target.value })}
            className="w-full p-3 border rounded-lg h-20 resize-none"
          />
        </div>

        {/* Photo Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Workout Photo (Optional)</label>
          <div className="border-2 border-dashed border-muted-foreground rounded-lg p-6 text-center">
            <p className="text-muted-foreground">📸 Take a workout selfie</p>
            <Button variant="outline" className="mt-2">
              Upload Photo
            </Button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button 
          size="lg" 
          className="flex-1"
          disabled={!isConnected || !workout.exercise}
        >
          🚀 Publish to GitHub
        </Button>
        <Button variant="outline" size="lg">
          📱 Share on Farcaster
        </Button>
      </div>

      {/* Preview */}
      {workout.exercise && (
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Preview</h3>
          <div className="text-sm space-y-1">
            <p><strong>Exercise:</strong> {workout.exercise}</p>
            <p><strong>Sets:</strong></p>
            <ul className="ml-4">
              {workout.sets.map((set, index) => (
                <li key={index}>
                  {set.reps} reps × {set.weight} {set.unit}
                </li>
              ))}
            </ul>
            {workout.notes && (
              <p><strong>Notes:</strong> {workout.notes}</p>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground space-y-2">
        <p>💡 <strong>Tip:</strong> Connect your GitHub account to automatically commit your workouts</p>
        <p>🎯 <strong>Goal:</strong> Turn every workout into a GitHub commit for visual progress tracking</p>
      </div>
    </main>
  );
}
