import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PROGRAMS = [
    'Data Analytics',
    'Data Science',
    'Data Engineering',
    'AI for Business Leaders',
    'Fellowships',
    'Other',
]

export default function StudentRegister() {
    const { signUp, signInWithGoogle } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: '', email: '', phone: '', program: '', password: '', confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
        setLoading(true)
        try {
            await signUp({ email: form.email, password: form.password, name: form.name, phone: form.phone, program: form.program })
            navigate('/student/dashboard')
        } catch (err: any) {
            setError(err.code === 'auth/email-already-in-use' ? 'This email is already registered. Try logging in.' : 'Registration failed. Please try again.')
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
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-[45%] bg-[#0a1128] flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] via-[#0a192f] to-[#0d2461]" />
                <div className="relative z-10">
                    <Link to="/">
                        <img src="/logo.png" alt="DSSL" className="h-12 w-auto object-contain brightness-200" />
                    </Link>
                </div>
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        {[
                            { icon: '🎓', title: 'Industry-led Curriculum', desc: 'Built with top companies across Africa.' },
                            { icon: '💼', title: 'Career Placement', desc: 'Direct pathways to high-paying data roles.' },
                            { icon: '🌍', title: 'Africa-focused', desc: 'Designed for the African digital economy.' },
                        ].map((item) => (
                            <div key={item.title} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                    <p className="text-white font-semibold text-sm">{item.title}</p>
                                    <p className="text-white/50 text-xs mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative z-10">
                    <p className="text-white/30 text-xs">© 2025 DSSL. All rights reserved.</p>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex flex-col justify-center p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-lg w-full mx-auto">
                    <Link to="/" className="lg:hidden block mb-8">
                        <img src="/logo.png" alt="DSSL" className="h-10 w-auto object-contain" />
                    </Link>

                    <h1 className="text-3xl font-black text-[#0a1128] mb-1">Create your account</h1>
                    <p className="text-slate-500 mb-6">Join thousands of students transforming their careers with DSSL.</p>

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
                        <span className="text-slate-400 text-xs font-medium">or sign up with email</span>
                        <hr className="flex-1 border-slate-200" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-slate-700 font-semibold">Full Name</Label>
                                <Input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="John Doe" className="h-11 rounded-xl border-slate-200" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-slate-700 font-semibold">Phone Number</Label>
                                <Input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="+232 XX XXX XXXX" className="h-11 rounded-xl border-slate-200" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-slate-700 font-semibold">Email Address</Label>
                            <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" className="h-11 rounded-xl border-slate-200" />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="program" className="text-slate-700 font-semibold">Program of Interest</Label>
                            <select
                                id="program"
                                name="program"
                                required
                                value={form.program}
                                onChange={handleChange}
                                className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                            >
                                <option value="" disabled>Select a program…</option>
                                {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                                <div className="relative">
                                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className="h-11 rounded-xl border-slate-200 pr-10" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="confirmPassword" className="text-slate-700 font-semibold">Confirm Password</Label>
                                <Input id="confirmPassword" name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className="h-11 rounded-xl border-slate-200" />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-xl bg-[#0a1128] hover:bg-[#0d1a3a] text-white font-bold text-sm mt-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {loading ? 'Creating account…' : 'Create Account'}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/student/login" className="text-primary font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
