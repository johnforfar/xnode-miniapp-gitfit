import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json({ error: 'Authorization code required' }, { status: 400 });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error_description }, { status: 400 });
    }

    const accessToken = tokenData.access_token;

    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const userData = await userResponse.json();
    const username = userData.login;

    // Create private repository for workout data
    const repoName = `${username}-gitfit-workouts`;
    const createRepoResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        name: repoName,
        description: 'Private repository for Git Fit workout data',
        private: true,
        auto_init: true,
      }),
    });

    if (!createRepoResponse.ok) {
      const errorData = await createRepoResponse.json();
      // If repo already exists, that's okay
      if (errorData.message?.includes('already exists')) {
        console.log(`Repository ${repoName} already exists`);
      } else {
        throw new Error(`Failed to create repository: ${errorData.message}`);
      }
    }

    // Create initial workout structure
    const workoutStructure = {
      'README.md': {
        content: Buffer.from(`# ${username}'s Git Fit Workouts

This is your private workout repository created by Git Fit.

## Structure
- \`workouts/\` - Your workout data
- \`photos/\` - Workout photos
- \`videos/\` - Workout videos (if any)

## Privacy
This repository is private and only you can see your workout data.

---
*Created by Git Fit - Get fit with Git!*
`).toString('base64'),
        message: 'Initial Git Fit workout repository setup',
      },
      'workouts/.gitkeep': {
        content: Buffer.from('').toString('base64'),
        message: 'Create workouts directory',
      },
      'photos/.gitkeep': {
        content: Buffer.from('').toString('base64'),
        message: 'Create photos directory',
      },
    };

    // Create initial files
    for (const [filePath, fileData] of Object.entries(workoutStructure)) {
      await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify(fileData),
      });
    }

    return NextResponse.json({
      success: true,
      username,
      repoName,
      repoUrl: `https://github.com/${username}/${repoName}`,
      accessToken, // In production, store this securely
    });

  } catch (error) {
    console.error('GitHub connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to GitHub' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Redirect to GitHub OAuth
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/github/callback`;
  const scope = 'repo,user';
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  
  return NextResponse.redirect(authUrl);
}
