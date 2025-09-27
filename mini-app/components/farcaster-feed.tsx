"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface FarcasterPost {
  id: string;
  text: string;
  author: {
    username: string;
    display_name: string;
    pfp_url: string;
  };
  timestamp: string;
  embeds?: Array<{
    url: string;
    image_url?: string;
  }>;
}

export default function FarcasterFeed() {
  const [posts, setPosts] = useState<FarcasterPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/farcaster/feed');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Error fetching Farcaster posts:', err);
        setError('Failed to load posts');
        // Set mock data for development
        setPosts([
          {
            id: "1",
            text: "Just crushed a deadlift PR! 275lbs x 8 reps 💪 #gitfit #fitness #strength",
            author: {
              username: "johnforfar",
              display_name: "John Forfar",
              pfp_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face"
            },
            timestamp: "2025-09-27T10:30:00Z",
            embeds: [{
              url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
              image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
            }]
          },
          {
            id: "2", 
            text: "Morning workout complete! Squats feeling strong today 🏋️‍♂️ #gitfit #morningworkout",
            author: {
              username: "johnforfar",
              display_name: "John Forfar", 
              pfp_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face"
            },
            timestamp: "2025-09-26T07:15:00Z"
          },
          {
            id: "3",
            text: "New bench press personal record! 225lbs x 6 reps 🔥 #gitfit #benchpress #pr",
            author: {
              username: "johnforfar",
              display_name: "John Forfar",
              pfp_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face"
            },
            timestamp: "2025-09-25T18:45:00Z"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-2xl p-6 border border-purple-700 shadow-2xl">
        <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent">
          📱 Farcaster Feed
        </h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-purple-300 mt-2">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-2xl p-6 border border-purple-700 shadow-2xl">
        <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent">
          📱 Farcaster Feed
        </h3>
        <div className="text-center py-8">
          <p className="text-red-400">Error loading posts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-2xl p-6 border border-purple-700 shadow-2xl">
      <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent">
        📱 Farcaster Feed
      </h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-purple-400 mb-2">
              <span className="text-4xl">📱</span>
            </div>
            <h4 className="text-lg font-bold mb-2 text-purple-300">No posts yet</h4>
            <p className="text-sm text-purple-400">Start posting with #gitfit to see your workouts here!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-purple-700/50 rounded-lg p-4 border border-purple-600">
              <div className="flex items-start gap-3">
                <Image 
                  src={post.author.pfp_url} 
                  alt={post.author.display_name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-purple-200 text-sm">
                      {post.author.display_name}
                    </span>
                    <span className="text-purple-400 text-xs">
                      @{post.author.username}
                    </span>
                    <span className="text-purple-500 text-xs">
                      {formatTimestamp(post.timestamp)}
                    </span>
                  </div>
                  <p className="text-purple-100 text-sm leading-relaxed">
                    {post.text}
                  </p>
                  {post.embeds && post.embeds[0]?.image_url && (
                    <div className="mt-3">
                      <Image 
                        src={post.embeds[0].image_url} 
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
          ))
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-purple-300 text-xs">
          Posts with #gitfit from @johnforfar
        </p>
      </div>
    </div>
  );
}