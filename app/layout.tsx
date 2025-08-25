import type React from "react"

import type { Metadata } from "next"
 
import "tw-animate-css";
import "../styles/globals.css";
import "./globals.css"

export const metadata: Metadata = {
  title: "Adios Studios — YouTube Channel Growth",
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
      <body className="font-satoshi antialiased">{children}</body>
    </html>
  )
}
