import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function StudentLogin() {
    const { signIn, signInWithGoogle } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await signIn(email, password)
            navigate('/student/dashboard')
        } catch (err: any) {
            setError(
                err.code === 'auth/invalid-credential'
                    ? 'Invalid email or password. Please try again.'
                    : 'Something went wrong. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    const handleGoogle = async () => {
        setError('')
        setGoogleLoading(true)
        try {
            await signInWithGoogle()
            navigate('/student/dashboard')
        } catch {
            setError('Google sign-in failed. Please try again.')
        } finally {
            setGoogleLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left panel — brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0a1128] flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] via-[#0a192f] to-[#0d2461]" />
                <div className="relative z-10">
                    <Link to="/">
                        <img src="/logo.png" alt="DSSL" className="h-12 w-auto object-contain brightness-200" />
                    </Link>
                </div>
                <div className="relative z-10 space-y-6">
                    <blockquote className="text-white/90 text-2xl font-semibold leading-snug">
                        "Transform your career with world-class data skills designed for Africa's future."
                    </blockquote>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold text-lg">D</div>
                        <div>
                            <p className="text-white font-semibold text-sm">DSSL Academy</p>
                            <p className="text-white/50 text-xs">Data Science & Learning</p>
                        </div>
                    </div>
                </div>
                <div className="relative z-10">
                    <p className="text-white/30 text-xs">© 2025 DSSL. All rights reserved.</p>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex flex-col justify-center p-8 lg:p-16">
                <div className="max-w-md w-full mx-auto">
                    {/* Mobile logo */}
                    <Link to="/" className="lg:hidden block mb-8">
                        <img src="/logo.png" alt="DSSL" className="h-10 w-auto object-contain" />
                    </Link>

                    <h1 className="text-3xl font-black text-[#0a1128] mb-1">Welcome back</h1>
                    <p className="text-slate-500 mb-8">Sign in to your student account to continue.</p>

                    {error && (
                        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Google button */}
                    <button
                        onClick={handleGoogle}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition mb-6 disabled:opacity-60"
                    >
                        {googleLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <hr className="flex-1 border-slate-200" />
                        <span className="text-slate-400 text-xs font-medium">or sign in with email</span>
                        <hr className="flex-1 border-slate-200" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-slate-700 font-semibold">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="h-11 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="h-11 rounded-xl border-slate-200 pr-10 focus:border-primary focus:ring-primary/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-xl bg-[#0a1128] hover:bg-[#0d1a3a] text-white font-bold text-sm mt-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {loading ? 'Signing in…' : 'Sign In'}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/student/register" className="text-primary font-semibold hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
