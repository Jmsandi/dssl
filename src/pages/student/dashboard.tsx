import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import {
    collection, query, where, onSnapshot, addDoc, orderBy,
    serverTimestamp, updateDoc, doc, arrayUnion
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Send, Loader2, Reply } from 'lucide-react'
import {
    LayoutDashboard,
    BookOpen,
    Compass,
    GraduationCap,
    Bell,
    ChevronDown,
    LogOut,
    User,
    HelpCircle,
    Award,
    Clock,
    FileText,
    Settings,
    Menu,
    X,
    Mail,
    Phone,
    TrendingUp,
    CheckCircle,
    Calendar,
    MessageSquare,
    CreditCard,
    BarChart2,
    Download,
    ExternalLink,
    BookMarked,
    Zap,
    Info,
    Globe,
} from 'lucide-react'

const PROGRAM_ICONS: Record<string, string> = {
    'Data Analytics': '📊',
    'Data Science': '🔬',
    'Data Engineering': '⚙️',
    'AI for Business Leaders': '🤖',
    Fellowships: '🏅',
    Other: '📚',
}

const NAV_SECTIONS = [
    {
        title: 'LEARNING',
        items: [
            { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
            { icon: GraduationCap, label: 'My Learning', id: 'learning' },
            { icon: Calendar, label: 'Schedule', id: 'schedule' },
            { icon: FileText, label: 'Resources', id: 'resources' },
        ],
    },
    {
        title: 'SUPPORT',
        items: [
            { icon: MessageSquare, label: 'Messages', id: 'messages' },
            { icon: CreditCard, label: 'Payments', id: 'payments' },
        ],
    },
    {
        title: 'ACCOUNT',
        items: [
            { icon: User, label: 'Profile', id: 'profile' },
        ],
    },
]

// ─── Reusable Components ───────────────────────────────────────────

function NavItem({ icon: Icon, label, active = false, badge, onClick }: {
    icon: React.ElementType; label: string; active?: boolean; badge?: number; onClick?: () => void
}) {
    return (
        <button onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all text-left relative ${active ? 'bg-[#2D7FF9] text-white border-l-4 border-white/50 pl-3' : 'text-white/70 hover:bg-[#1F5A99] hover:text-white'
                }`}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {badge ? (
                <span className="w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">{badge}</span>
            ) : null}
        </button>
    )
}

function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-[#E0E6ED] p-6">
            {title && <h3 className="text-base font-semibold text-[#0B3C6F] mb-4">{title}</h3>}
            {children}
        </div>
    )
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{children}</span>
    )
}

// ─── Section Views ──────────────────────────────────────────────────

function DashboardView({ profile, payments, navigate }: { profile: any; payments: any[]; navigate: (path: string) => void }) {
    const { user } = useAuth()
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)

    const displayName = profile?.name ?? 'Student'
    const completedPayments = payments.filter(p => p.status?.toLowerCase() === 'completed')
    const totalSpent = completedPayments.reduce((acc, p) => acc + (p.amount || 0), 0)

    useEffect(() => {
        if (!user) return
        const q = query(
            collection(db, 'admin_messages'),
            orderBy('sentAt', 'desc')
        )
        const unsub = onSnapshot(q, snap => {
            // Filter client-side to avoid composite index requirement
            const broadcast = snap.docs
                .map(d => ({ id: d.id, ...d.data() } as any))
                .filter(m => m.recipientType === 'all')
                .slice(0, 3)

            setAnnouncements(broadcast)
            setLoadingAnnouncements(false)
        }, (error) => {
            console.error('Announcements error:', error)
            setLoadingAnnouncements(false)
        })
        return () => unsub()
    }, [user])

    const fmtTime = (ts?: { seconds: number }) => {
        if (!ts) return ''
        const d = new Date(ts.seconds * 1000)
        const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000)
        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`
        return d.toLocaleDateString()
    }

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-[#0B3C6F] rounded-2xl p-8 flex items-center justify-between shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="relative z-10">
                    <p className="text-white/60 text-sm font-medium">Welcome back,</p>
                    <h2 className="text-3xl font-bold text-white mt-1 tracking-tight">{displayName}</h2>
                    <div className="flex items-center gap-3 mt-4">
                        <Badge color="bg-white/10 text-white border border-white/10 px-3 py-1">Active Student</Badge>
                        <span className="text-white/40 text-xs font-medium">Cohort 2025 • {profile?.program || 'Academy'}</span>
                    </div>
                </div>
                <div className="hidden md:flex w-20 h-20 rounded-2xl bg-white/10 items-center justify-center text-4xl font-bold text-white border border-white/10 backdrop-blur-sm relative z-10">
                    {displayName.charAt(0).toUpperCase()}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Programs', value: completedPayments.length.toString(), icon: GraduationCap, bg: 'bg-[#0B3C6F]' },
                    { label: 'Completed', value: '0', icon: CheckCircle, bg: 'bg-[#2D7FF9]' },
                    { label: 'Resources', value: '12', icon: FileText, bg: 'bg-indigo-500' },
                    { label: 'Certificates', value: '0', icon: Award, bg: 'bg-amber-500' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-[#E0E6ED] p-5 flex items-center gap-4 hover:shadow-md transition duration-300">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                            <s.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-[#0B3C6F]">{s.label === 'Total Paid' ? `SLE ${totalSpent}` : s.value}</p>
                            <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Program + Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Active Program">
                    <div className="flex items-center gap-4 p-4 border border-[#E0E6ED] rounded-xl bg-[#F8FAFC]/50">
                        <span className="text-3xl">{PROGRAM_ICONS[profile?.program ?? ''] ?? '📚'}</span>
                        <div className="flex-1">
                            <p className="font-bold text-[#0B3C6F]">{profile?.program || 'No program selected'}</p>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Academic Session 2025</p>
                        </div>
                        <Badge color="bg-emerald-100 text-emerald-700 border border-emerald-200">Enrolled</Badge>
                    </div>
                </SectionCard>

                <SectionCard title="Announcements">
                    <div className="space-y-4">
                        {loadingAnnouncements ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
                            </div>
                        ) : announcements.length === 0 ? (
                            <p className="text-xs text-slate-400 italic py-2">No new announcements.</p>
                        ) : announcements.map((a, i) => {
                            const unread = !a.readBy || !a.readBy.includes(user?.uid)
                            return (
                                <div key={i} className="flex gap-4 items-start group cursor-pointer" onClick={() => navigate('/student/dashboard?tab=messages')}>
                                    <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${unread ? 'bg-[#2D7FF9]' : 'bg-slate-200'}`} />
                                    <div>
                                        <p className={`text-sm leading-relaxed ${unread ? 'font-bold text-[#0B3C6F]' : 'text-slate-600'}`}>{a.subject}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">{fmtTime(a.sentAt)}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </SectionCard>
            </div>
        </div>
    )
}

function MyLearningView({ profile, courses }: { profile: any; courses: any[] }) {
    const enrolledProgram = profile?.program
    const courseDetails = courses.find(c => c.name === enrolledProgram)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <SectionCard title="Active Program">
                        {enrolledProgram ? (
                            <div className="border border-[#E0E6ED] rounded-xl overflow-hidden bg-white">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-[#E0E6ED] bg-[#F8FAFC] gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-[#E0E6ED] flex items-center justify-center text-2xl shadow-sm">
                                            {PROGRAM_ICONS[enrolledProgram] ?? '📚'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#0B3C6F] text-lg">{enrolledProgram}</p>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Cohort 2025 • {courseDetails?.format || 'Standard'}</p>
                                        </div>
                                    </div>
                                    <Badge color="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1">{courseDetails?.price ? 'Enrolled' : 'Direct Enrollment'}</Badge>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <p className="text-sm font-bold text-slate-500">Course Completion</p>
                                            <p className="text-2xl font-bold text-[#0B3C6F]">{profile?.progress || 0}%</p>
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{profile?.modulesCompleted || 0} of {profile?.totalModules || 12} Modules</p>
                                    </div>
                                    <div className="w-full bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
                                        <div className="bg-[#2D7FF9] h-full rounded-full transition-all duration-500" style={{ width: `${profile?.progress || 0}%` }} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 border-2 border-dashed border-[#E0E6ED] rounded-xl">
                                <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-400 italic">No programs enrolled yet.</p>
                            </div>
                        )}
                    </SectionCard>

                    <SectionCard title="Program Curriculum">
                        <div className="space-y-3">
                            {[
                                { week: 'Week 1–2', topic: 'Introduction & Foundations', status: 'completed' },
                                { week: 'Week 3–4', topic: 'Core Concepts & Methods', status: 'in-progress' },
                                { week: 'Week 5–6', topic: 'Hands-On Projects', status: 'upcoming' },
                                { week: 'Week 7–8', topic: 'Advanced Topics', status: 'upcoming' },
                                { week: 'Week 9–10', topic: 'Capstone & Presentation', status: 'upcoming' },
                            ].map((item, i) => (
                                <div key={i} className={`flex items-center gap-4 p-4 border rounded-xl transition-all ${item.status === 'completed' ? 'bg-emerald-50/30 border-emerald-100' : item.status === 'in-progress' ? 'bg-blue-50/30 border-[#2D7FF9]/20 ring-1 ring-[#2D7FF9]/10' : 'bg-white border-[#E0E6ED]'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${item.status === 'completed' ? 'bg-emerald-500 text-white' : item.status === 'in-progress' ? 'bg-[#2D7FF9] text-white' : 'bg-slate-100 border border-slate-200 text-slate-400'}`}>
                                        {item.status === 'completed' ? '✓' : i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-bold ${item.status === 'upcoming' ? 'text-slate-500' : 'text-[#0B3C6F]'}`}>{item.topic}</p>
                                        <p className="text-xs text-slate-400 mt-0.5 font-medium">{item.week}</p>
                                    </div>
                                    <Badge color={item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 text-slate-400'}>
                                        {item.status.replace('-', ' ')}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </div>

                <div className="space-y-6">
                    <SectionCard title="Certificates">
                        <div className="space-y-4">
                            {[
                                { name: 'Data Analytics Intro', status: 'Earned', date: 'Feb 2025' },
                                { name: 'DSSL Professional', status: 'Locked', date: '--' },
                            ].map((cert, i) => (
                                <div key={i} className={`p-4 rounded-xl border flex flex-col items-center text-center gap-3 ${cert.status === 'Earned' ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-50 border-slate-200'}`}>
                                    <Award className={`w-8 h-8 ${cert.status === 'Earned' ? 'text-amber-500' : 'text-slate-300'}`} />
                                    <div>
                                        <p className="text-xs font-bold text-[#0B3C6F] leading-tight">{cert.name}</p>
                                        <p className="text-[10px] text-slate-400 mt-1 font-bold">{cert.date}</p>
                                    </div>
                                    <Badge color={cert.status === 'Earned' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'}>
                                        {cert.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard title="Learning Stats">
                        <div className="space-y-4">
                            {[
                                { label: 'Modules', value: 2, total: 12, color: 'bg-emerald-500' },
                                { label: 'Projects', value: 1, total: 4, color: 'bg-blue-500' },
                                { label: 'Quizzes', value: 3, total: 10, color: 'bg-indigo-500' },
                            ].map(p => (
                                <div key={p.label} className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        <span>{p.label}</span>
                                        <span className="text-slate-600">{p.value}/{p.total}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                                        <div className={`${p.color} h-full rounded-full`} style={{ width: `${(p.value / p.total) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </div>
            </div>
        </div>
    )
}

function ResourcesView({ resources }: { resources: any[] }) {
    const displayResources = resources.length > 0 ? resources : [
        { title: 'Data Science Fundamentals', type: 'PDF', size: '2.4 MB' },
        { title: 'Python for Data Analysis', type: 'Lab Notebook', size: '1.1 MB' },
        { title: 'Statistics Refresher', type: 'Slides', size: '3.8 MB' },
        { title: 'Intro to Machine Learning', type: 'Video', size: '45 min' },
    ]

    return (
        <div className="space-y-6">
            <SectionCard title="Learning Resources">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {displayResources.map((r, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border border-[#E0E6ED] rounded-xl hover:bg-[#F8FAFC] transition group bg-white">
                            <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center group-hover:bg-white transition">
                                <FileText className="w-5 h-5 text-[#2D7FF9]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-[#0B3C6F] truncate">{r.title}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{r.type} • {r.size}</p>
                            </div>
                            <button className="p-2 text-slate-300 hover:text-[#2D7FF9] transition">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>
    )
}

function ScheduleView({ schedule }: { schedule: any[] }) {
    const displaySchedule = schedule.length > 0 ? schedule : [
        { dateStr: 'Mar 12', day: 'Wed', time: '10:00 AM', topic: 'Data Visualization Workshop', location: 'Zoom' },
        { dateStr: 'Mar 15', day: 'Sat', time: '2:00 PM', topic: 'Python Q&A Session', location: 'Zoom' },
    ]

    return (
        <div className="space-y-6">
            <SectionCard title="Upcoming Sessions">
                <div className="space-y-4">
                    {displaySchedule.map((s, i) => (
                        <div key={i} className="flex items-center gap-5 p-5 border border-[#E0E6ED] rounded-xl bg-white hover:border-[#2D7FF9]/20 hover:shadow-sm transition">
                            <div className="w-14 h-14 rounded-xl bg-[#F8FAFC] border border-[#E0E6ED] flex flex-col items-center justify-center text-[#0B3C6F]">
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none opacity-50">{s.day}</span>
                                <span className="text-xl font-bold leading-none mt-1">{(s.dateStr || '').split(' ')[1] || (s.date && new Date(s.date.seconds * 1000).getDate())}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-base font-bold text-[#0B3C6F]">{s.topic}</p>
                                <div className="flex items-center gap-4 mt-1.5">
                                    <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium"><Clock className="w-3.5 h-3.5" /> {s.time}</span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium"><Globe className="w-3.5 h-3.5" /> {s.location}</span>
                                </div>
                            </div>
                            <Badge color="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold">Standard</Badge>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>
    )
}

function PaymentsView({ payments }: { payments: any[] }) {
    const completed = payments.filter(p => p.status?.toLowerCase() === 'completed')
    const pending = payments.filter(p => p.status?.toLowerCase() === 'pending')
    const refunded = payments.filter(p => p.status?.toLowerCase() === 'refunded')

    const totalPaid = completed.reduce((s, p) => s + (p.amount ?? 0), 0)
    const totalPending = pending.reduce((s, p) => s + (p.amount ?? 0), 0)
    const totalRefunded = refunded.reduce((s, p) => s + (p.amount ?? 0), 0)

    const fmt = (n: number) => `SLE ${n.toLocaleString()}`

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Paid', value: fmt(totalPaid), color: 'bg-[#0B3C6F]' },
                    { label: 'Pending', value: fmt(totalPending), color: 'bg-amber-500' },
                    { label: 'Refunded', value: fmt(totalRefunded), color: 'bg-slate-400' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-[#E0E6ED] p-5 flex items-center gap-4 hover:shadow-sm transition">
                        <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${s.color}`} />
                        <div>
                            <p className="text-xl font-bold text-[#0B3C6F]">{s.value}</p>
                            <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <SectionCard title="Payment History">
                {payments.length === 0 ? (
                    <div className="py-8 text-center">
                        <CreditCard className="w-10 h-10 text-[#E0E6ED] mx-auto mb-2" />
                        <p className="text-sm text-slate-400 mb-4">No payment records found.</p>
                        <button className="h-10 px-5 bg-[#2D7FF9] text-white text-sm font-semibold rounded-md hover:bg-[#1B6AE0] transition">
                            Pay for a Course
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto -mx-6 px-6">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#F1F5F9]">
                                    <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Reference</th>
                                    <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Program</th>
                                    <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Amount</th>
                                    <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F1F5F9]">
                                {payments.map((p, i) => (
                                    <tr key={i} className="group hover:bg-[#F8FAFC] transition-colors">
                                        <td className="py-4">
                                            <p className="text-xs font-bold text-[#0B3C6F] uppercase">#{p.reference?.slice(-6) || p.id.slice(-6)}</p>
                                            <p className="text-[10px] text-slate-400 mt-1 font-medium">{p.created_at?.seconds ? new Date(p.created_at.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                                        </td>
                                        <td className="py-4">
                                            <p className="text-xs font-bold text-[#0B3C6F]">{p.program_name || 'Course'}</p>
                                        </td>
                                        <td className="py-4 text-xs font-bold text-[#0B3C6F]">
                                            {p.currency} {p.amount?.toLocaleString()}
                                        </td>
                                        <td className="py-4 text-right">
                                            <Badge color={
                                                p.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                                    p.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-slate-50 text-slate-400'
                                            }>
                                                {p.status || 'Draft'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </SectionCard>
        </div>
    )
}

function MessagesView() {
    const { user, profile } = useAuth()
    const [messages, setMessages] = useState<any[]>([])
    const [replies, setReplies] = useState<Record<string, any[]>>({})
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState<string | null>(null)
    const [replyText, setReplyText] = useState<Record<string, string>>({})
    const [sending, setSending] = useState<string | null>(null)

    // Compose new message state
    const [showCompose, setShowCompose] = useState(false)
    const [newSubject, setNewSubject] = useState('')
    const [newBody, setNewBody] = useState('')
    const [sendingNew, setSendingNew] = useState(false)
    const [sentNew, setSentNew] = useState(false)

    // Fetch admin messages
    useEffect(() => {
        if (!user) return
        const q = query(collection(db, 'admin_messages'), orderBy('sentAt', 'desc'))
        const unsub = onSnapshot(q, snap => {
            const docs = snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter((m: any) =>
                    m.recipientType === 'all' ||
                    (m.recipientType === 'single' && m.recipientId === user.uid)
                )
            setMessages(docs)
            setLoading(false)
        })
        return () => unsub()
    }, [user])

    // Fetch this student's replies (so they show in the thread)
    useEffect(() => {
        if (!user) return
        const q = query(
            collection(db, 'student_replies'),
            where('studentId', '==', user.uid),
            orderBy('sentAt', 'asc')
        )
        const unsub = onSnapshot(q, snap => {
            const grouped: Record<string, any[]> = {}
            snap.docs.forEach(d => {
                const r = { id: d.id, ...d.data() } as any
                if (!grouped[r.messageId]) grouped[r.messageId] = []
                grouped[r.messageId].push(r)
            })
            setReplies(grouped)
        })
        return () => unsub()
    }, [user])

    const markRead = async (msgId: string) => {
        if (!user) return
        await updateDoc(doc(db, 'admin_messages', msgId), { readBy: arrayUnion(user.uid) })
    }

    const toggleExpand = (msgId: string) => {
        const next = expanded === msgId ? null : msgId
        setExpanded(next)
        if (next) markRead(msgId)
    }

    const handleReply = async (msg: any) => {
        const text = (replyText[msg.id] || '').trim()
        if (!text || !user) return
        setSending(msg.id)
        try {
            await addDoc(collection(db, 'student_replies'), {
                messageId: msg.id,
                messageSubject: msg.subject,
                studentId: user.uid,
                studentName: profile?.name ?? 'Student',
                studentEmail: profile?.email ?? '',
                body: text,
                sentAt: serverTimestamp(),
            })
            setReplyText(r => ({ ...r, [msg.id]: '' }))
        } finally { setSending(null) }
    }

    const handleNewMessage = async () => {
        if (!newSubject.trim() || !newBody.trim() || !user) return
        setSendingNew(true)
        try {
            await addDoc(collection(db, 'student_messages'), {
                subject: newSubject.trim(),
                body: newBody.trim(),
                studentId: user.uid,
                studentName: profile?.name ?? 'Student',
                studentEmail: profile?.email ?? '',
                status: 'unread',
                sentAt: serverTimestamp(),
            })
            setNewSubject(''); setNewBody('')
            setSentNew(true)
            setShowCompose(false)
            setTimeout(() => setSentNew(false), 4000)
        } finally { setSendingNew(false) }
    }

    const fmtTime = (ts?: { seconds: number }) => {
        if (!ts) return ''
        const d = new Date(ts.seconds * 1000)
        const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000)
        if (diffDays === 0) return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        if (diffDays === 1) return 'Yesterday'
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    }

    const isUnread = (msg: any) => !Array.isArray(msg.readBy) || !msg.readBy.includes(user?.uid)

    return (
        <div className="space-y-4">
            {/* Header with Compose button */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-[#0B3C6F]">Messages</h2>
                    <p className="text-xs text-slate-400">{messages.length} message{messages.length !== 1 ? 's' : ''} in inbox</p>
                </div>
                <button
                    onClick={() => setShowCompose(v => !v)}
                    className="flex items-center gap-2 bg-[#0B3C6F] hover:bg-[#0a2f58] text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
                >
                    <Send className="w-4 h-4" /> New Message
                </button>
            </div>

            {/* Sent confirmation */}
            {sentNew && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                    ✅ Your message was sent to DSSL Admin successfully.
                </div>
            )}

            {/* Compose panel */}
            {showCompose && (
                <SectionCard title="New Message to Admin">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Subject</label>
                            <input
                                value={newSubject}
                                onChange={e => setNewSubject(e.target.value)}
                                className="w-full h-10 border border-[#E0E6ED] rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7FF9]/30"
                                placeholder="What is your message about?"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Message</label>
                            <textarea
                                rows={4}
                                value={newBody}
                                onChange={e => setNewBody(e.target.value)}
                                className="w-full border border-[#E0E6ED] rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2D7FF9]/30"
                                placeholder="Write your message here…"
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setShowCompose(false)} className="px-4 py-2 text-sm text-slate-500 border border-[#E0E6ED] rounded-lg hover:bg-slate-50 transition">
                                Cancel
                            </button>
                            <button
                                onClick={handleNewMessage}
                                disabled={sendingNew || !newSubject.trim() || !newBody.trim()}
                                className="flex items-center gap-2 bg-[#0B3C6F] hover:bg-[#0a2f58] text-white text-sm font-semibold px-5 py-2 rounded-lg transition disabled:opacity-50"
                            >
                                {sendingNew ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Send
                            </button>
                        </div>
                    </div>
                </SectionCard>
            )}

            {/* Inbox */}
            <SectionCard title="Inbox">
                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-[#2D7FF9]" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-10">
                        <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">No messages yet.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {messages.map((msg: any) => {
                            const unread = isUnread(msg)
                            const open = expanded === msg.id
                            const threadReplies = replies[msg.id] || []
                            return (
                                <div key={msg.id} className={`rounded-xl border transition ${open ? 'border-[#2D7FF9]/40 shadow-sm' : unread ? 'bg-blue-50/40 border-blue-100' : 'border-[#E0E6ED]'}`}>
                                    {/* Header row — click to expand */}
                                    <div className="flex gap-3 items-start p-4 cursor-pointer" onClick={() => toggleExpand(msg.id)}>
                                        <div className="w-9 h-9 rounded-full bg-[#0B3C6F] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                            {msg.sentBy?.charAt(0)?.toUpperCase() ?? 'A'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-sm font-bold ${unread ? 'text-[#0B3C6F]' : 'text-slate-600'}`}>
                                                    {msg.sentBy || 'DSSL Admin'}
                                                    {msg.recipientType === 'all' && (
                                                        <span className="ml-2 text-[10px] bg-blue-50 text-[#2D7FF9] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Broadcast</span>
                                                    )}
                                                    {threadReplies.length > 0 && (
                                                        <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{threadReplies.length} reply</span>
                                                    )}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex-shrink-0">{fmtTime(msg.sentAt)}</p>
                                            </div>
                                            <p className={`text-sm truncate mt-0.5 ${unread ? 'font-bold text-slate-700' : 'text-slate-500'}`}>{msg.subject}</p>
                                        </div>
                                        {unread && <span className="w-2 h-2 rounded-full bg-[#2D7FF9] flex-shrink-0 mt-2" />}
                                    </div>

                                    {/* Expanded: message body + replies thread + reply box */}
                                    {open && (
                                        <div className="border-t border-[#E0E6ED] px-4 pt-4 pb-5 space-y-4">
                                            {/* Admin message body */}
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#0B3C6F] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                                                    {msg.sentBy?.charAt(0)?.toUpperCase() ?? 'A'}
                                                </div>
                                                <div className="flex-1 bg-slate-50 rounded-xl px-4 py-3 border border-[#E0E6ED]">
                                                    <p className="text-xs font-semibold text-[#0B3C6F] mb-1">{msg.sentBy || 'DSSL Admin'}</p>
                                                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                                                </div>
                                            </div>

                                            {/* Inline replies from student */}
                                            {threadReplies.map((r: any) => (
                                                <div key={r.id} className="flex gap-3 flex-row-reverse">
                                                    <div className="w-8 h-8 rounded-full bg-[#2D7FF9] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                                                        {profile?.name?.charAt(0)?.toUpperCase() ?? 'Y'}
                                                    </div>
                                                    <div className="flex-1 bg-[#2D7FF9]/8 rounded-xl px-4 py-3 border border-[#2D7FF9]/20">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <p className="text-xs font-semibold text-[#2D7FF9]">You</p>
                                                            <p className="text-xs text-slate-400">{fmtTime(r.sentAt)}</p>
                                                        </div>
                                                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{r.body}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Reply input */}
                                            <div className="pl-11">
                                                <textarea
                                                    rows={2}
                                                    value={replyText[msg.id] || ''}
                                                    onChange={e => setReplyText(r => ({ ...r, [msg.id]: e.target.value }))}
                                                    className="w-full border border-[#E0E6ED] rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2D7FF9]/30 bg-white"
                                                    placeholder="Type a reply…"
                                                />
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        onClick={() => handleReply(msg)}
                                                        disabled={!replyText[msg.id]?.trim() || sending === msg.id}
                                                        className="flex items-center gap-1.5 bg-[#0B3C6F] hover:bg-[#0a2f58] text-white text-xs font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
                                                    >
                                                        {sending === msg.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                                        Send Reply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </SectionCard>
        </div>
    )
}


function UnifiedProfileView({ profile }: { profile: any }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <SectionCard title="Personal Information">
                        <div className="flex items-center gap-5 pb-6 border-b border-[#E0E6ED] mb-6">
                            <div className="w-16 h-16 rounded-xl bg-[#2D7FF9] flex items-center justify-center text-2xl font-bold text-white shadow-sm border-2 border-[#E0E6ED]">
                                {profile?.name?.charAt(0).toUpperCase() ?? 'S'}
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-lg font-bold text-[#0B3C6F] tracking-tight">{profile?.name ?? 'Student'}</p>
                                <p className="text-sm font-bold text-[#2D7FF9]">{profile?.program || 'Active Student'}</p>
                                <p className="text-xs text-slate-400">ID: DSSL-{Math.floor(1000 + Math.random() * 9000)}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: 'Full Name', value: profile?.name ?? '' },
                                { label: 'Email Address', value: profile?.email ?? '' },
                                { label: 'Phone Number', value: profile?.phone ?? '' },
                                { label: 'Base Program', value: profile?.program ?? '' },
                            ].map(f => (
                                <div key={f.label} className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">{f.label}</label>
                                    <input readOnly defaultValue={f.value}
                                        className="w-full h-11 border border-[#E0E6ED] rounded-xl px-4 text-sm font-medium text-slate-600 bg-[#F8FAFC]" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
                            <Info className="w-5 h-5 text-blue-500 shrink-0" />
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">To update your official profile details or change your enrolled program, please contact the support team.</p>
                        </div>
                    </SectionCard>

                    <SectionCard title="Security & Account">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button className="flex items-center justify-between p-4 border border-[#E0E6ED] rounded-xl text-sm font-bold text-[#0B3C6F] hover:bg-[#F8FAFC] transition group text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white transition">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    Change Password
                                </div>
                                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-300" />
                            </button>
                            <button className="flex items-center justify-between p-4 border border-[#E0E6ED] rounded-xl text-sm font-bold text-[#0B3C6F] hover:bg-[#F8FAFC] transition group text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white transition">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    Two-Factor Auth
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Disabled</span>
                            </button>
                        </div>
                    </SectionCard>
                </div>

                <div className="space-y-6">
                    <SectionCard title="Preferences">
                        <div className="space-y-4">
                            {[
                                { label: 'Email Updates', desc: 'Course announcements', enabled: true },
                                { label: 'SMS Alerts', desc: 'Session reminders', enabled: false },
                                { label: 'Newsletter', desc: 'DSSL community news', enabled: true },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div>
                                        <p className="text-sm font-bold text-[#0B3C6F]">{s.label}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{s.desc}</p>
                                    </div>
                                    <button className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${s.enabled ? 'bg-[#2D7FF9]' : 'bg-slate-200'}`}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${s.enabled ? 'left-5' : 'left-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard title="Account Actions">
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition duration-200 border border-transparent hover:border-red-100">
                            <LogOut className="w-4 h-4" /> Sign Out from All Devices
                        </button>
                    </SectionCard>
                </div>
            </div>
        </div>
    )
}

// ─── Main Dashboard ─────────────────────────────────────────────────

export default function StudentDashboard() {
    const { user, profile, signOut } = useAuth()
    const navigate = useNavigate()
    const [activeNav, setActiveNav] = useState('dashboard')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

    // Real-time Data
    const [courses, setCourses] = useState<any[]>([])
    const [payments, setPayments] = useState<any[]>([])
    const [unreadMessages, setUnreadMessages] = useState(0)
    const [resources, setResources] = useState<any[]>([])
    const [schedule, setSchedule] = useState<any[]>([])

    useEffect(() => {
        if (window.innerWidth >= 1024) setSidebarOpen(true)
    }, [])

    // Listen to Courses
    useEffect(() => {
        const q = query(collection(db, 'courses'), where('isActive', '==', true))
        return onSnapshot(q, snap => {
            setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        }, (err) => console.error('Courses error:', err))
    }, [])

    // Listen to Resources
    useEffect(() => {
        const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'))
        return onSnapshot(q, snap => {
            setResources(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        }, (err) => console.error('Resources error:', err))
    }, [])

    // Listen to Schedule
    useEffect(() => {
        const q = query(collection(db, 'schedule'), orderBy('date', 'asc'))
        return onSnapshot(q, snap => {
            setSchedule(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        }, (err) => console.error('Schedule error:', err))
    }, [])

    // Listen to Payments
    useEffect(() => {
        if (!user) return
        const q = query(collection(db, 'course_payments'), where('student_id', '==', user.uid))
        return onSnapshot(q, snap => {
            setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        }, (err) => console.error('Payments error:', err))
    }, [user])

    // Listen to Unread Messages count
    useEffect(() => {
        if (!user) return
        const q = query(collection(db, 'admin_messages'))
        return onSnapshot(q, snap => {
            const unread = snap.docs.filter(d => {
                const m = d.data() as any
                const isRecipient = m.recipientType === 'all' || m.recipientId === user.uid
                const notRead = !m.readBy || !m.readBy.includes(user.uid)
                return isRecipient && notRead
            }).length
            setUnreadMessages(unread)
        }, (err) => console.error('Unread messages error:', err))
    }, [user])

    const handleSignOut = async () => {
        await signOut()
        navigate('/student/login')
    }

    const handleNavClick = (id: string) => {
        setActiveNav(id)
        setShowUserMenu(false)
        if (window.innerWidth < 1024) setSidebarOpen(false)
    }

    const displayName = profile?.name ?? 'Student'
    const displayInitial = displayName.charAt(0).toUpperCase()

    const PAGE_TITLES: Record<string, string> = {
        dashboard: 'Dashboard',
        learning: 'My Learning',
        resources: 'Resources',
        schedule: 'Schedule',
        payments: 'Payments',
        messages: 'Messages',
        profile: 'Profile',
    }

    const renderContent = () => {
        switch (activeNav) {
            case 'learning': return <MyLearningView profile={profile} courses={courses} />
            case 'resources': return <ResourcesView resources={resources} />
            case 'schedule': return <ScheduleView schedule={schedule} />
            case 'payments': return <PaymentsView payments={payments} />
            case 'messages': return <MessagesView />
            case 'profile': return <UnifiedProfileView profile={profile} />
            default: return <DashboardView profile={profile} payments={payments} navigate={navigate} />
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-[Inter,Roboto,sans-serif] text-[#0B3C6F]">

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-[#0B3C6F]/40 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* FIXED HEADER */}
            <header className="fixed top-0 left-0 right-0 z-[70] h-16 bg-[#0B3C6F] border-b border-white/10 flex items-center px-4 lg:px-7 gap-4">
                <div className="flex items-center gap-3 lg:w-[230px] flex-shrink-0">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 -ml-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition"
                    >
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <img src="/logo.png" alt="DSSL" className="h-8 lg:h-9 w-auto object-contain brightness-200" />
                </div>

                <div className="flex-1 hidden lg:block">
                    <div className="flex items-center gap-3 pl-5 border-l border-white/10">
                        <span className="text-white text-sm font-bold tracking-tight">Student Portal</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    <button onClick={() => handleNavClick('messages')} className="relative p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition">
                        <Bell className="w-5 h-5" />
                        {unreadMessages > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#2D7FF9] rounded-full border-2 border-[#0B3C6F]" />
                        )}
                    </button>

                    <div className="relative">
                        <button onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/10 transition duration-200">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-sm font-bold border border-white/10">{displayInitial}</div>
                            <span className="text-white text-sm font-bold hidden sm:block truncate max-w-[120px]">{displayName.split(' ')[0]}</span>
                            <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 top-14 bg-white rounded-2xl shadow-2xl border border-[#E0E6ED] w-56 overflow-hidden z-20 animate-in zoom-in-95 duration-200">
                                <div className="px-5 py-4 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                                    <p className="text-sm font-bold text-[#0B3C6F] leading-tight truncate">{displayName}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide truncate">{profile?.email}</p>
                                </div>
                                <div className="p-2">
                                    <button onClick={() => handleNavClick('profile')} className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-slate-600 hover:bg-[#F8FAFC] hover:text-[#2D7FF9] rounded-xl transition duration-200">
                                        <User className="w-4 h-4" /> Profile Details
                                    </button>
                                    <div className="border-t border-[#F1F5F9] my-2" />
                                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition duration-200">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* SIDEBAR */}
            <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-[#0B3C6F] z-[65] flex flex-col transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'w-[280px] translate-x-0 shadow-2xl lg:shadow-none' : 'w-0 -translate-x-full lg:w-0'}`}>
                <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8 custom-scrollbar">
                    {NAV_SECTIONS.map(section => (
                        <div key={section.title}>
                            <p className="text-white/20 text-[10px] font-bold tracking-[0.15em] px-4 mb-4 uppercase leading-none">{section.title}</p>
                            <div className="space-y-1">
                                {section.items.map(item => (
                                    <NavItem key={item.id} icon={item.icon} label={item.label}
                                        active={activeNav === item.id}
                                        badge={item.id === 'messages' ? unreadMessages : undefined}
                                        onClick={() => handleNavClick(item.id)} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-5 border-t border-white/5 bg-black/10">
                    <button onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200">
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-[280px]' : 'ml-0'}`}>
                <div className="p-6 lg:p-12 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0B3C6F] tracking-tight leading-none">{PAGE_TITLES[activeNav]}</h1>
                            <p className="text-slate-400 text-sm font-medium mt-2">DSSL Academy Portal</p>
                        </div>
                        <div className="hidden sm:block h-10 w-px bg-slate-200 self-center mx-10" />
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                            <span className="uppercase tracking-widest leading-none">Status:</span>
                            <Badge color="bg-emerald-500 text-white px-4 py-1.5 rounded-xl">Verified Student</Badge>
                        </div>
                    </div>
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}
