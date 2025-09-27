import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MiniAppProvider } from "@/components/context/miniapp-provider";
import Link from "next/link";

const inter = localFont({
  src: "./InterVariable.ttf",
});

export const metadata: Metadata = {
  title: "Git Fit",
  description: "Get fit with Git! Track your fitness journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <MiniAppProvider>
          <div className="min-h-screen">
            {children}
            <footer className="text-center py-4 text-gray-400">
              <span>
                Forked from{" "}
                <Link href="https://github.com/OpenxAI-Network/xnode-miniapp-template" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                  OpenXAI miniapp template
                </Link>
              </span>
            </footer>
          </div>
        </MiniAppProvider>
      </body>
    </html>
  );
}
