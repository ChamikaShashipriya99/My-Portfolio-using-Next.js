import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SmoothScrolling from "@/components/smooth-scrolling";
import ClarityScript from "@/components/ClarityScript";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { siteDescription, siteUrl } from "@/lib/site";

const spaceGrotesk = localFont({ src: './fonts/space-grotesk-latin.woff2', weight: '300 700', variable: '--font-sans', display: 'swap' });
const jetbrainsMono = localFont({ src: './fonts/jetbrains-mono-latin.woff2', weight: '100 800', variable: '--font-mono', display: 'swap', preload: false });
const dancingScript = localFont({ src: './fonts/dancing-script-latin.woff2', weight: '400 700', variable: '--font-cursive', display: 'swap', preload: false });

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: { default: 'Chamika Shashipriya | Full-Stack Web Developer', template: '%s | Chamika Shashipriya' },
    description: siteDescription,
    authors: [{ name: 'Chamika Shashipriya', url: siteUrl }], creator: 'Chamika Shashipriya',
    alternates: { canonical: '/' }, robots: { index: true, follow: true },
    icons: { icon: '/favicon.png' }, manifest: '/manifest.json',
    openGraph: { title: 'Chamika Shashipriya | Full-Stack Web Developer', description: siteDescription, url: '/', siteName: 'Chamika Shashipriya Portfolio', locale: 'en_US', type: 'website', images: [{ url: '/social-preview.jpg', width: 1200, height: 630, alt: 'Chamika Shashipriya — Full-Stack Web Developer' }] },
    twitter: { card: 'summary_large_image', title: 'Chamika Shashipriya | Full-Stack Web Developer', description: siteDescription, images: ['/social-preview.jpg'] },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${dancingScript.variable} font-sans antialiased overflow-x-hidden w-full`}>
                <ClarityScript />
                <SpeedInsights debug={false} />
                <Analytics debug={false} />
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
