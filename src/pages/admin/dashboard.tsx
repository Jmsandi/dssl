import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    collection, orderBy, query, onSnapshot
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth'
import {
    LogOut, Users, GraduationCap, LayoutDashboard,
    BookOpen, CreditCard, MessageSquare,
    X, Menu
} from 'lucide-react'

// Modular Components
import { OverviewTab } from './tabs/OverviewTab'
import { StudentsTab } from './tabs/StudentsTab'
import { CoursesTab } from './tabs/CoursesTab'
import { PaymentsTab } from './tabs/PaymentsTab'
import { MessagesTab } from './tabs/MessagesTab'
import { HireRequestsTab } from './tabs/HireRequestsTab'

// Shared Types
import { Student, Course, Payment, Message, HireRequest, Tab } from './types'

export default function AdminDashboard() {
    const { profile, signOut } = useAuth()
    const navigate = useNavigate()
    const [tab, setTab] = useState<Tab>('overview')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Data
    const [students, setStudents] = useState<Student[]>([])
    const [courses, setCourses] = useState<Course[]>([])
    const [payments, setPayments] = useState<Payment[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [hireRequests, setHireRequests] = useState<HireRequest[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch all data
    useEffect(() => {
        const unsubs: (() => void)[] = []

        unsubs.push(onSnapshot(query(collection(db, 'students'), orderBy('createdAt', 'desc')), snap =>
            setStudents(snap.docs.map(d => ({ uid: d.id, ...d.data() } as Student)))
        ))
        unsubs.push(onSnapshot(query(collection(db, 'courses'), orderBy('createdAt', 'desc')), snap =>
            setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() } as Course)))
        ))
        unsubs.push(onSnapshot(query(collection(db, 'course_payments'), orderBy('created_at', 'desc')), snap =>
            setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Payment)))
        ))
        unsubs.push(onSnapshot(query(collection(db, 'admin_messages'), orderBy('sentAt', 'desc')), snap =>
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)))
        ))
        unsubs.push(onSnapshot(query(collection(db, 'hire_requests'), orderBy('createdAt', 'desc')), snap =>
            setHireRequests(snap.docs.map(d => ({ id: d.id, ...d.data() } as HireRequest)))
        ))

        setLoading(false)
        return () => unsubs.forEach(u => u())
    }, [])

    const handleSignOut = async () => { await signOut(); navigate('/admin/login') }

    // Aggregate Stats
    const totalRevenue = payments.filter(p => p.status?.toLowerCase() === 'completed').reduce((s, p) => s + (p.amount ?? 0), 0)
    const thisMonth = students.filter(s => s.createdAt && new Date(s.createdAt.seconds * 1000).getMonth() === new Date().getMonth()).length

    // Nav items
    const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
        { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
        { id: 'hire', label: 'Hire Requests', icon: <GraduationCap className="w-4 h-4" /> },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-navy z-30 sticky top-0 shadow-md">
                <img src="/logo.png" alt="DSSL" className="h-8 w-auto object-contain brightness-200" />
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm animate-in fade-in transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-navy flex flex-col z-50 transition-all duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-white/5">
                    <img src="/logo.png" alt="DSSL" className="h-10 w-auto object-contain brightness-200" />
                    <div className="mt-4">
                        <p className="text-white font-black text-sm uppercase tracking-tighter">Admin Dashboard</p>
                        <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold">Portal </p>
                    </div>
                </div>

                <nav className="flex-1 p-3 mt-4 space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setTab(item.id); setIsMobileMenuOpen(false) }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 group ${tab === item.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className={`shrink-0 transition-transform duration-300 ${tab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                                {item.icon}
                            </span>
                            <span className="tracking-wide">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 bg-black/10">
                    <div className="px-4 py-3 mb-2 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-white text-xs font-black uppercase tracking-widest break-words truncate">{profile?.name ?? 'Administrator'}</p>
                        <p className="text-white/30 text-[10px] break-words truncate font-medium">{profile?.email}</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-xs font-black uppercase tracking-widest"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-10 lg:ml-64 bg-slate-50 min-h-screen animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="max-w-7xl mx-auto">
                    {tab === 'overview' && <OverviewTab students={students} payments={payments} courses={courses} totalRevenue={totalRevenue} thisMonth={thisMonth} loading={loading} />}
                    {tab === 'students' && <StudentsTab students={students} loading={loading} />}
                    {tab === 'courses' && <CoursesTab courses={courses} />}
                    {tab === 'payments' && <PaymentsTab payments={payments} totalRevenue={totalRevenue} loading={loading} />}
                    {tab === 'messages' && <MessagesTab students={students} messages={messages} adminName={profile?.name ?? 'Admin'} adminUid={profile?.uid ?? ''} />}
                    {tab === 'hire' && <HireRequestsTab requests={hireRequests} />}
                </div>
            </main>
        </div>
    )
}
