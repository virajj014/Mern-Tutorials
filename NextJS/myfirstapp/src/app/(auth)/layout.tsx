import Navbar from '@/components/Navbar/Navbar'

import Footer from '@/components/Footer/Footer'

export const metadata = {
    title: 'Next.js',
    description: 'Generated by Next.js',
}

export default function GroupedRouteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <h1>THIS IS FROM GROUPED AUTH LAYOUT</h1>
            {children}
        </div>
    )
}
