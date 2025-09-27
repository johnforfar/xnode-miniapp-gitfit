import { NextRequest, NextResponse } from 'next/server';

interface GitHubFile {
  name: string;
  path: string;
  download_url: string;
}

interface WorkoutData {
  date: string;
  exercise: string;
  weight: number;
  sets: number;
  reps: number;
  notes: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Check if user has GitHub access token stored
    const accessToken = process.env.GITHUB_ACCESS_TOKEN; // This should come from user's stored token
    
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'GitHub access token not available',
        workouts: null
      }, { status: 401 });
    }

    const repoName = `${username}-gitfit-workouts`;
    
    // Fetch all workout files from the user's Git Fit repository
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/workouts`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitFit-App'
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ 
          error: 'No workout repository found',
          workouts: null
        }, { status: 404 });
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const files: GitHubFile[] = await response.json();
    
    // Filter for JSON workout files and fetch their content
    const workoutFiles = files.filter((file: GitHubFile) => file.name.endsWith('.json'));
    const workouts = [];
    
    for (const file of workoutFiles.slice(0, 10)) { // Limit to last 10 workouts
      try {
        const fileResponse = await fetch(file.download_url);
        if (fileResponse.ok) {
          const workoutData = await fileResponse.json();
          workouts.push(workoutData);
        }
      } catch (error) {
        console.error(`Failed to fetch workout file ${file.name}:`, error);
      }
    }

    // Sort workouts by date (most recent first)
    workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate stats
    const stats = {
      totalWorkouts: workouts.length,
      currentStreak: calculateCurrentStreak(workouts),
      longestStreak: calculateLongestStreak(workouts),
      favoriteExercise: getFavoriteExercise(workouts),
      maxWeight: getMaxWeight(workouts)
    };

    return NextResponse.json({ 
      workouts: {
        recentWorkouts: workouts.slice(0, 5), // Last 5 workouts
        stats
      }
    });

  } catch (error) {
    console.error('Error fetching workout data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout data', workouts: null },
      { status: 500 }
    );
  }
}

function calculateCurrentStreak(workouts: WorkoutData[]): number {
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const hasWorkout = workouts.some(workout => workout.date === dateStr);
    if (hasWorkout) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function calculateLongestStreak(workouts: WorkoutData[]): number {
  let longestStreak = 0;
  let currentStreak = 0;
  
  const sortedWorkouts = workouts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  for (let i = 0; i < sortedWorkouts.length - 1; i++) {
    const currentDate = new Date(sortedWorkouts[i].date);
    const nextDate = new Date(sortedWorkouts[i + 1].date);
    const dayDiff = (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (dayDiff === 1) {
      currentStreak++;
    } else {
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 0;
    }
  }
  
  return Math.max(longestStreak, currentStreak);
}

function getFavoriteExercise(workouts: WorkoutData[]): string {
  const exerciseCount: { [key: string]: number } = {};
  
  workouts.forEach(workout => {
    exerciseCount[workout.exercise] = (exerciseCount[workout.exercise] || 0) + 1;
  });
  
  return Object.entries(exerciseCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';
}

function getMaxWeight(workouts: WorkoutData[]): number {
  return Math.max(...workouts.map(workout => workout.weight || 0), 0);
}
