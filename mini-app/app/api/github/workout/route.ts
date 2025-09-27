import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const username = searchParams.get('username');
    
    if (!date || !username) {
      return NextResponse.json({ error: 'Date and username are required' }, { status: 400 });
    }

    // Check if user has GitHub access token stored
    const accessToken = process.env.GITHUB_ACCESS_TOKEN; // This should come from user's stored token
    
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'GitHub access token not available',
        workout: null
      }, { status: 401 });
    }

    const repoName = `${username}-gitfit-workouts`;
    
    // Fetch workout data from the user's Git Fit repository
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/workouts/${date}.json`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitFit-App'
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ 
          error: 'No workout data found for this date',
          workout: null
        }, { status: 404 });
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const fileData = await response.json();
    
    // Decode the base64 content
    const workoutJson = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const workout = JSON.parse(workoutJson);

    return NextResponse.json({ workout });

  } catch (error) {
    console.error('Error fetching workout data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout data', workout: null },
      { status: 500 }
    );
  }
}
