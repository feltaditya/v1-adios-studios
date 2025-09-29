import type React from "react"

import type { Metadata } from "next" 

import "tw-animate-css";
import "../styles/globals.css";
import "./globals.css"
import "../lib/error-suppression"

export const metadata: Metadata = {
  title: "Adios Studios",
  description: "We build and scale your YouTube channel for your business",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-satoshi antialiased" suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
