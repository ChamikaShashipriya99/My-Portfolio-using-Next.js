import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SmoothScrolling from "@/components/smooth-scrolling";
import ClarityScript from "@/components/ClarityScript";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import CustomCursor from "@/components/ui/CustomCursor";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-mono",
});

const dancingScript = Dancing_Script({
    subsets: ["latin"],
    weight: ["700"],
    variable: "--font-cursive"
});

export const metadata: Metadata = {
    metadataBase: new URL("https://chamikashashipriya.dev"),
    title: "Chamik.Dev Portfolio",
    description: "Futuristic 3D Web Developer Portfolio built with Next.js, Three.js, and Framer Motion.",
    icons: {
        icon: "/favicon.png",
    },
    manifest: "/manifest.json",
    openGraph: {
        title: "Chamik.Dev Portfolio",
        description: "Futuristic 3D Web Developer Portfolio",
        url: "https://chamikashashipriya.dev",
        siteName: "Portfolio",
        images: [
            {
                url: "/portfolio-preview.png",
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_US",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${dancingScript.variable} font-sans antialiased overflow-x-hidden w-full`}>
                <CustomCursor />
                <ClarityScript />
                <SpeedInsights />
                <Analytics />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SmoothScrolling>
                        {children}
                    </SmoothScrolling>
                </ThemeProvider>
            </body>
        </html>
    );
}
