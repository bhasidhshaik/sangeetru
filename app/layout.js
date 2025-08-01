
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Tangerine } from "next/font/google";
import { Montserrat } from "next/font/google";
import LayoutClient from "./LayoutClient";

export const tangerine = Tangerine({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat", // Add this
});


export const metadata = {
  title: 'SangeeTru — Personal Lyrics Dedications',
  description:
    'Create and share personalized lyrics dedications with loved ones on SangeeTru. Find the perfect lyrics, add your message, and deliver emotion through music.',
  keywords: [
    'lyrics dedication',
    'send lyrics to loved ones',
    'personal song lyrics',
    'music messages',
    'emotional lyrics sharing',
    'SangeeTru',
    'dedication app',
    'share lyrics',
    'love songs',
    'custom lyrics message',
  ],
  authors: [{ name: 'Shaik Bhasidh', url: 'https://sangeetru.vercel.app' }],
  creator: 'SangeeTru',
  publisher: 'SangeeTru',
  applicationName: 'SangeeTru',
  metadataBase: new URL('https://sangeetru.vercel.app'),
  openGraph: {
    title: 'SangeeTru — Personal Lyrics Dedications',
    description:
      'Send heartfelt lyrics to someone special. Pick a song, highlight the lyrics, and send a personalized dedication with SangeeTru.',
    url: 'https://sangeetru.vercel.app',
    siteName: 'SangeeTru',
    images: [
      {
        url: '/og-image.jpg', // Put this image in /public
        width: 1200,
        height: 630,
        alt: 'SangeeTru — Personal Lyrics Dedications',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SangeeTru — Personal Lyrics Dedications',
    description:
      'Create and share customized lyrics dedications with SangeeTru. Express emotions with music.',
    site: '@sangeetru',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} antialiased`}
      >
        <Header />
        <LayoutClient>

        <div className="min-h-[100vh] bg-white mx-w-[1200px] mx-auto">
        {children}
        </div>
        </LayoutClient>
        <Footer />
      </body>
    </html>
  );
}
