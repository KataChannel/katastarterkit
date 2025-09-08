import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navigation } from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'KataCore',
    template: '%s | KataCore',
  },
  description: 'Enterprise Fullstack Starter Kit with Next.js, NestJS, GraphQL, Prisma, Redis, and Minio',
  keywords: ['fullstack', 'starter-kit', 'nextjs', 'nestjs', 'graphql', 'prisma', 'redis', 'minio'],
  authors: [{ name: 'KataCore Team' }],
  creator: 'KataCore Team',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'KataCore',
    description: 'Enterprise Fullstack Starter Kit',
    siteName: 'KataCore',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KataCore',
    description: 'Enterprise Fullstack Starter Kit',
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
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          <div className="min-h-full flex flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
