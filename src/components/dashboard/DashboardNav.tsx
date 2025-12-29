'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Calendar, Pill, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
    Home,
    Calendar,
    Pill,
}

interface NavLinkProps {
    href: string
    icon: string
    label: string
}

export function DashboardNavLink({ href, icon: iconName, label }: NavLinkProps) {
    const pathname = usePathname()
    const isActive = pathname === href
    const Icon = iconMap[iconName]

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                    ? "bg-green-100 text-green-800 shadow-sm"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
            )}
        >
            <Icon className={cn(
                "mr-3 h-5 w-5 transition-colors",
                isActive ? "text-green-700" : "text-gray-500"
            )} />
            {label}
            {isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-green-600"></div>
            )}
        </Link>
    )
}

