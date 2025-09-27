import { NextRequest, NextResponse } from 'next/server';

interface GitHubCommit {
  message: string;
}

interface GitHubEvent {
  type: string;
  created_at: string;
  payload: {
    commits: GitHubCommit[];
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Check if user has GitHub access token stored
    // In a real app, this would be stored securely (encrypted in database)
    const accessToken = process.env.GITHUB_ACCESS_TOKEN; // This should come from user's stored token
    
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'GitHub access token not available',
        activity: []
      }, { status: 401 });
    }

    // Fetch user's contribution data from GitHub API
    const response = await fetch(`https://api.github.com/users/${username}/events/public`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitFit-App'
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const events: GitHubEvent[] = await response.json();
    
    // Process events to create activity data
    const activityMap = new Map<string, number>();
    
    // Filter for PushEvents (commits) and count them by date
    events.forEach((event: GitHubEvent) => {
      if (event.type === 'PushEvent') {
        const date = event.created_at.split('T')[0];
        const currentCount = activityMap.get(date) || 0;
        activityMap.set(date, currentCount + event.payload.commits.length);
      }
    });

    // Convert to array format
    const activity = Array.from(activityMap.entries()).map(([date, count]) => ({
      date,
      count,
      level: getActivityLevel(count)
    }));

    // Sort by date
    activity.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({ activity });

  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub activity', activity: [] },
      { status: 500 }
    );
  }
}

function getActivityLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}
