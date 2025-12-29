import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { DashboardNavLink } from '@/components/dashboard/DashboardNav'
import { dashboardNavItems } from '@/components/dashboard/nav-items'
import { LogOut } from 'lucide-react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('patient_session')?.value

    if (!sessionId) {
        redirect('/')
    }

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col h-full border-r border-gray-200">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-green-700">Zealthy</h1>
                    <p className="text-sm text-gray-500 mt-1">Patient Portal</p>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {dashboardNavItems.map((item) => (
                        <DashboardNavLink
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                        />
                    ))}
                </nav>
                <div className="p-4 border-t bg-gray-50/50">
                    <form action={logout}>
                        <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center z-10">
                    <span className="font-bold text-green-700">Zealthy</span>
                    <form action={logout}>
                        <Button size="sm" variant="ghost">Sign Out</Button>
                    </form>
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
