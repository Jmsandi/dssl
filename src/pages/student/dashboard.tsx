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
        title: 'MAIN MENU',
        items: [
            { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
            { icon: GraduationCap, label: 'My Programs', id: 'programs' },
            { icon: Compass, label: 'Course Catalog', id: 'catalog' },
            { icon: CreditCard, label: 'Payments', id: 'payments' },
        ],
    },
    {
        title: 'LEARNING',
        items: [
            { icon: FileText, label: 'Resources', id: 'resources' },
            { icon: Award, label: 'Certificates', id: 'certificates' },
            { icon: Calendar, label: 'Schedule', id: 'schedule' },
            { icon: BarChart2, label: 'Progress', id: 'progress' },
        ],
    },
    {
        title: 'ACCOUNT',
        items: [
            { icon: MessageSquare, label: 'Messages', id: 'messages' },
            { icon: User, label: 'My Profile', id: 'profile-settings' },
            { icon: Settings, label: 'Settings', id: 'settings' },
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

function DashboardView({ profile, navigate }: { profile: any; navigate: (path: string) => void }) {
    const displayName = profile?.name ?? 'Student'
    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#0B3C6F] to-[#1B6AE0] rounded-lg p-6 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-white/70 text-sm">Good morning 👋</p>
                    <h2 className="text-2xl font-bold text-white mt-1">Welcome back, {displayName.split(' ')[0]}!</h2>
                    <p className="text-white/60 text-sm mt-1">{profile?.program || 'DSSL Academy'} • Active Student</p>
                </div>
                <div className="hidden md:flex w-16 h-16 rounded-full bg-[#2D7FF9]/30 items-center justify-center text-3xl font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Programs', value: '1', icon: GraduationCap, bg: 'bg-[#0B3C6F]' },
                    { label: 'Completed', value: '0', icon: CheckCircle, bg: 'bg-[#2D7FF9]' },
                    { label: 'Resources', value: '12', icon: FileText, bg: 'bg-indigo-500' },
                    { label: 'Certificates', value: '0', icon: Award, bg: 'bg-amber-500' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-lg shadow-sm border border-[#E0E6ED] p-5 flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                            <s.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#0B3C6F]">{s.value}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Program + Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="My Active Program">
                    <div className="flex items-center gap-4 p-4 border border-[#E0E6ED] rounded-lg">
                        <span className="text-3xl">{PROGRAM_ICONS[profile?.program ?? ''] ?? '📚'}</span>
                        <div className="flex-1">
                            <p className="font-semibold text-[#0B3C6F]">{profile?.program || 'No program selected'}</p>
                            <p className="text-sm text-slate-400 mt-0.5">Academic Year 2025 • Active</p>
                        </div>
                        <Badge color="bg-emerald-50 text-emerald-700">Enrolled</Badge>
                    </div>
                    <button onClick={() => navigate('/student/apply')}
                        className="mt-4 w-full text-center text-sm text-[#2D7FF9] font-medium hover:underline">
                        Browse more courses →
                    </button>
                </SectionCard>

                <SectionCard title="📢 Announcements">
                    <div className="space-y-3">
                        {[
                            { text: 'Welcome to DSSL Academy! Your portal is now active.', time: 'Today', unread: true },
                            { text: 'New Data Science workshops are being scheduled for Q2 2025.', time: '2 days ago', unread: false },
                            { text: 'Payment portal is now live — enroll in additional courses anytime.', time: '1 week ago', unread: false },
                        ].map((a, i) => (
                            <div key={i} className={`flex gap-3 p-3 rounded-lg ${a.unread ? 'bg-blue-50/70 border border-blue-100' : 'bg-[#F5F7FA]'}`}>
                                {a.unread && <span className="w-2 h-2 mt-1.5 rounded-full bg-[#2D7FF9] flex-shrink-0" />}
                                <div>
                                    <p className="text-sm text-slate-700">{a.text}</p>
                                    <p className="text-xs text-slate-400 mt-1">{a.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>
        </div>
    )
}

function MyProgramsView({ profile }: { profile: any }) {
    return (
        <div className="space-y-6">
            <SectionCard title="Enrolled Programs">
                {profile?.program ? (
                    <div className="border border-[#E0E6ED] rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-[#E0E6ED] bg-[#F5F7FA]">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{PROGRAM_ICONS[profile.program] ?? '📚'}</span>
                                <div>
                                    <p className="font-semibold text-[#0B3C6F]">{profile.program}</p>
                                    <p className="text-sm text-slate-400">Intensive · 2025</p>
                                </div>
                            </div>
                            <Badge color="bg-emerald-50 text-emerald-700 border border-emerald-200">Active</Badge>
                        </div>
                        <div className="p-4 grid grid-cols-3 gap-4 text-center">
                            {[['Modules', '12'], ['Completed', '0'], ['Progress', '0%']].map(([k, v]) => (
                                <div key={k}>
                                    <p className="text-xl font-bold text-[#0B3C6F]">{v}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{k}</p>
                                </div>
                            ))}
                        </div>
                        <div className="px-4 pb-4">
                            <div className="w-full bg-[#E0E6ED] rounded-full h-2">
                                <div className="bg-[#2D7FF9] h-2 rounded-full" style={{ width: '0%' }} />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">0% complete</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-slate-400 italic">No programs enrolled yet.</p>
                )}
            </SectionCard>

            <SectionCard title="Program Curriculum">
                <div className="space-y-2">
                    {[
                        { week: 'Week 1–2', topic: 'Introduction & Foundations', status: 'upcoming' },
                        { week: 'Week 3–4', topic: 'Core Concepts & Methods', status: 'upcoming' },
                        { week: 'Week 5–6', topic: 'Hands-On Projects', status: 'upcoming' },
                        { week: 'Week 7–8', topic: 'Advanced Topics', status: 'upcoming' },
                        { week: 'Week 9–10', topic: 'Capstone & Presentation', status: 'upcoming' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 border border-[#E0E6ED] rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-[#F5F7FA] border border-[#E0E6ED] flex items-center justify-center text-xs font-bold text-slate-400">{i + 1}</div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#0B3C6F]">{item.topic}</p>
                                <p className="text-xs text-slate-400">{item.week}</p>
                            </div>
                            <Badge color="bg-slate-100 text-slate-500">Upcoming</Badge>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>
    )
}

function ResourcesView() {
    const resources = [
        { title: 'Data Science Fundamentals PDF', type: 'PDF', size: '2.4 MB', category: 'Reading' },
        { title: 'Python for Data Analysis – Notebook', type: 'Notebook', size: '1.1 MB', category: 'Lab' },
        { title: 'Statistics Refresher Slides', type: 'Slides', size: '3.8 MB', category: 'Reading' },
        { title: 'Introduction to ML – Video', type: 'Video', size: '—', category: 'Video' },
        { title: 'Capstone Project Template', type: 'DOCX', size: '0.5 MB', category: 'Template' },
    ]
    return (
        <div className="space-y-6">
            <SectionCard title="Learning Resources">
                <div className="space-y-2">
                    {resources.map((r, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 border border-[#E0E6ED] rounded-lg hover:border-[#2D7FF9]/40 transition group">
                            <div className="w-10 h-10 bg-[#F5F7FA] rounded-lg flex items-center justify-center flex-shrink-0">
                                <BookMarked className="w-5 h-5 text-[#2D7FF9]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#0B3C6F] truncate">{r.title}</p>
                                <p className="text-xs text-slate-400">{r.type} · {r.size}</p>
                            </div>
                            <Badge color="bg-blue-50 text-blue-600">{r.category}</Badge>
                            <button className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-[#2D7FF9]">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </SectionCard>

            <SectionCard title="External Links">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { label: 'Kaggle Datasets', url: 'https://www.kaggle.com/datasets' },
                        { label: 'Google Colab', url: 'https://colab.research.google.com' },
                        { label: 'Towards Data Science', url: 'https://towardsdatascience.com' },
                        { label: 'DataCamp Courses', url: 'https://www.datacamp.com' },
                    ].map(link => (
                        <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border border-[#E0E6ED] rounded-lg hover:border-[#2D7FF9]/50 hover:bg-blue-50/30 transition text-sm text-[#0B3C6F] font-medium">
                            <ExternalLink className="w-4 h-4 text-[#2D7FF9]" />
                            {link.label}
                        </a>
                    ))}
                </div>
            </SectionCard>
        </div>
    )
}

function ScheduleView() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return (
        <div className="space-y-6">
            <SectionCard title="Upcoming Sessions">
                <div className="space-y-3">
                    {[
                        { date: 'Mar 3, 2025', time: '10:00 AM – 12:00 PM', session: 'Data Analytics Intro Session', location: 'Online (Zoom)' },
                        { date: 'Mar 7, 2025', time: '2:00 PM – 4:00 PM', session: 'Python Crash Course', location: 'Online (Zoom)' },
                        { date: 'Mar 10, 2025', time: '11:00 AM – 1:00 PM', session: 'Workshop: Data Visualization', location: 'In-Person, Freetown' },
                    ].map((e, i) => (
                        <div key={i} className="flex gap-4 p-4 border border-[#E0E6ED] rounded-lg hover:border-[#2D7FF9]/40 transition">
                            <div className="text-center w-14 flex-shrink-0">
                                <div className="bg-[#0B3C6F] text-white text-xs font-bold py-1 rounded-t-md">{e.date.split(' ')[0]}</div>
                                <div className="border border-t-0 border-[#E0E6ED] rounded-b-md py-2">
                                    <p className="text-lg font-bold text-[#0B3C6F]">{e.date.split(' ')[1].replace(',', '')}</p>
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-[#0B3C6F] text-sm">{e.session}</p>
                                <p className="text-xs text-slate-400 mt-1"><Clock className="w-3 h-3 inline mr-1" />{e.time}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{e.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>

            <SectionCard title="Weekly Calendar">
                <div className="grid grid-cols-7 gap-1">
                    {days.map(d => (
                        <div key={d} className="text-center text-xs font-semibold text-slate-400 pb-2">{d}</div>
                    ))}
                    {Array.from({ length: 28 }, (_, i) => (
                        <div key={i} className={`text-center py-2 text-sm rounded-md cursor-default ${i === 2 || i === 6 ? 'bg-[#2D7FF9] text-white font-bold' : 'text-slate-600 hover:bg-[#F5F7FA]'
                            }`}>{i + 1}</div>
                    ))}
                </div>
            </SectionCard>
        </div>
    )
}

function CertificatesView() {
    return (
        <div className="space-y-6">
            <SectionCard title="Earned Certificates">
                <div className="py-12 text-center">
                    <Award className="w-14 h-14 text-[#E0E6ED] mx-auto mb-3" />
                    <p className="text-base font-semibold text-slate-500">No certificates yet</p>
                    <p className="text-sm text-slate-400 mt-1">Complete your program modules to earn your first certificate.</p>
                </div>
            </SectionCard>
            <SectionCard title="Available Certifications">
                <div className="space-y-3">
                    {[
                        { name: 'Data Analytics Fundamentals', modules: '12 modules', status: 'In Progress' },
                        { name: 'Python for Data Science', modules: '8 modules', status: 'Locked' },
                        { name: 'Machine Learning Essentials', modules: '10 modules', status: 'Locked' },
                    ].map((cert, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 border border-[#E0E6ED] rounded-lg">
                            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                                <Award className="w-5 h-5 text-amber-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#0B3C6F]">{cert.name}</p>
                                <p className="text-xs text-slate-400">{cert.modules}</p>
                            </div>
                            <Badge color={cert.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-400'}>
                                {cert.status}
                            </Badge>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>
    )
}

function ProgressView() {
    return (
        <div className="space-y-6">
            <SectionCard title="Overall Progress">
                <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E0E6ED" strokeWidth="3.2" />
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2D7FF9" strokeWidth="3.2" strokeDasharray="0 100" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-[#0B3C6F]">0%</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        {[
                            { label: 'Modules Completed', value: 0, total: 12 },
                            { label: 'Assignments Done', value: 0, total: 8 },
                            { label: 'Attendance', value: 0, total: 10 },
                        ].map(p => (
                            <div key={p.label}>
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>{p.label}</span>
                                    <span>{p.value}/{p.total}</span>
                                </div>
                                <div className="w-full bg-[#E0E6ED] rounded-full h-1.5">
                                    <div className="bg-[#2D7FF9] h-1.5 rounded-full" style={{ width: `${(p.value / p.total) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Recent Activity">
                <div className="py-8 text-center">
                    <TrendingUp className="w-10 h-10 text-[#E0E6ED] mx-auto mb-2" />
                    <p className="text-sm text-slate-400">No activity yet — your learning journey begins here!</p>
                </div>
            </SectionCard>
        </div>
    )
}

function PaymentsView() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Paid', value: 'SLE 0', color: 'bg-[#0B3C6F]' },
                    { label: 'Pending', value: 'SLE 0', color: 'bg-amber-500' },
                    { label: 'Refunded', value: 'SLE 0', color: 'bg-slate-400' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-lg border border-[#E0E6ED] shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-2 h-10 rounded-full flex-shrink-0 ${s.color}`} />
                        <div>
                            <p className="text-xl font-bold text-[#0B3C6F]">{s.value}</p>
                            <p className="text-xs text-slate-400">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <SectionCard title="Payment History">
                <div className="py-8 text-center">
                    <CreditCard className="w-10 h-10 text-[#E0E6ED] mx-auto mb-2" />
                    <p className="text-sm text-slate-400 mb-4">No payment records found.</p>
                    <button className="h-10 px-5 bg-[#2D7FF9] text-white text-sm font-semibold rounded-md hover:bg-[#1B6AE0] transition">
                        Pay for a Course
                    </button>
                </div>
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
                                                <p className={`text-sm font-semibold ${unread ? 'text-[#0B3C6F]' : 'text-slate-600'}`}>
                                                    {msg.sentBy || 'DSSL Admin'}
                                                    {msg.recipientType === 'all' && (
                                                        <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">Broadcast</span>
                                                    )}
                                                    {threadReplies.length > 0 && (
                                                        <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-medium">{threadReplies.length} reply</span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-slate-400 flex-shrink-0">{fmtTime(msg.sentAt)}</p>
                                            </div>
                                            <p className={`text-sm truncate ${unread ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>{msg.subject}</p>
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


function ProfileSettingsView({ profile }: { profile: any }) {
    return (
        <div className="space-y-6">
            <SectionCard title="Personal Information">
                <div className="flex items-center gap-5 pb-5 border-b border-[#E0E6ED] mb-5">
                    <div className="w-16 h-16 rounded-full bg-[#2D7FF9] flex items-center justify-center text-2xl font-bold text-white">
                        {profile?.name?.charAt(0).toUpperCase() ?? 'S'}
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-[#0B3C6F]">{profile?.name ?? 'Student'}</p>
                        <p className="text-sm text-[#2D7FF9]">{profile?.program || 'DSSL Student'}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { label: 'Full Name', value: profile?.name ?? '' },
                        { label: 'Email Address', value: profile?.email ?? '' },
                        { label: 'Phone Number', value: profile?.phone ?? '' },
                        { label: 'Program', value: profile?.program ?? '' },
                    ].map(f => (
                        <div key={f.label}>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">{f.label}</label>
                            <input readOnly defaultValue={f.value}
                                className="w-full h-10 border border-[#E0E6ED] rounded-md px-3 text-sm text-slate-600 bg-[#F5F7FA]" />
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-400 mt-4">To update your profile details, please contact the DSSL administration team.</p>
            </SectionCard>
        </div>
    )
}

function SettingsView() {
    return (
        <div className="space-y-6">
            <SectionCard title="Notification Preferences">
                {[
                    { label: 'Email Notifications', desc: 'Receive updates about your courses via email', enabled: true },
                    { label: 'SMS Alerts', desc: 'Receive session reminders via SMS', enabled: false },
                    { label: 'News & Announcements', desc: 'DSSL newsletter and event updates', enabled: true },
                ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-[#E0E6ED] last:border-0">
                        <div>
                            <p className="text-sm font-medium text-[#0B3C6F]">{s.label}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
                        </div>
                        <div className={`relative w-10 h-5 rounded-full transition ${s.enabled ? 'bg-[#2D7FF9]' : 'bg-[#E0E6ED]'}`}>
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${s.enabled ? 'left-5' : 'left-0.5'}`} />
                        </div>
                    </div>
                ))}
            </SectionCard>

            <SectionCard title="Security">
                <div className="space-y-3">
                    <button className="w-full text-left p-3 border border-[#E0E6ED] rounded-lg text-sm font-medium text-[#0B3C6F] hover:border-[#2D7FF9]/40 transition">
                        Change Password
                    </button>
                    <button className="w-full text-left p-3 border border-[#E0E6ED] rounded-lg text-sm font-medium text-[#0B3C6F] hover:border-[#2D7FF9]/40 transition">
                        Two-Factor Authentication
                    </button>
                </div>
            </SectionCard>
        </div>
    )
}

// ─── Main Dashboard ─────────────────────────────────────────────────

export default function StudentDashboard() {
    const { profile, signOut } = useAuth()
    const navigate = useNavigate()
    const [activeNav, setActiveNav] = useState('dashboard')
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [showUserMenu, setShowUserMenu] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        navigate('/student/login')
    }

    const handleNavClick = (id: string) => {
        if (id === 'catalog') { navigate('/student/apply'); return }
        setActiveNav(id)
        setShowUserMenu(false)
    }

    const displayName = profile?.name ?? 'Student'
    const displayInitial = displayName.charAt(0).toUpperCase()

    const PAGE_TITLES: Record<string, string> = {
        dashboard: 'Dashboard', programs: 'My Programs', catalog: 'Course Catalog',
        payments: 'Payments', resources: 'Resources', certificates: 'Certificates',
        schedule: 'Schedule', progress: 'Progress', messages: 'Messages',
        'profile-settings': 'My Profile', settings: 'Settings',
    }

    const renderContent = () => {
        switch (activeNav) {
            case 'programs': return <MyProgramsView profile={profile} />
            case 'resources': return <ResourcesView />
            case 'schedule': return <ScheduleView />
            case 'certificates': return <CertificatesView />
            case 'progress': return <ProgressView />
            case 'payments': return <PaymentsView />
            case 'messages': return <MessagesView />
            case 'profile-settings': return <ProfileSettingsView profile={profile} />
            case 'settings': return <SettingsView />
            default: return <DashboardView profile={profile} navigate={navigate} />
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-[Inter,Roboto,sans-serif]">

            {/* FIXED HEADER */}
            <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-[#0B3C6F] shadow-md flex items-center px-6 gap-4">
                <div className="flex items-center gap-3 w-[234px] flex-shrink-0">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/70 hover:text-white transition">
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <img src="/logo.png" alt="DSSL" className="h-9 w-auto object-contain brightness-200" />
                </div>

                <nav className="hidden lg:flex items-center gap-1 flex-1">
                    {['Home', 'Courses', 'Community', 'Support'].map(item => (
                        <button key={item} className="px-4 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-md transition">{item}</button>
                    ))}
                </nav>

                <div className="flex items-center gap-2 ml-auto">
                    <button className="text-white/60 hover:text-white transition p-1.5 hover:bg-white/10 rounded-lg">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleNavClick('messages')} className="relative text-white/60 hover:text-white transition p-1.5 hover:bg-white/10 rounded-lg">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">2</span>
                    </button>

                    <div className="relative">
                        <button onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/10 transition">
                            <div className="w-8 h-8 rounded-full bg-[#2D7FF9] flex items-center justify-center text-white text-sm font-bold">{displayInitial}</div>
                            <span className="text-white text-sm font-medium hidden sm:block max-w-[100px] truncate">{displayName.split(' ')[0]}</span>
                            <ChevronDown className="w-4 h-4 text-white/60" />
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-[#E0E6ED] w-52 overflow-hidden z-50">
                                <div className="px-4 py-3 border-b border-[#E0E6ED]">
                                    <p className="text-sm font-semibold text-[#0B3C6F] truncate">{displayName}</p>
                                    <p className="text-xs text-slate-400 truncate">{profile?.email}</p>
                                </div>
                                <div className="py-1">
                                    <button onClick={() => handleNavClick('profile-settings')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-[#F5F7FA] transition">
                                        <User className="w-4 h-4" /> My Profile
                                    </button>
                                    <button onClick={() => handleNavClick('settings')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-[#F5F7FA] transition">
                                        <Settings className="w-4 h-4" /> Settings
                                    </button>
                                    <div className="border-t border-[#E0E6ED] my-1" />
                                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* SIDEBAR */}
            <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-[#0B3C6F] z-20 flex flex-col transition-all duration-300 overflow-hidden ${sidebarOpen ? 'w-[250px]' : 'w-0'}`}>
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
                    {NAV_SECTIONS.map(section => (
                        <div key={section.title}>
                            <p className="text-white/30 text-[10px] font-bold tracking-wider px-4 mb-2">{section.title}</p>
                            <div className="space-y-0.5">
                                {section.items.map(item => (
                                    <NavItem key={item.id} icon={item.icon} label={item.label}
                                        active={activeNav === item.id}
                                        badge={item.id === 'messages' ? 2 : undefined}
                                        onClick={() => handleNavClick(item.id)} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/10 p-3">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#2D7FF9] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{displayInitial}</div>
                        <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{displayName}</p>
                            <p className="text-white/40 text-xs truncate">{profile?.email}</p>
                        </div>
                    </div>
                    <button onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-white/50 hover:bg-red-900/30 hover:text-red-300 transition">
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-0'}`}>
                <div className="p-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-[#0B3C6F]">{PAGE_TITLES[activeNav]}</h1>
                        <hr className="mt-4 mb-6 border-[#E0E6ED]" />
                    </div>
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}
