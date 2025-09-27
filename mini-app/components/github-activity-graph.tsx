"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface GitHubActivityGraphProps {
  githubUsername: string;
}

interface GitHubActivityData {
  date: string;
  count: number;
  level: number;
}

interface WorkoutDetail {
  date: string;
  exercise: string;
  weight: number;
  sets: number;
  reps: number;
  notes: string;
  photoUrl: string;
}

export default function GitHubActivityGraph({ githubUsername }: GitHubActivityGraphProps) {
  // Generate mock data for the last month (more compact)
  const generateMockActivityData = (): GitHubActivityData[] => {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    const mockData: GitHubActivityData[] = [];
    
    // Generate workout days deterministically (fewer days, every 5-6 days)
    const workoutDays: string[] = [];
    let dayCounter = 0;
    for (let d = new Date(oneMonthAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      
      // Add workout days: every 5-6 days, avoiding Sundays
      if (dayOfWeek !== 0 && dayCounter % 5 === 0) {
        workoutDays.push(dateStr);
      }
      dayCounter++;
    }
    
    for (let d = new Date(oneMonthAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const isWorkoutDay = workoutDays.includes(dateStr);
      
      mockData.push({
        date: dateStr,
        count: isWorkoutDay ? 2 : 0,
        level: isWorkoutDay ? 1 : 0
      });
    }
    
    return mockData;
  };

  // Generate mock workout details dynamically to match the generated dates
  const generateMockWorkoutDetails = (): { [key: string]: WorkoutDetail } => {
    const workoutDetails: { [key: string]: WorkoutDetail } = {};
    const exercises = ["Deadlift", "Bench Press", "Squat", "Overhead Press", "Pull-ups", "Barbell Rows"];
    const weights = [225, 185, 275, 135, 0, 165];
    const notes = [
      "New PR! Form was solid.",
      "Strong session. Feeling good.",
      "Heavy day. Great form.",
      "PR! Feeling strong.",
      "Bodyweight work. Added weight.",
      "Strong back day! Rows feeling good."
    ];
    
    // Generate workout details for the last month
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    let dayCounter = 0;
    for (let d = new Date(oneMonthAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      
      // Add workout details for workout days (every 5-6 days, avoiding Sundays)
      if (dayOfWeek !== 0 && dayCounter % 5 === 0) {
        const exerciseIndex = dayCounter % exercises.length;
        workoutDetails[dateStr] = {
          date: dateStr,
          exercise: exercises[exerciseIndex],
          weight: weights[exerciseIndex],
          sets: 4 + (dayCounter % 3),
          reps: 3 + (dayCounter % 4),
          notes: notes[exerciseIndex],
          photoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
        };
      }
      dayCounter++;
    }
    
    return workoutDetails;
  };

  const mockActivityData = generateMockActivityData();
  const mockWorkoutDetails = generateMockWorkoutDetails();
  
  // Initialize with most recent mock workout
  const mostRecentMockWorkout = mockActivityData
    .filter((item: GitHubActivityData) => item.count > 0)
    .sort((a: GitHubActivityData, b: GitHubActivityData) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

  // State initialization with mock data
  const [activityData, setActivityData] = useState<GitHubActivityData[]>(mockActivityData);
  const [selectedDate, setSelectedDate] = useState<string | null>(mostRecentMockWorkout?.date || null);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDetail | null>(mostRecentMockWorkout ? mockWorkoutDetails[mostRecentMockWorkout.date] || null : null);
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if GitHub is already connected
  useEffect(() => {
    const checkGitHubConnection = () => {
      const connected = localStorage.getItem('github-connected') === 'true';
      setIsGitHubConnected(connected);
      
      // If not connected, immediately load mock data
      if (!connected) {
        setActivityData(mockActivityData);
        
        // Set default selected workout to most recent mock data
        const mostRecent = mockActivityData
          .filter((item: GitHubActivityData) => item.count > 0)
          .sort((a: GitHubActivityData, b: GitHubActivityData) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];
        
        if (mostRecent) {
          setSelectedDate(mostRecent.date);
          setSelectedWorkout(mockWorkoutDetails[mostRecent.date] || null);
        }
      }
    };
    checkGitHubConnection();

    // Check URL parameters for GitHub connection success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('github_connected') === 'true') {
      const username = urlParams.get('username');
      const repo = urlParams.get('repo');
      
      localStorage.setItem('github-connected', 'true');
      localStorage.setItem('github-username', username || '');
      localStorage.setItem('github-repo', repo || '');
      setIsGitHubConnected(true);
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [mockActivityData, mockWorkoutDetails]);

  const fetchWorkoutDetails = useCallback(async (date: string) => {
    try {
      const response = await fetch(`/api/github/workout?date=${date}&username=${githubUsername}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.workout) {
          setSelectedWorkout(data.workout);
        }
      }
    } catch (err) {
      console.error('Error fetching workout details:', err);
    }
  }, [githubUsername]);

  // Load activity data when GitHub connection status changes
  useEffect(() => {
    const loadActivityData = async () => {
      try {
        if (!isGitHubConnected) {
          // Use mock data when not connected
          setActivityData(mockActivityData);
          
          // Set default selected workout to most recent mock data
          const mostRecent = mockActivityData
            .filter((item: GitHubActivityData) => item.count > 0)
            .sort((a: GitHubActivityData, b: GitHubActivityData) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];
          
          if (mostRecent) {
            setSelectedDate(mostRecent.date);
            setSelectedWorkout(mockWorkoutDetails[mostRecent.date] || null);
          }
          
          return;
        } else {
          // Fetch real GitHub activity data
          const response = await fetch(`/api/github/activity?username=${githubUsername}`);
          
          if (response.ok) {
            const data = await response.json();
            setActivityData(data.activity || []);
            
            // Set default selected workout to most recent
            const mostRecent = data.activity
              ?.filter((item: GitHubActivityData) => item.count > 0)
              ?.sort((a: GitHubActivityData, b: GitHubActivityData) => 
                new Date(b.date).getTime() - new Date(a.date).getTime()
              )?.[0];
            
            if (mostRecent) {
              setSelectedDate(mostRecent.date);
              await fetchWorkoutDetails(mostRecent.date);
            }
          } else {
            console.error('Failed to load GitHub activity');
          }
        }
      } catch (err) {
        console.error('Error loading activity data:', err);
      }
    };

    loadActivityData();
  }, [isGitHubConnected, githubUsername, mockActivityData, mockWorkoutDetails, fetchWorkoutDetails]);

  const handleGitHubConnection = async () => {
    setIsConnecting(true);
    
    try {
      // Redirect to GitHub OAuth
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/api/github/callback')}&scope=repo&state=${encodeURIComponent(JSON.stringify({ username: githubUsername }))}`;
      window.location.href = githubAuthUrl;
    } catch (err) {
      console.error('Error connecting to GitHub:', err);
      setIsConnecting(false);
    }
  };

  const handleSquareClick = async (date: string, count: number) => {
    if (count === 0) return;
    
    setSelectedDate(date);
    
    if (!isGitHubConnected) {
      // Use mock data when not connected
      setSelectedWorkout(mockWorkoutDetails[date] || null);
    } else {
      // Fetch real workout details
      await fetchWorkoutDetails(date);
    }
  };

  const getActivityColor = (level: number) => {
    const colors = {
      0: "bg-gray-800 border border-gray-700 hover:bg-gray-700",
      1: "bg-green-400 hover:bg-green-300",
      2: "bg-green-500 hover:bg-green-400", 
      3: "bg-green-600 hover:bg-green-500",
      4: "bg-green-700 hover:bg-green-600"
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  // Generate calendar data for the last month when using mock data, full year when connected
  const generateCalendarData = () => {
    const today = new Date();
    let startDate: Date;
    
    if (isGitHubConnected) {
      // Show full year when connected to GitHub
      startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    } else {
      // Show only last month when using mock data
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
    }
    
    const calendarData: GitHubActivityData[] = [];
    const activityMap = new Map(activityData.map(item => [item.date, item]));
    
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const activity = activityMap.get(dateStr) || { date: dateStr, count: 0, level: 0 };
      calendarData.push({
        date: dateStr,
        count: activity.count,
        level: activity.level // Preserve the original level from mock data
      });
    }
    
    return calendarData;
  };

  const calendarData = generateCalendarData();
  const totalCommits = activityData.reduce((sum, item) => sum + item.count, 0);
  const activeDays = activityData.filter(item => item.count > 0).length;
  
  // Calculate streaks
  const calculateStreaks = () => {
    const sortedData = [...activityData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < sortedData.length; i++) {
      if (sortedData[i].count > 0) {
        if (i === 0 || tempStreak === 0) {
          tempStreak = 1;
        } else {
          const prevDate = new Date(sortedData[i-1].date);
          const currDate = new Date(sortedData[i].date);
          const daysDiff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        
        if (i === 0) {
          currentStreak = tempStreak;
        }
      } else {
        if (tempStreak > 0) {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 0;
        }
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    return { currentStreak, longestStreak };
  };

  const { currentStreak, longestStreak } = calculateStreaks();

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">@johnforfar&apos;s Git Fit</h3>
          <div className="text-xs text-gray-400">{totalCommits} commits</div>
        </div>
      </div>

      {/* GitHub Connection Section */}
      <div className="mb-6">
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-200 mb-1">
                {isGitHubConnected ? 'GitHub Connected' : 'Connect to GitHub'}
              </h4>
              <p className="text-gray-400 text-sm">
                {isGitHubConnected ? 'Ready to record workouts!' : 'To save workout data, connect your GitHub account'}
              </p>
            </div>
            <Button
              onClick={handleGitHubConnection}
              disabled={isConnecting}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2"
            >
              <div className="flex items-center gap-2">
                🔗 {isConnecting ? 'Connecting...' : (isGitHubConnected ? 'Record Workout' : 'Connect')}
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-gray-700 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-green-400">{totalCommits}</div>
          <div className="text-xs text-gray-400">Commits</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-blue-400">{activeDays}</div>
          <div className="text-xs text-gray-400">Days</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-orange-400">{currentStreak}</div>
          <div className="text-xs text-gray-400">Streak</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-purple-400">{longestStreak}</div>
          <div className="text-xs text-gray-400">Best</div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Month Labels */}
        <div className="flex text-xs text-gray-400 mb-2">
          <div className="w-6 mr-2"></div>
          <div className="flex-1 flex">
            <div className="flex-1 text-center">Jan</div>
            <div className="flex-1 text-center"></div>
            <div className="flex-1 text-center">Mar</div>
            <div className="flex-1 text-center"></div>
            <div className="flex-1 text-center">May</div>
            <div className="flex-1 text-center"></div>
            <div className="flex-1 text-center">Jul</div>
            <div className="flex-1 text-center"></div>
            <div className="flex-1 text-center">Sep</div>
            <div className="flex-1 text-center"></div>
            <div className="flex-1 text-center">Nov</div>
            <div className="flex-1 text-center"></div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex gap-1">
          {/* Day Labels */}
          <div className="flex flex-col gap-1 mr-2">
            <div className="h-3 text-xs text-gray-400 flex items-center">Sun</div>
            <div className="h-3 text-xs text-gray-400 flex items-center"></div>
            <div className="h-3 text-xs text-gray-400 flex items-center">Tue</div>
            <div className="h-3 text-xs text-gray-400 flex items-center"></div>
            <div className="h-3 text-xs text-gray-400 flex items-center">Thu</div>
            <div className="h-3 text-xs text-gray-400 flex items-center"></div>
            <div className="h-3 text-xs text-gray-400 flex items-center">Sat</div>
          </div>
          
          {/* Calendar Squares */}
          <div className="flex flex-col gap-1 flex-1">
            {Array.from({ length: Math.ceil(calendarData.length / 7) }, (_, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const dataIndex = weekIndex * 7 + dayIndex;
                  const activity = calendarData[dataIndex];
                  
                  if (!activity) {
                    return <div key={dayIndex} className="flex-1 aspect-square"></div>;
                  }
                  
                  const isSelected = selectedDate === activity.date;
                  const baseClasses = `flex-1 aspect-square cursor-pointer transition-all duration-200 ${getActivityColor(activity.level)}`;
                  const selectedClasses = isSelected ? "border-2 border-orange-300" : "";

                  return (
                    <div
                      key={dayIndex}
                      className={`${baseClasses} ${selectedClasses}`}
                      onClick={() => handleSquareClick(activity.date, activity.count)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-800 border border-gray-700"></div>
            <div className="w-3 h-3 bg-green-400"></div>
            <div className="w-3 h-3 bg-green-500"></div>
            <div className="w-3 h-3 bg-green-600"></div>
            <div className="w-3 h-3 bg-green-700"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Selected Workout Details */}
      {selectedWorkout && (
        <div className="mt-6 bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <h4 className="font-semibold text-gray-200 mb-3">Workout Details - {selectedDate}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Exercise:</span>
                <span className="text-white font-medium">{selectedWorkout.exercise}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Weight:</span>
                <span className="text-white font-medium">{selectedWorkout.weight} lbs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sets:</span>
                <span className="text-white font-medium">{selectedWorkout.sets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Reps:</span>
                <span className="text-white font-medium">{selectedWorkout.reps}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-gray-400">Notes:</span>
                <p className="text-white text-sm mt-1">{selectedWorkout.notes}</p>
              </div>
              {selectedWorkout.photoUrl && (
                <div>
                  <Image 
                    src={selectedWorkout.photoUrl} 
                    alt="Workout photo" 
                    width={300}
                    height={128}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}