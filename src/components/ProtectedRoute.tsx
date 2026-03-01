import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRole?: 'student' | 'admin'
    redirectTo?: string
}

export function ProtectedRoute({
    children,
    requiredRole,
    redirectTo = '/student/login',
}: ProtectedRouteProps) {
    const { user, profile, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a14]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-white/60 text-sm">Loading…</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to={redirectTo} replace />
    }

    if (requiredRole && profile?.role !== requiredRole) {
        return <Navigate to={redirectTo} replace />
    }

    return <>{children}</>
}
