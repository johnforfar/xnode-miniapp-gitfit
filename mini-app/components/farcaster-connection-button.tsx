"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

interface FarcasterConnectionButtonProps {
  farcasterProfileUrl: string;
}

export default function FarcasterConnectionButton({ farcasterProfileUrl }: FarcasterConnectionButtonProps) {
  // Farcaster connection state
  const [isFarcasterConnected, setIsFarcasterConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if Farcaster is already connected
  useEffect(() => {
    const checkFarcasterConnection = () => {
      const connected = localStorage.getItem('farcaster-connected') === 'true';
      setIsFarcasterConnected(connected);
    };
    checkFarcasterConnection();
  }, []);

  const handleFarcasterConnection = async () => {
    setIsConnecting(true);
    
    try {
      // In a real app, this would connect to Farcaster
      // For now, simulate the connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('farcaster-connected', 'true');
      setIsFarcasterConnected(true);
      
    } catch (error) {
      console.error('Farcaster connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-2xl p-6 border border-purple-700 shadow-2xl">
      <div className="text-center space-y-4">
        <h3 className="font-bold text-xl bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent">
          📱 Farcaster
        </h3>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
          <Button 
            size="lg" 
            className="relative bg-gradient-to-r from-purple-800 to-purple-900 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 h-auto border-2 border-purple-600 shadow-xl transform hover:scale-105 transition-all duration-300 w-full"
            onClick={!isFarcasterConnected ? handleFarcasterConnection : undefined}
            disabled={isConnecting}
          >
            {isFarcasterConnected ? (
              <div className="flex items-center gap-2">
                <span className="text-xl">📱</span>
                <span className="font-bold">SHARE WORKOUTS</span>
                <span className="text-purple-300">→</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl">{isConnecting ? "⏳" : "📱"}</span>
                <span className="font-bold">
                  {isConnecting ? "CONNECTING..." : "CONNECT TO FARCASTER"}
                </span>
                <span className="text-purple-300">→</span>
              </div>
            )}
          </Button>
        </div>
        
        <p className="text-purple-300 text-sm">
          {isFarcasterConnected 
            ? "Ready to share workouts with #gitfit"
            : "To share workouts, CONNECT TO FARCASTER"
          }
        </p>
      </div>
    </div>
  );
}
