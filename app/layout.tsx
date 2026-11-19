import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'STRENGTHS.cc | Gallup Certified Strengths Coaches for Sales & HR Leaders',
  description:
    'Connect directly with verified Gallup Certified Strengths Coaches to drive 19% higher sales revenue, 29% higher profit, and 72% lower employee turnover.',
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23047857'/><text x='50' y='69' font-family='Georgia,serif' font-size='60' font-weight='bold' fill='white' text-anchor='middle'>S</text></svg>",
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
