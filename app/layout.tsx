import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SmoothScrolling from "@/components/smooth-scrolling";
import ClarityScript from "@/components/ClarityScript";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });
const dancingScript = Dancing_Script({
    subsets: ["latin"],
    weight: ["700"],
    variable: "--font-cursive"
});

export const metadata: Metadata = {
    title: "Chamik.Dev Portfolio",
    description: "Futuristic 3D Web Developer Portfolio built with Next.js, Three.js, and Framer Motion.",
    icons: {
        icon: "/favicon.png",
    },
    openGraph: {
        title: "Chamik.Dev Portfolio",
        description: "Futuristic 3D Web Developer Portfolio",
        url: "https://chamika-shashipriya.vercel.app/",
        siteName: "Portfolio",
        images: [
            {
                url: "/og-image.png",
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
            <body className={`${inter.className} ${dancingScript.variable} antialiased`}>
                <ClarityScript />
                <SpeedInsights />
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
