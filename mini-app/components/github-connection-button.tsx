"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function GitHubConnectionButton() {
  // GitHub connection state
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if GitHub is already connected (in real app, this would check localStorage or API)
  useEffect(() => {
    const checkGitHubConnection = () => {
      const connected = localStorage.getItem('github-connected') === 'true';
      setIsGitHubConnected(connected);
    };
    checkGitHubConnection();

    // Check URL parameters for GitHub connection success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('github_connected') === 'true') {
      const username = urlParams.get('username');
      const repo = urlParams.get('repo');
      
      localStorage.setItem('github-connected', 'true');
      localStorage.setItem('github-username', username || '');
      localStorage.setItem('github-repo', repo || '');
      setIsGitHubConnected(true);
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleGitHubConnection = async () => {
    setIsConnecting(true);
    
    try {
      // Redirect to GitHub OAuth
      window.location.href = '/api/github/connect';
    } catch (error) {
      console.error('GitHub connection failed:', error);
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl">
      <div className="text-center space-y-4">
        <h3 className="font-bold text-xl bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
          🔗 GitHub
        </h3>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
          <Button 
            size="lg" 
            className="relative bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-4 h-auto border-2 border-gray-600 shadow-xl transform hover:scale-105 transition-all duration-300 w-full"
            onClick={!isGitHubConnected ? handleGitHubConnection : undefined}
            disabled={isConnecting}
          >
            {isGitHubConnected ? (
              <Link href="/workout" className="flex items-center gap-2">
                <span className="text-xl">🏋️‍♂️</span>
                <span className="font-bold">RECORD WORKOUT</span>
                <span className="text-gray-400">→</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl">{isConnecting ? "⏳" : "🔗"}</span>
                <span className="font-bold">
                  {isConnecting ? "CONNECTING..." : "CONNECT TO GITHUB"}
                </span>
                <span className="text-gray-400">→</span>
              </div>
            )}
          </Button>
        </div>
        
        <p className="text-gray-400 text-sm">
          {isGitHubConnected 
            ? "Ready to record your workout"
            : "To save workout data, CONNECT TO GITHUB"
          }
        </p>
      </div>
    </div>
  );
}
