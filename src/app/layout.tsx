import type { Metadata } from "next"
import ThemeWrapper from "@/components/ThemeWrapper"

export const metadata: Metadata = {
  title: "Game Client",
  description: "Client for game"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  )
}

