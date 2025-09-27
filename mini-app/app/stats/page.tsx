"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import GitHubActivityGraph from '@/components/github-activity-graph';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Mock data - in real app, this would come from GitHub API
const mockWorkoutData = [
  { date: "2024-01-01", exercise: "Deadlift", weight: 80, reps: 8, sets: 3 },
  { date: "2024-01-03", exercise: "Deadlift", weight: 85, reps: 8, sets: 3 },
  { date: "2024-01-05", exercise: "Deadlift", weight: 90, reps: 6, sets: 3 },
  { date: "2024-01-08", exercise: "Deadlift", weight: 95, reps: 6, sets: 3 },
  { date: "2024-01-10", exercise: "Deadlift", weight: 100, reps: 5, sets: 3 },
  { date: "2024-01-12", exercise: "Deadlift", weight: 105, reps: 5, sets: 3 },
  { date: "2024-01-15", exercise: "Deadlift", weight: 110, reps: 4, sets: 3 },
  { date: "2024-01-17", exercise: "Deadlift", weight: 115, reps: 4, sets: 3 },
  { date: "2024-01-20", exercise: "Deadlift", weight: 120, reps: 3, sets: 3 },
  { date: "2024-01-22", exercise: "Deadlift", weight: 125, reps: 3, sets: 3 },
  { date: "2024-01-25", exercise: "Deadlift", weight: 130, reps: 2, sets: 3 },
  { date: "2024-01-27", exercise: "Deadlift", weight: 135, reps: 2, sets: 3 },
  { date: "2024-01-30", exercise: "Deadlift", weight: 140, reps: 1, sets: 3 },
];

const mockTipsData = [
  { date: "2024-01-15", amount: 1.00, currency: "USDC", from: "@fitnessfan" },
  { date: "2024-01-20", amount: 5.00, currency: "USDC", from: "@gymbuddy" },
  { date: "2024-01-25", amount: 0.10, currency: "ETH", from: "@cryptofit" },
  { date: "2024-01-27", amount: 10.00, currency: "USDC", from: "@workoutwarrior" },
  { date: "2024-01-30", amount: 2.50, currency: "USDC", from: "@strengthseeker" },
];

