import type { Metadata } from 'next'
import { Providers } from './providers'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: '와썹하우스',
  description: '잔잔한 게 좋은 사람들의 공간',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
