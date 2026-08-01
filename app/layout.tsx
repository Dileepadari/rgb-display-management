import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" })
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "RGB Display Manager",
  description:
    "Design what your LED matrix wall shows from a browser, and let the panel run it on its own.",
  applicationName: "RGB Display Manager",
  // Next.js picks up app/icon.png, app/apple-icon.png and app/favicon.ico by
  // convention; only the social card needs declaring.
  openGraph: {
    title: "RGB Display Manager",
    description:
      "Design what your LED matrix wall shows from a browser, and let the panel run it on its own.",
    images: ["/logo-wordmark.png"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "RGB Display Manager",
    description:
      "Design what your LED matrix wall shows from a browser, and let the panel run it on its own.",
    images: ["/logo-wordmark.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <TooltipProvider>
            <AuthProvider>{children}</AuthProvider>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
