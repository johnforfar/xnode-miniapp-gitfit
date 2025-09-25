import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MiniAppProvider } from "@/components/context/miniapp-provider";
import Link from "next/link";

const inter = localFont({
  src: "./InterVariable.ttf",
});

export const metadata: Metadata = {
  title: "Xnode Mini App Template",
  description: "Mini app running on Xnode!",
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
          <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            {children}
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
              <span>
                Developed by{" "}
                <Link href="https://openxai.org" target="_blank">
                  OpenxAI
                </Link>
              </span>
            </footer>
          </div>
        </MiniAppProvider>
      </body>
    </html>
  );
}