export default function StatsPage() {
  const [workoutStats, setWorkoutStats] = useState(mockWorkoutData);
  const [tipsStats, setTipsStats] = useState(mockTipsData);

  // Calculate stats
  const totalWorkouts = workoutStats.length;
  const totalTips = tipsStats.reduce((sum, tip) => sum + tip.amount, 0);
  const totalTipsCount = tipsStats.length;
  const averageTip = totalTipsCount > 0 ? totalTips / totalTipsCount : 0;

  // Get latest workout
  const latestWorkout = workoutStats[workoutStats.length - 1];
  const firstWorkout = workoutStats[0];
  const strengthGain = latestWorkout ? latestWorkout.weight - firstWorkout.weight : 0;

  // Chart data for strength progression
  const strengthChartData = {
    labels: workoutStats.map(w => new Date(w.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Deadlift Weight (kg)',
        data: workoutStats.map(w => w.weight),
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const strengthChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  // Chart data for tips
  const tipsChartData = {
    labels: tipsStats.map(t => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Tips Received ($)',
        data: tipsStats.map(t => t.amount),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  const tipsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  // Calculate weekly progression
  const weeklyStats = workoutStats.reduce((acc, workout) => {
    const week = new Date(workout.date).toISOString().slice(0, 4) + '-' + 
                 Math.ceil(new Date(workout.date).getDate() / 7);
    if (!acc[week]) acc[week] = [];
    acc[week].push(workout);
    return acc;
  }, {} as Record<string, typeof mockWorkoutData>);

  const weeklyProgress = Object.entries(weeklyStats).map(([week, workouts]) => ({
    week,
    maxWeight: Math.max(...workouts.map(w => w.weight)),
    totalVolume: workouts.reduce((sum, w) => sum + (w.weight * w.reps * w.sets), 0),
    workoutCount: workouts.length
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm-20 18c-9.941 0-18-8.059-18-18s8.059-18 18-18 18 8.059 18 18-8.059 18-18 18z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <main className="relative z-10 px-4 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent">
            📊 STATS
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Track your fitness journey, strength gains, and community support
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" size="sm" className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm" asChild>
              <Link href="/">🏠 Home</Link>
            </Button>
            <Button variant="outline" size="sm" className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm" asChild>
              <Link href="/workout">🏋️‍♂️ Record Workout</Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-900 to-red-900 rounded-2xl p-6 border border-orange-700 shadow-2xl">
            <div className="text-3xl mb-2">🏋️‍♂️</div>
            <div className="text-2xl font-bold text-orange-300">{totalWorkouts}</div>
            <div className="text-orange-200 text-sm">Total Workouts</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl p-6 border border-green-700 shadow-2xl">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-green-300">${totalTips.toFixed(2)}</div>
            <div className="text-green-200 text-sm">Total Tips</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900 to-cyan-900 rounded-2xl p-6 border border-blue-700 shadow-2xl">
            <div className="text-3xl mb-2">💪</div>
            <div className="text-2xl font-bold text-blue-300">+{strengthGain}kg</div>
            <div className="text-blue-200 text-sm">Strength Gain</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-6 border border-purple-700 shadow-2xl">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-purple-300">{totalTipsCount}</div>
            <div className="text-purple-200 text-sm">Supporters</div>
          </div>
        </div>

        {/* GitHub Activity Graph */}
        <div className="mb-8">
          <GitHubActivityGraph />
        </div>

        {/* Main Stats Tabs */}
        <Tabs defaultValue="strength" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border border-gray-700">
            <TabsTrigger value="strength" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              💪 Strength
            </TabsTrigger>
            <TabsTrigger value="tips" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              💰 Tips
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              📈 Progress
            </TabsTrigger>
          </TabsList>

          {/* Strength Tab */}
          <TabsContent value="strength" className="space-y-6 mt-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                💪 Strength Progression
              </h3>
              
              {/* Current vs Starting */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-700 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-1">Starting Weight</div>
                  <div className="text-3xl font-bold text-orange-400">{firstWorkout.weight}kg</div>
                  <div className="text-sm text-gray-500">{firstWorkout.date}</div>
                </div>
                <div className="bg-gray-700 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-1">Current Weight</div>
                  <div className="text-3xl font-bold text-green-400">{latestWorkout.weight}kg</div>
                  <div className="text-sm text-gray-500">{latestWorkout.date}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Strength Progress</span>
                  <span className="text-orange-400 font-bold">+{strengthGain}kg ({((strengthGain / firstWorkout.weight) * 100).toFixed(1)}%)</span>
                </div>
                <Progress 
                  value={(strengthGain / firstWorkout.weight) * 100} 
                  className="h-3 bg-gray-700"
                />
              </div>

              {/* Strength Progression Chart */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-300">Strength Progression Chart</h4>
                <div className="bg-gray-700 rounded-xl p-4">
                  <Line data={strengthChartData} options={strengthChartOptions} />
                </div>
              </div>

              {/* Recent Workouts */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-300">Recent Workouts</h4>
                <div className="space-y-2">
                  {workoutStats.slice(-5).reverse().map((workout, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
                      <div>
                        <div className="font-medium">{workout.exercise}</div>
                        <div className="text-sm text-gray-400">{workout.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-orange-400">{workout.weight}kg</div>
                        <div className="text-sm text-gray-400">{workout.reps}×{workout.sets}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tips Tab */}
          <TabsContent value="tips" className="space-y-6 mt-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                💰 Community Support
              </h3>
              
              {/* Tips Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-700 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">${totalTips.toFixed(2)}</div>
                  <div className="text-sm text-gray-400">Total Received</div>
                </div>
                <div className="bg-gray-700 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-blue-400">{totalTipsCount}</div>
                  <div className="text-sm text-gray-400">Supporters</div>
                </div>
                <div className="bg-gray-700 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-purple-400">${averageTip.toFixed(2)}</div>
                  <div className="text-sm text-gray-400">Average Tip</div>
                </div>
              </div>

              {/* Tips Chart */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-300">Tips Over Time</h4>
                <div className="bg-gray-700 rounded-xl p-4">
                  <Bar data={tipsChartData} options={tipsChartOptions} />
                </div>
              </div>

              {/* Recent Tips */}
              <div className="space-y-2">
                <h4 className="text-lg font-semibold mb-4 text-gray-300">Recent Tips</h4>
                {tipsStats.slice(-5).reverse().map((tip, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
                    <div>
                      <div className="font-medium text-green-400">{tip.from}</div>
                      <div className="text-sm text-gray-400">{tip.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-400">${tip.amount}</div>
                      <div className="text-sm text-gray-400">{tip.currency}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6 mt-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                📈 Weekly Progress
              </h3>
              
              {/* Weekly Stats */}
              <div className="space-y-4">
                {weeklyProgress.slice(-4).reverse().map((week, index) => (
                  <div key={index} className="bg-gray-700 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">Week {week.week}</div>
                      <div className="text-sm text-gray-400">{week.workoutCount} workouts</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400">Max Weight</div>
                        <div className="text-xl font-bold text-orange-400">{week.maxWeight}kg</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Total Volume</div>
                        <div className="text-xl font-bold text-blue-400">{week.totalVolume.toFixed(0)}kg</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <div className="bg-gradient-to-r from-orange-900 to-red-900 rounded-2xl p-8 border border-orange-700 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
              🚀 Keep Pushing Forward!
            </h3>
            <p className="text-orange-200 mb-6 max-w-2xl mx-auto">
              Your progress is inspiring! Keep recording workouts, sharing on Farcaster, and motivating others in the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold px-6 py-2 rounded-xl text-sm"
                asChild
              >
                <Link href="/workout">🏋️‍♂️ Record Workout</Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white px-6 py-2 rounded-xl text-sm"
                asChild
              >
                <Link href="/">🏠 Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
