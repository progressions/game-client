import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Game Client',
  description: 'Frontend for exploration game',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
