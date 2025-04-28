import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
//css
import './globals.css';
import './theme.css';

import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import AuthProvider from '@/providers/auth.provider';
import Provider from '@/providers/redux-provider';
import Container from '@/components/Container';
import MathJaxProvider from '@/providers/mathjax-provider';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Topall App',
  description: 'NEET and JEE preparation app'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Container meta={metadata}>
        <body className={`${inter.className} topall-app`} suppressHydrationWarning>
          <AuthProvider>
            <Provider>
              <MathJaxProvider>{children}</MathJaxProvider>
            </Provider>
            <SonnerToaster />
          </AuthProvider>
        </body>
      </Container>
    </html>
  );
}
