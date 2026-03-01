import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    collection, getDocs, addDoc, updateDoc, deleteDoc,
    doc, orderBy, query, serverTimestamp, onSnapshot
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useAuth } from '@/lib/auth'
import {
    Shield, LogOut, Users, Search, GraduationCap, LayoutDashboard,
    ChevronUp, ChevronDown, BookOpen, CreditCard, MessageSquare,
    Plus, Pencil, Trash2, X, Check, Send, Loader2, TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Student { uid: string; name: string; email: string; phone: string; program: string; role: string; createdAt?: { seconds: number } }
interface Course { id: string; name: string; description: string; price: number; currency: string; duration: string; format: string; isActive: boolean; slug?: string; imageUrl?: string; createdAt?: { seconds: number } }
interface Payment { id: string; student_id: string; student_name: string; student_email: string; course_id: string; course_name: string; amount: number; currency: string; status: string; transaction_id: string; created_at?: { seconds: number } }
interface Message { id: string; subject: string; body: string; recipientType: 'all' | 'single'; recipientId?: string; recipientName?: string; sentAt?: { seconds: number }; sentBy: string }
interface HireRequest { id: string; fullName: string; email: string; phone: string; company: string; industry: string; talentType: string; skills: string[]; count: string; responsibilities: string; referral: string; status: string; createdAt?: { seconds: number } }

type Tab = 'overview' | 'students' | 'courses' | 'payments' | 'messages' | 'hire'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (ts?: { seconds: number }) => ts ? new Date(ts.seconds * 1000).toLocaleDateString('en-GB') : '—'
const fmtCurrency = (amount: number, currency = 'SLE') => `${currency} ${amount.toLocaleString()}`

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const { profile, signOut } = useAuth()
    const navigate = useNavigate()
    const [tab, setTab] = useState<Tab>('overview')

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

    // ─── Stats ────────────────────────────────────────────────────────────────
    const totalRevenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount ?? 0), 0)
    const thisMonth = students.filter(s => s.createdAt && new Date(s.createdAt.seconds * 1000).getMonth() === new Date().getMonth()).length

    // ─── Nav items ────────────────────────────────────────────────────────────
    const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
        { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
        { id: 'hire', label: 'Hire Requests', icon: <GraduationCap className="w-4 h-4" /> },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* ── Sidebar ── */}
            <aside className="fixed top-0 left-0 h-full w-60 bg-[#0a1128] flex flex-col z-20">
                <div className="p-5 border-b border-white/10">
                    <img src="/logo.png" alt="DSSL" className="h-10 w-auto object-contain brightness-200" />
                    <p className="text-white/40 text-xs mt-2 font-medium">Admin Portal</p>
                </div>

                <nav className="flex-1 p-3 space-y-0.5">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${tab === item.id
                                ? 'bg-primary text-white'
                                : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-3 border-t border-white/10">
                    <div className="px-3 py-2 mb-2">
                        <p className="text-white text-sm font-semibold truncate">{profile?.name ?? 'Admin'}</p>
                        <p className="text-white/40 text-xs truncate">{profile?.email}</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition text-sm"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="ml-60 flex-1 p-8">
                {tab === 'overview' && <OverviewTab students={students} payments={payments} courses={courses} totalRevenue={totalRevenue} thisMonth={thisMonth} loading={loading} />}
                {tab === 'students' && <StudentsTab students={students} loading={loading} />}
                {tab === 'courses' && <CoursesTab courses={courses} />}
                {tab === 'payments' && <PaymentsTab payments={payments} totalRevenue={totalRevenue} loading={loading} />}
                {tab === 'messages' && <MessagesTab students={students} messages={messages} adminName={profile?.name ?? 'Admin'} adminUid={profile?.uid ?? ''} />}
                {tab === 'hire' && <HireRequestsTab requests={hireRequests} />}
            </main>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════════════════════
// OVERVIEW TAB
// ══════════════════════════════════════════════════════════════════════════════
function OverviewTab({ students, payments, courses, totalRevenue, thisMonth, loading }: {
    students: Student[]; payments: Payment[]; courses: Course[]; totalRevenue: number; thisMonth: number; loading: boolean
}) {
    const completed = payments.filter(p => p.status === 'completed').length
    const pending = payments.filter(p => p.status === 'pending').length

    const stats = [
        { label: 'Total Students', value: students.length, icon: <Users className="w-5 h-5" />, sub: `+${thisMonth} this month` },
        { label: 'Total Revenue', value: fmtCurrency(totalRevenue), icon: <TrendingUp className="w-5 h-5" />, sub: `${completed} payments completed` },
        { label: 'Active Courses', value: courses.filter(c => c.isActive).length, icon: <BookOpen className="w-5 h-5" />, sub: `${courses.length} total` },
        { label: 'Pending Payments', value: pending, icon: <CreditCard className="w-5 h-5" />, sub: 'Awaiting confirmation' },
    ]

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-[#0a1128]">Dashboard Overview</h1>
                <p className="text-slate-500 text-sm mt-1">Welcome back — here's what's happening at DSSL.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map(s => (
                    <div key={s.label} className="bg-white border border-border rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-slate-500 text-xs uppercase tracking-wider font-medium">{s.label}</p>
                            <span className="text-primary">{s.icon}</span>
                        </div>
                        <p className="text-2xl font-black text-[#0a1128]">{s.value}</p>
                        <p className="text-slate-400 text-xs mt-1">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Recent Students */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                    <h2 className="font-bold text-[#0a1128]">Recent Registrations</h2>
                </div>
                <table className="w-full text-sm">
                    <thead><tr className="border-b border-border bg-slate-50">
                        <th className="px-5 py-3 text-left text-slate-500 font-medium">Name</th>
                        <th className="px-5 py-3 text-left text-slate-500 font-medium">Program</th>
                        <th className="px-5 py-3 text-left text-slate-500 font-medium">Date</th>
                    </tr></thead>
                    <tbody>
                        {students.slice(0, 5).map(s => (
                            <tr key={s.uid} className="border-b border-border hover:bg-slate-50 transition">
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                            {s.name?.charAt(0).toUpperCase() ?? '?'}
                                        </div>
                                        <span className="font-medium text-[#0a1128]">{s.name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3"><span className="bg-secondary/10 text-secondary rounded-full px-2.5 py-0.5 text-xs font-medium">{s.program}</span></td>
                                <td className="px-5 py-3 text-slate-400">{fmtDate(s.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════════════════════
// STUDENTS TAB
// ══════════════════════════════════════════════════════════════════════════════
function StudentsTab({ students, loading }: { students: Student[]; loading: boolean }) {
    const [search, setSearch] = useState('')
    const [sortField, setSortField] = useState<keyof Student>('name')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
    const [program, setProgram] = useState('All')

    const programs = ['All', ...Array.from(new Set(students.map(s => s.program).filter(Boolean)))]

    const handleSort = (f: keyof Student) => {
        if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortField(f); setSortDir('asc') }
    }

    const filtered = students
        .filter(s => {
            const q = search.toLowerCase()
            return (s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.program?.toLowerCase().includes(q))
                && (program === 'All' || s.program === program)
        })
        .sort((a, b) => {
            const av = (a[sortField] ?? '') as string; const bv = (b[sortField] ?? '') as string
            return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
        })

    const Th = ({ label, field }: { label: string; field: keyof Student }) => (
        <th onClick={() => handleSort(field)} className="px-5 py-3 text-left text-slate-500 font-medium cursor-pointer hover:text-[#0a1128] transition select-none">
            <span className="flex items-center gap-1">{label}
                {sortField === field ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ChevronUp className="w-3 h-3 opacity-30" />}
            </span>
        </th>
    )

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-[#0a1128]">Students</h1>
                    <p className="text-slate-500 text-sm">{students.length} registered students</p>
                </div>
            </div>

            <div className="bg-white border border-border rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search students…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
                    </div>
                    <select value={program} onChange={e => setProgram(e.target.value)} className="h-9 border border-border rounded-lg px-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
                        {programs.map(p => <option key={p}>{p}</option>)}
                    </select>
                </div>

                {loading ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState icon={<Users className="w-8 h-8" />} text="No students found." /> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-border bg-slate-50">
                                <Th label="Name" field="name" />
                                <Th label="Email" field="email" />
                                <Th label="Phone" field="phone" />
                                <Th label="Program" field="program" />
                                <Th label="Registered" field="createdAt" />
                            </tr></thead>
                            <tbody>
                                {filtered.map(s => (
                                    <tr key={s.uid} className="border-b border-border hover:bg-slate-50 transition">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{s.name?.charAt(0).toUpperCase() ?? '?'}</div>
                                                <span className="font-medium text-[#0a1128]">{s.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-500">{s.email}</td>
                                        <td className="px-5 py-3 text-slate-500">{s.phone || '—'}</td>
                                        <td className="px-5 py-3"><span className="bg-secondary/10 text-secondary rounded-full px-2.5 py-0.5 text-xs font-medium">{s.program}</span></td>
                                        <td className="px-5 py-3 text-slate-400">{fmtDate(s.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-5 py-2 border-t border-border text-slate-400 text-xs">Showing {filtered.length} of {students.length}</div>
                    </div>
                )}
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════════════════════
// COURSES TAB
// ══════════════════════════════════════════════════════════════════════════════
const toSlug = (name: string) =>
    name.trim().toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')

const EMPTY_COURSE = { name: '', description: '', price: 0, currency: 'SLE', duration: '', format: 'In-Person & Online', isActive: true, slug: '', imageUrl: '' }

function CoursesTab({ courses }: { courses: Course[] }) {
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<Course | null>(null)
    const [form, setForm] = useState(EMPTY_COURSE)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploadingImage, setUploadingImage] = useState(false)

    const openNew = () => { setEditing(null); setForm(EMPTY_COURSE); setImageFile(null); setImagePreview(null); setShowForm(true) }
    const openEdit = (c: Course) => {
        setEditing(c);
        setForm({ name: c.name, description: c.description, price: c.price, currency: c.currency, duration: c.duration, format: c.format, isActive: c.isActive, slug: c.slug || toSlug(c.name), imageUrl: c.imageUrl || '' })
        setImageFile(null)
        setImagePreview(c.imageUrl || null)
        setShowForm(true)
    }
    const closeForm = () => { setShowForm(false); setEditing(null); setImageFile(null); setImagePreview(null) }

    const handleSave = async () => {
        if (!form.name || !form.price) return
        setSaving(true)
        try {
            const storage = getStorage()
            let imageUrl = form.imageUrl || ''

            // Upload image if one was selected
            if (imageFile) {
                setUploadingImage(true)
                const storageRef = ref(storage, `course-images/${Date.now()}-${imageFile.name}`)
                await uploadBytes(storageRef, imageFile)
                imageUrl = await getDownloadURL(storageRef)
                setUploadingImage(false)
            }

            const slug = form.slug || toSlug(form.name)
            const payload = { ...form, price: Number(form.price), slug, imageUrl }

            if (editing) {
                await updateDoc(doc(db, 'courses', editing.id), { ...payload, updatedAt: serverTimestamp() })
            } else {
                await addDoc(collection(db, 'courses'), { ...payload, createdAt: serverTimestamp() })
            }
            closeForm()
        } finally { setSaving(false) }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this course?')) return
        setDeleting(id)
        await deleteDoc(doc(db, 'courses', id))
        setDeleting(null)
    }

    const fc = (f: string) => `w-full h-9 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white`

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-[#0a1128]">Courses</h1>
                    <p className="text-slate-500 text-sm">{courses.length} courses configured</p>
                </div>
                <Button onClick={openNew} className="bg-[#0a1128] hover:bg-[#0d1a3a] text-white rounded-xl">
                    <Plus className="w-4 h-4 mr-1" /> Add Course
                </Button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between p-5 border-b border-border">
                            <h2 className="font-bold text-[#0a1128]">{editing ? 'Edit Course' : 'New Course'}</h2>
                            <button onClick={closeForm} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            {/* Course Image Upload */}
                            <div className="space-y-1.5">
                                <Label className="text-slate-700 font-semibold">Course Image</Label>
                                <div className="flex items-center gap-3">
                                    {imagePreview && (
                                        <img src={imagePreview} alt="preview" className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0" />
                                    )}
                                    <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition text-sm text-slate-500">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={e => {
                                                const file = e.target.files?.[0] || null
                                                setImageFile(file)
                                                setImagePreview(file ? URL.createObjectURL(file) : null)
                                            }}
                                        />
                                        📷 {imagePreview ? 'Change image' : 'Upload course image'}
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-700 font-semibold">Course Name</Label>
                                <input
                                    className={fc('')}
                                    value={form.name}
                                    onChange={e => {
                                        const name = e.target.value
                                        setForm(f => ({
                                            ...f,
                                            name,
                                            slug: toSlug(name) // Auto-generate slug from name
                                        }))
                                    }}
                                    placeholder="e.g. Data Analytics"
                                />
                            </div>
                            {/* Slug (auto-generated, but editable) */}
                            <div className="space-y-1.5">
                                <Label className="text-slate-700 font-semibold">URL Slug <span className="text-slate-400 font-normal text-xs">(auto-generated, can edit)</span></Label>
                                <div className="flex items-center border border-border rounded-lg overflow-hidden bg-slate-50">
                                    <span className="px-3 text-slate-400 text-xs border-r border-border py-2 bg-slate-100 whitespace-nowrap">/payment?program=</span>
                                    <input
                                        className="flex-1 h-9 px-3 text-sm focus:outline-none bg-slate-50 text-slate-600"
                                        value={form.slug}
                                        onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                        placeholder="data-analytics"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-700 font-semibold">Description</Label>
                                <textarea className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white resize-none" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short course description…" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-slate-700 font-semibold">Price</Label>
                                    <input className={fc('')} type="number" min={0} value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} placeholder="500" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-slate-700 font-semibold">Currency</Label>
                                    <select className={fc('')} value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                                        <option value="SLE">SLE</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-slate-700 font-semibold">Duration</Label>
                                    <input className={fc('')} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="12 Weeks" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-slate-700 font-semibold">Format</Label>
                                    <select className={fc('')} value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))}>
                                        <option>In-Person & Online</option>
                                        <option>In-Person</option>
                                        <option>Online</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="active" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="accent-primary" />
                                <Label htmlFor="active" className="text-slate-700 font-semibold cursor-pointer">Published (visible to students)</Label>
                            </div>
                        </div>
                        <div className="p-5 border-t border-border flex gap-2 justify-end">
                            <Button variant="outline" onClick={closeForm}>Cancel</Button>
                            <Button onClick={handleSave} disabled={saving || uploadingImage} className="bg-[#0a1128] hover:bg-[#0d1a3a] text-white">
                                {(saving || uploadingImage) ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                                {editing ? 'Save Changes' : 'Create Course'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Course Grid */}
            {courses.length === 0 ? (
                <div className="bg-white border border-border rounded-2xl p-16 text-center">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No courses yet. Add your first course.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map(c => (
                        <div key={c.id} className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition">
                            {c.imageUrl && (
                                <div className="w-full h-32 overflow-hidden">
                                    <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-[#0a1128] truncate">{c.name}</h3>
                                            <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${c.isActive ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                                                {c.isActive ? 'Active' : 'Draft'}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm line-clamp-2">{c.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                                    <span>{c.duration}</span>
                                    <span>·</span>
                                    <span>{c.format}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-black text-[#0a1128]">{fmtCurrency(c.price, c.currency)}</span>
                                    <div className="flex gap-1">
                                        <Button size="sm" variant="outline" onClick={() => openEdit(c)} className="h-8 px-2">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleDelete(c.id)} disabled={deleting === c.id} className="h-8 px-2 text-red-500 hover:bg-red-50 hover:border-red-200">
                                            {deleting === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAYMENTS TAB
// ══════════════════════════════════════════════════════════════════════════════
function PaymentsTab({ payments, totalRevenue, loading }: { payments: Payment[]; totalRevenue: number; loading: boolean }) {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')

    const statuses = ['All', 'completed', 'pending', 'cancelled', 'failed', 'refunded']

    const filtered = payments.filter(p => {
        const q = search.toLowerCase()
        const matchSearch = p.student_name?.toLowerCase().includes(q) || p.course_name?.toLowerCase().includes(q) || p.transaction_id?.toLowerCase().includes(q)
        const matchStatus = statusFilter === 'All' || p.status === statusFilter
        return matchSearch && matchStatus
    })

    const statusColors: Record<string, string> = {
        completed: 'bg-primary/10 text-primary',
        pending: 'bg-yellow-50 text-yellow-600',
        cancelled: 'bg-slate-100 text-slate-500',
        failed: 'bg-red-50 text-red-600 border border-red-100',
        refunded: 'bg-secondary/10 text-secondary',
    }

    const completedRevenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0)
    const pendingRevenue = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-black text-[#0a1128]">Payments</h1>
                <p className="text-slate-500 text-sm">{payments.length} total transactions</p>
            </div>

            {/* Revenue cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Revenue', value: fmtCurrency(completedRevenue), color: 'text-primary' },
                    { label: 'Pending', value: fmtCurrency(pendingRevenue), color: 'text-yellow-600' },
                    { label: 'Completed', value: payments.filter(p => p.status === 'completed').length, color: 'text-primary' },
                    { label: 'Failed/Cancelled', value: payments.filter(p => ['failed', 'cancelled'].includes(p.status)).length, color: 'text-red-500' },
                ].map(s => (
                    <div key={s.label} className="bg-white border border-border rounded-xl p-4">
                        <p className="text-slate-500 text-xs uppercase font-medium mb-2">{s.label}</p>
                        <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-border rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search payments…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 border border-border rounded-lg px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 capitalize">
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {loading ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState icon={<CreditCard className="w-8 h-8" />} text="No payments found." /> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-border bg-slate-50">
                                {['Student', 'Course', 'Amount', 'Status', 'Transaction ID', 'Date'].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-slate-500 font-medium">{h}</th>
                                ))}
                            </tr></thead>
                            <tbody>
                                {filtered.map(p => (
                                    <tr key={p.id} className="border-b border-border hover:bg-slate-50 transition">
                                        <td className="px-5 py-3 font-medium text-[#0a1128]">{p.student_name || p.student_email}</td>
                                        <td className="px-5 py-3 text-slate-500">{p.course_name}</td>
                                        <td className="px-5 py-3 font-bold text-[#0a1128]">{fmtCurrency(p.amount, p.currency)}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium capitalize ${statusColors[p.status] ?? 'bg-slate-100 text-slate-500'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-slate-400 font-mono text-xs">{p.transaction_id}</td>
                                        <td className="px-5 py-3 text-slate-400">{fmtDate(p.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-5 py-2 text-slate-400 text-xs border-t border-border">
                            Showing {filtered.length} of {payments.length} payments
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════════════════════
// MESSAGES TAB
// ══════════════════════════════════════════════════════════════════════════════
function MessagesTab({ students, messages, adminName, adminUid }: {
    students: Student[]; messages: Message[]; adminName: string; adminUid: string
}) {
    const [recipientType, setRecipientType] = useState<'all' | 'single'>('all')
    const [recipientId, setRecipientId] = useState('')
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [expanded, setExpanded] = useState<string | null>(null)

    // Replies from students to admin messages
    const [replies, setReplies] = useState<Record<string, any[]>>({})
    // New direct messages from students
    const [studentMessages, setStudentMessages] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState<'sent' | 'inbox'>('sent')

    useEffect(() => {
        // Fetch all student replies grouped by messageId
        const q = query(collection(db, 'student_replies'), orderBy('sentAt', 'asc'))
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
    }, [])

    useEffect(() => {
        // Fetch new messages sent directly from students
        const q = query(collection(db, 'student_messages'), orderBy('sentAt', 'desc'))
        const unsub = onSnapshot(q, snap => {
            setStudentMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        })
        return () => unsub()
    }, [])

    const selectedStudent = students.find(s => s.uid === recipientId)

    const handleSend = async () => {
        if (!subject.trim() || !body.trim()) return
        if (recipientType === 'single' && !recipientId) return
        setSending(true)
        try {
            const msg: any = {
                subject: subject.trim(),
                body: body.trim(),
                recipientType,
                sentBy: adminName,
                sentByUid: adminUid,
                sentAt: serverTimestamp(),
                readBy: [],
            }
            if (recipientType === 'single') {
                msg.recipientId = recipientId
                msg.recipientName = selectedStudent?.name ?? ''
                msg.recipientEmail = selectedStudent?.email ?? ''
            }
            await addDoc(collection(db, 'admin_messages'), msg)
            setSubject(''); setBody(''); setRecipientId(''); setSent(true)
            setTimeout(() => setSent(false), 3000)
        } finally { setSending(false) }
    }

    const markStudentMsgRead = async (id: string) => {
        await updateDoc(doc(db, 'student_messages', id), { status: 'read' })
    }

    const totalUnread = studentMessages.filter(m => m.status === 'unread').length
    const totalReplies = Object.values(replies).reduce((s, r) => s + r.length, 0)

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-black text-[#0a1128]">Messages</h1>
                <p className="text-slate-500 text-sm">Send announcements or direct messages to students</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Compose */}
                <div className="bg-white border border-border rounded-2xl p-5">
                    <h2 className="font-bold text-[#0a1128] mb-4 flex items-center gap-2"><Send className="w-4 h-4 text-primary" /> Compose Message</h2>

                    {sent && (
                        <div className="mb-4 bg-primary/10 text-primary border border-primary/20 rounded-xl px-4 py-2.5 text-sm flex items-center gap-2">
                            <Check className="w-4 h-4" /> Message sent successfully!
                        </div>
                    )}

                    {/* Recipient type */}
                    <div className="flex gap-2 mb-4">
                        {(['all', 'single'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setRecipientType(t)}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition ${recipientType === t ? 'bg-[#0a1128] text-white border-[#0a1128]' : 'border-border text-slate-600 hover:bg-slate-50'}`}
                            >
                                {t === 'all' ? '📢 All Students' : '👤 Single Student'}
                            </button>
                        ))}
                    </div>

                    {recipientType === 'single' && (
                        <div className="mb-4 space-y-1.5">
                            <Label className="text-slate-700 font-semibold">Select Student</Label>
                            <select value={recipientId} onChange={e => setRecipientId(e.target.value)} className="w-full h-9 border border-border rounded-lg px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
                                <option value="">Choose a student…</option>
                                {students.map(s => <option key={s.uid} value={s.uid}>{s.name} — {s.email}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label className="text-slate-700 font-semibold">Subject</Label>
                            <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Announcement subject…" className="h-9" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-slate-700 font-semibold">Message</Label>
                            <textarea
                                value={body}
                                onChange={e => setBody(e.target.value)}
                                placeholder="Write your message here…"
                                rows={5}
                                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white resize-none"
                            />
                        </div>
                        <Button
                            onClick={handleSend}
                            disabled={sending || !subject.trim() || !body.trim() || (recipientType === 'single' && !recipientId)}
                            className="w-full bg-[#0a1128] hover:bg-[#0d1a3a] text-white"
                        >
                            {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                            {sending ? 'Sending…' : recipientType === 'all' ? `Send to All ${students.length} Students` : 'Send Message'}
                        </Button>
                    </div>
                </div>

                {/* Right panel — Sent / Inbox tabs */}
                <div className="bg-white border border-border rounded-2xl overflow-hidden flex flex-col">
                    {/* Tab header */}
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => setActiveTab('sent')}
                            className={`flex-1 py-3 text-sm font-semibold transition ${activeTab === 'sent' ? 'text-[#0a1128] border-b-2 border-[#0a1128]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Sent Messages
                            {totalReplies > 0 && <span className="ml-1.5 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{totalReplies} replies</span>}
                        </button>
                        <button
                            onClick={() => setActiveTab('inbox')}
                            className={`flex-1 py-3 text-sm font-semibold transition relative ${activeTab === 'inbox' ? 'text-[#0a1128] border-b-2 border-[#0a1128]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Student Inbox
                            {totalUnread > 0 && <span className="ml-1.5 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">{totalUnread} new</span>}
                        </button>
                    </div>

                    {/* Sent Messages with inline replies */}
                    {activeTab === 'sent' && (
                        <div className="divide-y divide-border overflow-y-auto max-h-[520px]">
                            {messages.length === 0 ? (
                                <div className="p-10 text-center text-slate-400">
                                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">No messages sent yet.</p>
                                </div>
                            ) : messages.map(m => {
                                const threadReplies = replies[m.id] || []
                                const isOpen = expanded === m.id
                                return (
                                    <div key={m.id}>
                                        <div
                                            className="px-5 py-4 hover:bg-slate-50 transition cursor-pointer"
                                            onClick={() => setExpanded(isOpen ? null : m.id)}
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-1">
                                                <p className="font-semibold text-[#0a1128] text-sm">{m.subject}</p>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {threadReplies.length > 0 && (
                                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                                            {threadReplies.length} repl{threadReplies.length === 1 ? 'y' : 'ies'}
                                                        </span>
                                                    )}
                                                    <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${m.recipientType === 'all' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                                                        {m.recipientType === 'all' ? 'All students' : m.recipientName}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-slate-500 text-sm line-clamp-2">{m.body}</p>
                                            <p className="text-slate-400 text-xs mt-1">{fmtDate(m.sentAt)} · by {m.sentBy}</p>
                                        </div>

                                        {/* Expanded thread */}
                                        {isOpen && threadReplies.length > 0 && (
                                            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 space-y-3">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Replies</p>
                                                {threadReplies.map((r: any) => (
                                                    <div key={r.id} className="bg-white rounded-xl border border-border p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                                                                    {r.studentName?.charAt(0)?.toUpperCase() ?? 'S'}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-semibold text-[#0a1128]">{r.studentName}</p>
                                                                    <p className="text-xs text-slate-400">{r.studentEmail}</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-slate-400">{fmtDate(r.sentAt)}</p>
                                                        </div>
                                                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{r.body}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {isOpen && threadReplies.length === 0 && (
                                            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 text-center">
                                                <p className="text-xs text-slate-400">No replies yet.</p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Student direct messages */}
                    {activeTab === 'inbox' && (
                        <div className="divide-y divide-border overflow-y-auto max-h-[520px]">
                            {studentMessages.length === 0 ? (
                                <div className="p-10 text-center text-slate-400">
                                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">No student messages yet.</p>
                                </div>
                            ) : studentMessages.map((m: any) => (
                                <div
                                    key={m.id}
                                    className={`px-5 py-4 hover:bg-slate-50 transition cursor-pointer ${m.status === 'unread' ? 'bg-blue-50/40' : ''}`}
                                    onClick={() => { setExpanded(expanded === m.id ? null : m.id); markStudentMsgRead(m.id) }}
                                >
                                    <div className="flex items-start justify-between gap-3 mb-1">
                                        <div className="flex items-center gap-2">
                                            {m.status === 'unread' && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                                            <p className={`text-sm font-semibold ${m.status === 'unread' ? 'text-[#0a1128]' : 'text-slate-600'}`}>
                                                {m.studentName}
                                            </p>
                                        </div>
                                        <p className="text-xs text-slate-400 shrink-0">{fmtDate(m.sentAt)}</p>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">{m.subject}</p>
                                    {expanded === m.id ? (
                                        <p className="text-sm text-slate-600 whitespace-pre-wrap mt-2">{m.body}</p>
                                    ) : (
                                        <p className="text-sm text-slate-500 line-clamp-2">{m.body}</p>
                                    )}
                                    <p className="text-xs text-slate-400 mt-1">{m.studentEmail}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


// ─── Shared UI helpers ────────────────────────────────────────────────────────
function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    )
}
function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <span className="mb-2 opacity-30">{icon}</span>
            <p className="text-sm">{text}</p>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════════════════════
// HIRE REQUESTS TAB
// ══════════════════════════════════════════════════════════════════════════════
function HireRequestsTab({ requests }: { requests: HireRequest[] }) {
    const [marking, setMarking] = useState<string | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)

    const markReviewed = async (id: string) => {
        setMarking(id)
        await updateDoc(doc(db, 'hire_requests', id), { status: 'reviewed' })
        setMarking(null)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this request?')) return
        setDeleting(id)
        await deleteDoc(doc(db, 'hire_requests', id))
        setDeleting(null)
    }

    const newCount = requests.filter(r => r.status === 'new').length

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-[#0a1128]">Hire Requests</h1>
                    <p className="text-slate-500 text-sm">
                        {requests.length} total &middot;{' '}
                        <span className="text-primary font-semibold">{newCount} new</span>
                    </p>
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="bg-white border border-border rounded-2xl p-16 text-center">
                    <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No hire requests yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map(r => (
                        <div key={r.id} className={`bg-white border rounded-2xl p-6 hover:shadow-md transition ${r.status === 'new' ? 'border-primary/30 ring-1 ring-primary/20' : 'border-border'}`}>
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-black text-[#0a1128] text-lg">{r.fullName}</h3>
                                        <span className={`text-xs rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wide ${r.status === 'new' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                                            {r.status === 'new' ? 'New' : 'Reviewed'}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 font-semibold">{r.company}{r.industry ? ` · ${r.industry}` : ''}</p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-1">
                                        <span>{r.email}</span>
                                        {r.phone && <span>{r.phone}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {r.status === 'new' && (
                                        <Button size="sm" variant="outline" onClick={() => markReviewed(r.id)} disabled={marking === r.id} className="text-primary border-primary/40 hover:bg-primary/5">
                                            {marking === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                            <span className="ml-1">Mark Reviewed</span>
                                        </Button>
                                    )}
                                    <Button size="sm" variant="outline" onClick={() => handleDelete(r.id)} disabled={deleting === r.id} className="text-red-500 hover:bg-red-50 hover:border-red-200">
                                        {deleting === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4 text-sm mb-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Talent Type</p>
                                    <p className="text-slate-700 font-medium capitalize">{r.talentType?.replace(/-/g, ' ')}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Professionals Needed</p>
                                    <p className="text-slate-700 font-medium">{r.count}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Submitted</p>
                                    <p className="text-slate-700 font-medium">{fmtDate(r.createdAt)}</p>
                                </div>
                            </div>

                            {r.skills?.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Skills Needed</p>
                                    <div className="flex flex-wrap gap-2">
                                        {r.skills.map(s => (
                                            <span key={s} className="text-xs bg-[#0a1128]/5 text-[#0a1128] px-3 py-1 rounded-full font-medium border border-[#0a1128]/10">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {r.responsibilities && (
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Responsibilities</p>
                                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{r.responsibilities}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
