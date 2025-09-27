import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const farcasterUsername = process.env.FARCASTER_USERNAME || 'johnforfar';
    const apiKey = process.env.FARCASTER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        posts: [],
        error: 'Farcaster API key not configured' 
      });
    }

    // Fetch recent casts from the user
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${farcasterUsername}&viewer_fid=${farcasterUsername}`, {
      headers: {
        'api_key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.status}`);
    }

    const userData = await response.json();
    const userFid = userData.users?.[0]?.fid;

    if (!userFid) {
      return NextResponse.json({ 
        posts: [],
        error: 'User not found' 
      });
    }

    // Fetch recent casts from the user
    const castsResponse = await fetch(`https://api.neynar.com/v2/farcaster/feed/user?fid=${userFid}&limit=20`, {
      headers: {
        'api_key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!castsResponse.ok) {
      throw new Error(`Casts API error: ${castsResponse.status}`);
    }

    const castsData = await castsResponse.json();
    
    // Filter posts that contain #gitfit hashtag
    const gitfitPosts = castsData.casts?.filter((cast: any) => 
      cast.text?.toLowerCase().includes('#gitfit') ||
      cast.text?.toLowerCase().includes('gitfit') ||
      cast.text?.toLowerCase().includes('🏋️') ||
      cast.text?.toLowerCase().includes('workout')
    ) || [];

    // Transform the data to match our interface
    const posts = gitfitPosts.map((cast: any) => ({
      hash: cast.hash,
      text: cast.text,
      timestamp: cast.timestamp,
      author: {
        fid: cast.author.fid,
        username: cast.author.username,
        display_name: cast.author.display_name,
        pfp_url: cast.author.pfp_url,
      },
      embeds: cast.embeds?.map((embed: any) => ({
        url: embed.url,
        metadata: embed.metadata
      })) || []
    }));

    return NextResponse.json({ posts });

  } catch (error) {
    console.error('Error fetching Farcaster posts:', error);
    
    return NextResponse.json({ 
      posts: [],
      error: 'Failed to fetch Farcaster posts. Please check your API key configuration.'
    }, { status: 500 });
  }
}
