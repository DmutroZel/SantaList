import './globals.css'

export const metadata = {
  title: '🎅 Лист до Санти',
  description: 'Напиши свої побажання Санті на Новий Рік!',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Comic Neue', cursive" }}>
        {children}
      </body>
    </html>
  )
}