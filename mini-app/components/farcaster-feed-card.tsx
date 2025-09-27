"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CryptoTipping from "./crypto-tipping";
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

interface FarcasterFeedCardProps {
  farcasterProfileUrl: string;
}

export default function FarcasterFeedCard({ farcasterProfileUrl }: FarcasterFeedCardProps) {
  const [posts, setPosts] = useState<FarcasterPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFarcasterConnected, setIsFarcasterConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

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

  useEffect(() => {
    // Check Farcaster connection status
    const connected = localStorage.getItem("farcaster_connected") === "true";
    setIsFarcasterConnected(connected);

    // Check URL parameters for Farcaster OAuth callback
    const params = new URLSearchParams(window.location.search);
    if (params.get("farcaster_connected") === "true") {
      setIsFarcasterConnected(true);
      localStorage.setItem("farcaster_connected", "true");
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleFarcasterConnection = async () => {
    setIsConnecting(true);
    
    try {
      // In a real Farcaster client, this would trigger wallet signature
      // The @farcaster/miniapp-sdk handles this automatically
      console.log("Initiating Farcaster wallet connection...");
      
      // For now, simulate the connection process
      // In production, this would be handled by the Farcaster client
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsFarcasterConnected(true);
      localStorage.setItem("farcaster_connected", "true");
      console.log("Farcaster wallet connected!");
      
    } catch (error) {
      console.error("Farcaster connection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };


  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-2xl p-6 border border-purple-700 shadow-2xl">
      <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent">
        📱 Farcaster & Support
      </h3>
      
      {/* Farcaster Connection Section */}
      <div className="mb-6">
        {!isFarcasterConnected ? (
          <div className="bg-purple-700/50 rounded-lg p-4 border border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-purple-200 mb-1">Connect to Farcaster</h4>
                <p className="text-purple-300 text-sm">To share workouts, connect your Farcaster account</p>
              </div>
              <Button 
                onClick={handleFarcasterConnection}
                disabled={isConnecting}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-4 py-2"
              >
                {isConnecting ? "⏳ Connecting..." : "📱 Connect"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-green-700/50 rounded-lg p-4 border border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-200 mb-1">✅ Farcaster Connected</h4>
                <p className="text-green-300 text-sm">Ready to share workouts</p>
              </div>
              <Button 
                asChild
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 py-2"
              >
                <a href={farcasterProfileUrl} target="_blank" rel="noopener noreferrer">
                  💬 Share Workouts
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Support Section */}
      <div className="mb-6">
        <CryptoTipping ownerWalletAddress={process.env.NEXT_PUBLIC_OWNER_WALLET_ADDRESS || "0x1234567890123456789012345678901234567890"} />
      </div>

      {/* Farcaster Feed */}
      <div>
        <h4 className="font-semibold text-purple-200 mb-3">📱 Recent Posts</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto"></div>
              <p className="text-purple-300 mt-2 text-sm">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-400 text-sm">Error loading posts</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-purple-400 mb-2">
                <span className="text-2xl">📱</span>
              </div>
              <h5 className="font-bold mb-1 text-purple-300 text-sm">No posts yet</h5>
              <p className="text-xs text-purple-400">Start posting with #gitfit to see your workouts here!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-purple-700/50 rounded-lg p-3 border border-purple-600">
                <div className="flex items-start gap-2">
                  <Image 
                    src={post.author.pfp_url} 
                    alt={post.author.display_name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-purple-200 text-xs">
                        {post.author.display_name}
                      </span>
                      <span className="text-purple-400 text-xs">
                        @{post.author.username}
                      </span>
                      <span className="text-purple-500 text-xs">
                        {formatTimestamp(post.timestamp)}
                      </span>
                    </div>
                    <p className="text-purple-100 text-xs leading-relaxed">
                      {post.text}
                    </p>
                    {post.embeds && post.embeds[0]?.image_url && (
                      <div className="mt-2">
                        <Image 
                          src={post.embeds[0].image_url} 
                          alt="Workout photo"
                          width={200}
                          height={80}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-purple-300 text-xs">
            Posts with #gitfit from @johnforfar
          </p>
        </div>
      </div>
    </div>
  );
}
