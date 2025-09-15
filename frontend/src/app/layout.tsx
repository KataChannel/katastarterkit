import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navigation } from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'KataCore - AI-Powered Chatbot Platform',
    template: '%s | KataCore',
  },
  description: 'Enterprise Fullstack Starter Kit with AI-powered chatbots, training from your personal data. Built with Next.js, NestJS, GraphQL, Prisma, Redis, and Minio.',
  keywords: ['ai', 'chatbot', 'fullstack', 'starter-kit', 'nextjs', 'nestjs', 'graphql', 'prisma', 'redis', 'minio', 'artificial intelligence', 'machine learning'],
  authors: [{ name: 'KataCore Team' }],
  creator: 'KataCore Team',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:13000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'KataCore - AI-Powered Chatbot Platform',
    description: 'Enterprise Fullstack Starter Kit with AI-powered chatbots, training from your personal data.',
    siteName: 'KataCore',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KataCore - AI-Powered Chatbot Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KataCore - AI-Powered Chatbot Platform',
    description: 'Enterprise Fullstack Starter Kit with AI-powered chatbots, training from your personal data.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          <div className="min-h-full flex flex-col">
            {/* <Navigation /> */}
            <main className="flex-1">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
