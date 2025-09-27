import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/?error=github_auth_failed`);
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/?error=no_code`);
  }

  try {
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
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/?error=token_exchange_failed`);
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
        description: 'Public repository for Git Fit workout data and progress sharing',
        private: false, // Public so images can be shared on Farcaster
        auto_init: true,
      }),
    });

    if (!createRepoResponse.ok) {
      const errorData = await createRepoResponse.json();
      // If repo already exists, that's okay
      if (!errorData.message?.includes('already exists')) {
        console.error('Failed to create repository:', errorData);
      }
    }

    // Create initial workout structure
    const workoutStructure = {
      'README.md': {
        content: Buffer.from(`# ${username}'s Git Fit Workouts

This is your public workout repository created by Git Fit.

## Structure
- \`workouts/\` - Your workout data
- \`photos/\` - Workout photos (public for Farcaster sharing)
- \`videos/\` - Workout videos (if any)

## Privacy Note
This repository is public so workout photos can be shared on Farcaster. Only share what you're comfortable with publicly.

## Sharing
- Photos are accessible via GitHub raw URLs
- Use #gitfit hashtag when sharing on Farcaster
- Your workout data helps inspire others!

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
      try {
        await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
          body: JSON.stringify(fileData),
        });
      } catch (fileError) {
        console.error(`Failed to create ${filePath}:`, fileError);
      }
    }

    // Redirect back to app with success
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/?github_connected=true&username=${username}&repo=${repoName}`);

  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/?error=github_connection_failed`);
  }
}
