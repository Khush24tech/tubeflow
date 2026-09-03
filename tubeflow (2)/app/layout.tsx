import type { Metadata } from 'next';
import React from 'react';
import '../src/index.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://tubeflow.app'),
  title: {
    default: 'Tubeflow - Free MP3 & MP4 Music Search & Downloader',
    template: '%s | Tubeflow'
  },
  description: 'Search, stream, and download high-quality 320kbps MP3 audio and 1080p MP4 video directly from YouTube. Fast, free, unlimited, and no API key required.',
  keywords: ['music downloader', 'youtube to mp3', 'mp4 video download', 'tubeflow', 'free audio download', 'hd music'],
  authors: [{ name: 'Tubeflow Team' }],
  creator: 'Tubeflow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tubeflow.app',
    title: 'Tubeflow - Your Ultimate Music & Video Hub',
    description: 'Search, play and download your favorite tracks in 320kbps MP3 audio or 1080p MP4 video. 100% Free & Unlimited.',
    siteName: 'Tubeflow',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Tubeflow Music Downloader',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tubeflow - Free MP3 & MP4 Music Downloader',
    description: 'Fast music search, instant streaming preview, and one-click MP3 & MP4 media downloads.',
    images: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=630&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
