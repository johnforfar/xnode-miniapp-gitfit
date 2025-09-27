"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface GitHubActivityGraphProps {
  githubUsername: string;
}

interface GitHubActivityData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 0 = no activity, 4 = max activity
}

interface WorkoutDetail {
  date: string;
  exercise: string;
  weight: number;
  sets: number;
  reps: number;
  notes?: string;
  photoUrl?: string;
}

export default function GitHubActivityGraph({ githubUsername }: GitHubActivityGraphProps) {
  const [activityData, setActivityData] = useState<GitHubActivityData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDetail | null>(null);
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if GitHub is already connected
  useEffect(() => {
    const checkGitHubConnection = () => {
      const connected = localStorage.getItem('github-connected') === 'true';
      setIsGitHubConnected(connected);
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
  }, []);

  // Fetch real GitHub activity data
  useEffect(() => {
    const fetchGitHubActivity = async () => {
      if (!isGitHubConnected) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch GitHub activity data
        const response = await fetch(`/api/github/activity?username=${githubUsername}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch GitHub activity');
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setActivityData(data.activity || []);
        
        // Set default selected workout to most recent
        if (data.activity && data.activity.length > 0) {
          const mostRecent = data.activity
            .filter((item: GitHubActivityData) => item.count > 0)
            .sort((a: GitHubActivityData, b: GitHubActivityData) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];
          
          if (mostRecent) {
            setSelectedDate(mostRecent.date);
            // Fetch workout details for the selected date
            await fetchWorkoutDetails(mostRecent.date);
          }
        }

      } catch (err) {
        console.error('Error fetching GitHub activity:', err);
        setError(err instanceof Error ? err.message : 'Failed to load activity data');
        setActivityData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubActivity();
  }, [isGitHubConnected, githubUsername]);

  const fetchWorkoutDetails = async (date: string) => {
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
  };

  const handleGitHubConnection = async () => {
    setIsConnecting(true);
    
    try {
      // Redirect to GitHub OAuth
      window.location.href = '/api/github/connect';
    } catch (error) {
      console.error('GitHub connection failed:', error);
      setIsConnecting(false);
    }
  };

  const handleSquareClick = async (date: string, count: number) => {
    if (count === 0) return;
    
    setSelectedDate(date);
    await fetchWorkoutDetails(date);
  };

  const getActivityLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
    if (count === 0) return 0;
    if (count <= 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
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

  // Generate calendar data for the last year
  const generateCalendarData = () => {
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    const calendarData: GitHubActivityData[] = [];
    
    // Create activity map from fetched data
    const activityMap = new Map(activityData.map(item => [item.date, item]));
    
    // Generate all dates for the last year
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const activity = activityMap.get(dateStr) || { date: dateStr, count: 0, level: 0 };
      calendarData.push({
        date: dateStr,
        count: activity.count,
        level: getActivityLevel(activity.count)
      });
    }
    
    return calendarData;
  };

  const calendarData = generateCalendarData();
  const totalCommits = activityData.reduce((sum, item) => sum + item.count, 0);
  const activeDays = activityData.filter(item => item.count > 0).length;
  
  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    const dayActivity = activityData.find(item => item.date === dateStr);
    
    if (dayActivity && dayActivity.count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  for (const activity of activityData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())) {
    if (activity.count > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          @{githubUsername}'s Git Fit
        </h3>
        <div className="text-xs text-gray-400">{totalCommits} commits</div>
      </div>

      {/* GitHub Connection Section */}
      <div className="mb-6">
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-200 mb-1">
                {isGitHubConnected ? "GitHub Connected" : "Connect to GitHub"}
              </h4>
              <p className="text-gray-400 text-sm">
                {isGitHubConnected 
                  ? "Ready to record your workout"
                  : "To save workout data, connect your GitHub account"
                }
              </p>
            </div>
            <Button 
              onClick={!isGitHubConnected ? handleGitHubConnection : undefined}
              disabled={isConnecting}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2"
            >
              {isGitHubConnected ? (
                <Link href="/workout" className="flex items-center gap-2">
                  🏋️‍♂️ Record Workout
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  {isConnecting ? "⏳" : "🔗"} Connect
                </div>
              )}
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

      {/* Activity Graph */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto"></div>
            <p className="text-gray-300 mt-2 text-sm">Loading GitHub activity...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-400 text-sm">{error}</p>
            <p className="text-gray-400 text-xs mt-1">Connect to GitHub to see your activity</p>
          </div>
        ) : (
          <>
            {/* Month Labels */}
            <div className="flex text-xs text-gray-400">
              <div className="w-6 mr-2"></div>
              <div className="flex-1 flex justify-between">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                  <div key={month} className="text-center" style={{width: '8.333333333333334%'}}>
                    {index % 2 === 0 ? month : ''}
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex gap-1 overflow-hidden">
              {/* Day Labels */}
              <div className="flex flex-col gap-1 mr-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <div key={day} className="h-3 text-xs text-gray-400 flex items-center">
                    {index % 2 === 0 ? day : ''}
                  </div>
                ))}
              </div>

              {/* Activity Squares */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                {Array.from({ length: Math.ceil(calendarData.length / 7) }, (_, weekIndex) => (
                  <div key={weekIndex} className="flex gap-1">
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const dataIndex = weekIndex * 7 + dayIndex;
                      const activity = calendarData[dataIndex];
                      
                      if (!activity) {
                        return <div key={dayIndex} className="w-3 h-3"></div>;
                      }

                      const isSelected = selectedDate === activity.date;
                      const baseClasses = `w-3 h-3 cursor-pointer transition-all duration-200 ${getActivityColor(activity.level)}`;
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
            <div className="flex items-center justify-between text-xs text-gray-400">
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
          </>
        )}
      </div>

      {/* Workout Details */}
      {selectedWorkout && (
        <div className="mt-4 bg-gradient-to-br from-orange-900 to-red-900 rounded-xl p-4 border border-orange-700 shadow-xl">
          <h4 className="text-lg font-bold mb-3 bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
            🏋️‍♂️ {formatDate(selectedDate)}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-lg p-3">
                <h5 className="font-semibold text-orange-300 mb-2 text-sm">Exercise Details</h5>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Exercise:</span>
                    <span className="text-white font-medium">{selectedWorkout.exercise}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Weight:</span>
                    <span className="text-orange-400 font-bold">{selectedWorkout.weight} lbs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Sets:</span>
                    <span className="text-white">{selectedWorkout.sets}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Reps:</span>
                    <span className="text-white">{selectedWorkout.reps}</span>
                  </div>
                </div>
              </div>
              {selectedWorkout.notes && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <h5 className="font-semibold text-orange-300 mb-2 text-sm">Notes</h5>
                  <p className="text-gray-300 text-xs">{selectedWorkout.notes}</p>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {selectedWorkout.photoUrl && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <h5 className="font-semibold text-orange-300 mb-2 text-sm">Workout Photo</h5>
                  <img 
                    src={selectedWorkout.photoUrl} 
                    alt="Workout" 
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