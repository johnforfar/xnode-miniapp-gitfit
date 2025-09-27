import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const farcasterUsername = process.env.FARCASTER_USERNAME || 'johnforfar';
    const apiKey = process.env.FARCASTER_API_KEY;
    
    // Mock data for when API key is not configured
    const mockPosts = [
      {
        id: "mock-1",
        text: "Just crushed a deadlift PR! 255 lbs! 💪 #gitfit #fitness #strength",
        author: {
          username: "johnforfar",
          display_name: "John Forfar",
          pfp_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        embeds: [{
          url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
        }]
      },
      {
        id: "mock-2", 
        text: "Morning workout complete! Bench press feeling strong today 🏋️‍♂️ #gitfit #morningmotivation",
        author: {
          username: "johnforfar",
          display_name: "John Forfar", 
          pfp_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        },
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        embeds: [{
          url: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop",
          image_url: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop"
        }]
      },
      {
        id: "mock-3",
        text: "Squat day! 300+ lbs achieved! 🎉 The grind never stops #gitfit #squats #pr",
        author: {
          username: "johnforfar",
          display_name: "John Forfar",
          pfp_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        },
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        embeds: [{
          url: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop",
          image_url: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop"
        }]
      },
      {
        id: "mock-4",
        text: "Pull-up progression going well! Added 25 lbs weighted pull-ups 💪 #gitfit #pullups #progression",
        author: {
          username: "johnforfar",
          display_name: "John Forfar",
          pfp_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        },
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        embeds: [{
          url: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop",
          image_url: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop"
        }]
      },
      {
        id: "mock-5",
        text: "Overhead press PR! 150 lbs overhead! 🎯 #gitfit #overheadpress #strength",
        author: {
          username: "johnforfar",
          display_name: "John Forfar",
          pfp_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        },
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        embeds: [{
          url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
        }]
      }
    ];
    
    if (!apiKey) {
      return NextResponse.json({ 
        posts: mockPosts,
        mock: true,
        message: 'Using mock data - configure FARCASTER_API_KEY for real posts'
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
    
    // Return mock data as fallback
    const mockPosts = [
      {
        id: "fallback-1",
        text: "Mock workout post! Deadlift PR! 💪 #gitfit #fitness #strength",
        author: {
          username: "johnforfar",
          display_name: "John Forfar",
          pfp_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        embeds: [{
          url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
        }]
      },
      {
        id: "fallback-2",
        text: "Mock bench press workout! 🏋️‍♂️ #gitfit #morningmotivation",
        author: {
          username: "johnforfar",
          display_name: "John Forfar",
          pfp_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        },
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        embeds: [{
          url: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop",
          image_url: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop"
        }]
      }
    ];
    
    return NextResponse.json({ 
      posts: mockPosts,
      mock: true,
      error: 'API failed, using mock data'
    });
  }
}
