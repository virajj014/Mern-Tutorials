import Navbar from '@/components/Navbar/Navbar'
import '../styles/global.css'
import Footer from '@/components/Footer/Footer'

export const metadata = {
  title: {
    // absolute: 'Next.js',
    default : "Next.js",
    template: '%s | Next.js',
  },
  description: 'This is a very big project based on blogging',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body>
      <Navbar />
        {children}
        <Footer />
        </body>
    </html>
  )
}
