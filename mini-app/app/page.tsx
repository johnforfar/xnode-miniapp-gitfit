import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

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
  return (
    <main className="flex flex-col gap-3 row-start-2 place-content-center place-items-center justify-center">
      <span className="text-2xl">Git Fit</span>
      <span className="text-muted-foreground">Get fit with Git! Track your fitness journey.</span>
      <Button asChild>
        <Link href="/auth">Authenticate</Link>
      </Button>
      <Button asChild>
        <Link href="/farcaster-info">Farcaster Info</Link>
      </Button>
    </main>
  );
}
