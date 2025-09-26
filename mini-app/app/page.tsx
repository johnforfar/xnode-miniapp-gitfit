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
        ogTitle: "Xnode Mini App Template",
        ogDescription: "Mini app running on Xnode!",
        ogImageUrl: `${appUrl}/icon.png`,
        button: {
          title: "Launch Mini App",
          action: {
            type: "launch_miniapp",
            name: "Xnode Mini App Template",
            url: appUrl,
            splashImageUrl: `${appUrl}/icon.png`,
            iconUrl: `${appUrl}/icon.png`,
            splashBackgroundColor: "#000000",
            description: "Mini app running on Xnode!",
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
      <span className="text-2xl">Xnode Mini App Template</span>
      <span className="text-muted-foreground">Mini app running on Xnode!</span>
      <Button asChild>
        <Link href="/auth">Authenticate</Link>
      </Button>
      <Button asChild>
        <Link href="/farcaster-info">Farcaster Info</Link>
      </Button>
    </main>
  );
}
