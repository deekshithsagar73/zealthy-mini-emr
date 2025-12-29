import Link from 'next/link'
import { AdminNavLink } from '@/components/admin/AdminNav'
import { adminNavItems } from '@/components/admin/nav-items'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col h-full border-r border-gray-200">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-green-700">Zealthy EMR</h1>
                    <p className="text-sm text-gray-500 mt-1">Admin Portal</p>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {adminNavItems.map((item) => (
                        <AdminNavLink
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                        />
                    ))}
                </nav>
                <div className="p-4 border-t bg-gray-50/50">
                    <Link href="/" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200">
                        <span className="mr-3">←</span>
                        Patient Portal
                    </Link>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center z-10">
                    <span className="font-bold text-green-700">Zealthy EMR</span>
                    <Link href="/" className="text-sm text-green-600 hover:text-green-700">
                        Patient Portal
                    </Link>
                </header>
                <main className="flex-1 p-8 overflow-y-auto scroll-smooth">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
