import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function AdminLogin() {
    const { signIn, profile } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await signIn(email, password)
            navigate('/admin/dashboard')
        } catch (err: any) {
            setError(
                err.code === 'auth/invalid-credential'
                    ? 'Invalid email or password.'
                    : err.message || 'Login failed.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#080812] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 right-1/3 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30 mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Admin Access</h1>
                    <p className="text-white/50 mt-1">Sign in to the admin dashboard</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm text-white/70 font-medium">Admin Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@dssl.org"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 transition"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/70 font-medium">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-violet-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                            {loading ? 'Authenticating…' : 'Sign In as Admin'}
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-white/30 hover:text-white/60 text-sm transition">
                        ← Back to website
                    </Link>
                </div>
            </div>
        </div>
    )
}
