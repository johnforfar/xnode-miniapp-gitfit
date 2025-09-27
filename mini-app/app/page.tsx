import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import GitHubActivityGraph from "@/components/github-activity-graph";
import FarcasterFeedCard from "@/components/farcaster-feed-card";
import AIChatCard from "@/components/ai-chat-card";
import { WorkoutGenerationCard } from "@/components/workout-generation-card";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  return {
    other: {
      "fc:miniapp": JSON.stringify({
        version: "next",
        imageUrl: `${appUrl}/icon.png`,
        ogTitle: "Git Fit",
        ogDescription: "Get fit with Git! Track your fitness journey.",
        ogImageUrl: `${appUrl}/icon.png`,
        button: {
          title: "Launch Mini App",
          action: {
            type: "launch_miniapp",
            name: "Git Fit",
            url: appUrl,
            splashImageUrl: `${appUrl}/icon.png`,
            iconUrl: `${appUrl}/icon.png`,
            splashBackgroundColor: "#000000",
            description: "Get fit with Git! Track your fitness journey.",
            primaryCategory: "utility",
            tags: [],
          },
        },
      }),
    },
  };
}

export default function Home() {
  const githubUsername = process.env.GITHUB_USERNAME || 'your-github-username';
  const farcasterProfileUrl = process.env.FARCASTER_PROFILE_URL || 'https://farcaster.xyz/your-farcaster-username';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm-20 18c-9.941 0-18-8.059-18-18s8.059-18 18-18 18 8.059 18 18-8.059 18-18 18z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <main className="relative z-10 flex flex-col gap-8 px-4 py-8 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="relative">
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
              GIT FIT
            </h1>
            <div className="absolute -top-2 -right-2 text-4xl animate-bounce">🏋️‍♂️</div>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform your fitness journey into <span className="text-orange-400 font-bold">GitHub commits</span>. 
            Track workouts, share progress on <span className="text-purple-400 font-bold">Farcaster</span>, 
            and get <span className="text-green-400 font-bold">crypto tips</span> from your followers.
          </p>
        </div>

        {/* Four Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-8xl mx-auto">
          {/* Top Left: GitHub Activity */}
          <div className="w-full">
            <GitHubActivityGraph githubUsername={githubUsername} />
          </div>
          
          {/* Top Right: Workout Generation */}
          <div className="w-full">
            <WorkoutGenerationCard />
          </div>

          {/* Bottom Left: Farcaster Feed & Support */}
          <div className="w-full">
            <FarcasterFeedCard farcasterProfileUrl={farcasterProfileUrl} />
          </div>

          {/* Bottom Right: AI Chat */}
          <div className="w-full">
            <AIChatCard />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-x-4">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-xl transform hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link href="/stats">📊 View Stats</Link>
          </Button>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold px-8 py-3 rounded-xl transform hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link href="/workout">🏋️‍♂️ Record Workout</Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 space-y-2 pt-8 border-t border-gray-800">
          <p className="flex items-center justify-center gap-2">
            Built with ❤️ by <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors underline">@{githubUsername}</a>
            <a href="https://youtube.com/@John-Forfar" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </p>
          <p className="text-sm">Open source • MIT License • Deployed on Xnode</p>
        </div>
      </main>
    </div>
  );
}
