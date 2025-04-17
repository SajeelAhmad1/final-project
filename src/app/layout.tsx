"use client";
import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";
import "@/assets/style/globals.css";
import { poppins } from "@/common/styles/fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <SessionProvider>
            {children}
        </SessionProvider>
      </body>
    </html>
  );
}
