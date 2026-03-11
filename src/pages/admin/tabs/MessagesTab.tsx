import { useState, useEffect } from 'react'
import { Send, Check, Loader2, MessageSquare, Users, User, History, Inbox, Mail, Reply } from 'lucide-react'
import { Student, Message } from '../types'
import { fmtDate } from '../utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot, serverTimestamp, addDoc, updateDoc, doc } from 'firebase/firestore'

interface MessagesTabProps {
    students: Student[]
    messages: Message[]
    adminName: string
    adminUid: string
}

export function MessagesTab({ students, messages, adminName, adminUid }: MessagesTabProps) {
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-navy">Communications</h1>
                    <p className="text-slate-500 text-xs sm:text-sm">Manage announcements and direct student messaging</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Compose Panel */}
                <div className="lg:col-span-5">
                    <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-sm sticky top-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Mail className="w-4 h-4" />
                            </div>
                            <h2 className="font-bold text-navy text-base tracking-tight">Compose Message</h2>
                        </div>

                        {sent && (
                            <div className="mb-6 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                <Check className="w-4 h-4 shrink-0" /> Message sent successfully!
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-slate-500 font-bold text-[10px] uppercase tracking-widest px-1">Recipient Mode</Label>
                                <div className="flex p-1 bg-slate-50 border border-border rounded-xl gap-1">
                                    {(['all', 'single'] as const).map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setRecipientType(t)}
                                            className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-2 uppercase tracking-tight ${recipientType === t ? 'bg-white text-navy shadow-sm border border-border' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {t === 'all' ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                            {t === 'all' ? 'Broadcast' : 'Direct'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {recipientType === 'single' && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-1 transition-all">
                                    <Label className="text-slate-500 font-bold text-[10px] uppercase tracking-widest px-1">Select Student</Label>
                                    <select value={recipientId} onChange={e => setRecipientId(e.target.value)} className="w-full h-10 border border-border rounded-xl px-3 text-xs bg-white focus:ring-2 focus:ring-primary/20 outline-none font-medium text-slate-700 transition appearance-none cursor-pointer">
                                        <option value="">Choose recipient…</option>
                                        {students.map(s => <option key={s.uid} value={s.uid}>{s.name} ({s.email})</option>)}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-500 font-bold text-[10px] uppercase tracking-widest px-1">Subject Line</Label>
                                    <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Enter brief subject…" className="h-10 text-xs font-medium rounded-xl border-border focus:ring-primary/20" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-500 font-bold text-[10px] uppercase tracking-widest px-1">Message Content</Label>
                                    <textarea
                                        value={body}
                                        onChange={e => setBody(e.target.value)}
                                        placeholder="Type your message here…"
                                        rows={8}
                                        className="w-full border border-border rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none bg-white resize-none leading-relaxed transition"
                                    />
                                </div>
                                <Button
                                    onClick={handleSend}
                                    disabled={sending || !subject.trim() || !body.trim() || (recipientType === 'single' && !recipientId)}
                                    className="w-full h-12 bg-navy hover:bg-navy/90 text-white rounded-xl shadow-lg shadow-navy/10 group overflow-hidden relative"
                                >
                                    <div className="flex items-center justify-center gap-2 relative z-10 transition-transform group-active:scale-95">
                                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                                        <span className="text-xs font-bold uppercase tracking-widest">{sending ? 'Sending Message…' : 'Dispatch Message'}</span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History/Inbox Panel */}
                <div className="lg:col-span-7">
                    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col h-full min-h-[600px]">
                        <div className="flex border-b border-border bg-slate-50/30">
                            {[
                                { id: 'sent', label: 'Outgoing', icon: <History className="w-4 h-4" />, count: totalReplies },
                                { id: 'inbox', label: 'Incoming', icon: <Inbox className="w-4 h-4" />, count: totalUnread, badge: 'red' }
                            ].map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id as any)}
                                    className={`flex-1 py-4 text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 relative border-r last:border-r-0 border-border ${activeTab === t.id ? 'bg-white text-navy border-b-2 border-b-navy' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'}`}
                                >
                                    {t.icon}
                                    {t.label}
                                    {t.count > 0 && (
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${t.badge === 'red' ? 'bg-red-500 text-white animate-pulse' : 'bg-navy/10 text-navy'}`}>
                                            {t.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="divide-y divide-border overflow-y-auto">
                            {activeTab === 'sent' ? (
                                messages.length === 0 ? (
                                    <div className="py-24 text-center">
                                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-border">
                                            <History className="w-6 h-6 text-slate-200" />
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Sent History</p>
                                    </div>
                                ) : messages.map(m => {
                                    const threadReplies = replies[m.id] || []
                                    const isOpen = expanded === m.id
                                    return (
                                        <div key={m.id} className={`group transition-all ${isOpen ? 'bg-slate-50/50 border-y border-border' : 'hover:bg-slate-50/30'}`}>
                                            <div className="px-5 py-5 cursor-pointer" onClick={() => setExpanded(isOpen ? null : m.id)}>
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-navy text-sm tracking-tight leading-snug group-hover:text-primary transition-colors">{m.subject}</h3>
                                                        <div className="flex items-center gap-3 mt-1.5">
                                                            <span className={`text-[9px] rounded-md px-2 py-0.5 font-black uppercase tracking-wider border ${m.recipientType === 'all' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{m.recipientType === 'all' ? 'Campaign' : 'Direct'}</span>
                                                            <span className="text-slate-400 text-[10px] font-medium tracking-tight">Sent {fmtDate(m.sentAt)}</span>
                                                        </div>
                                                    </div>
                                                    {threadReplies.length > 0 && (
                                                        <div className="flex items-center gap-1.5 shrink-0 bg-white border border-border rounded-lg px-2 py-1 shadow-sm">
                                                            <Reply className="w-3 h-3 text-primary" />
                                                            <span className="text-[10px] font-black text-navy">{threadReplies.length}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className={`text-slate-500 text-xs leading-relaxed ${isOpen ? '' : 'line-clamp-2'}`}>{m.body}</p>
                                            </div>
                                            {isOpen && (
                                                <div className="px-5 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="h-px bg-slate-200 flex-1" />
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Communication Thread</span>
                                                        <div className="h-px bg-slate-200 flex-1" />
                                                    </div>
                                                    {threadReplies.length === 0 ? (
                                                        <div className="text-center py-4 bg-white/50 rounded-xl border border-dashed border-slate-200">
                                                            <p className="text-[11px] text-slate-400 font-medium">No replies recorded for this message.</p>
                                                        </div>
                                                    ) : threadReplies.map((r: any) => (
                                                        <div key={r.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
                                                            <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
                                                                <div className="flex items-center gap-2.5">
                                                                    <div className="w-7 h-7 rounded-lg bg-navy text-white flex items-center justify-center text-[10px] font-black shadow-sm uppercase">{r.studentName?.charAt(0) ?? 'S'}</div>
                                                                    <div>
                                                                        <p className="text-[11px] font-black text-navy leading-none mb-0.5">{r.studentName}</p>
                                                                        <p className="text-[9px] text-slate-400 font-medium">{r.studentEmail}</p>
                                                                    </div>
                                                                </div>
                                                                <span className="text-[9px] text-slate-400 font-bold uppercase">{fmtDate(r.sentAt)}</span>
                                                            </div>
                                                            <p className="text-[12px] text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{r.body}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            ) : (
                                studentMessages.length === 0 ? (
                                    <div className="py-24 text-center">
                                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-border">
                                            <Inbox className="w-6 h-6 text-slate-200" />
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inbox is Empty</p>
                                    </div>
                                ) : studentMessages.map((m: any) => (
                                    <div key={m.id} className={`px-5 py-5 cursor-pointer transition-colors group ${m.status === 'unread' ? 'bg-blue-50/40' : 'hover:bg-slate-50/50'}`} onClick={() => { setExpanded(expanded === m.id ? null : m.id); markStudentMsgRead(m.id) }}>
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-2 h-2 rounded-full shrink-0 ${m.status === 'unread' ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] animate-pulse' : 'bg-slate-200 group-hover:bg-slate-300'}`} />
                                                <div className="min-w-0">
                                                    <p className={`text-[12px] font-black leading-none mb-1 ${m.status === 'unread' ? 'text-navy' : 'text-slate-600'}`}>{m.studentName}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium truncate">{m.studentEmail}</p>
                                                </div>
                                            </div>
                                            <span className="text-[9px] text-slate-400 font-bold uppercase shrink-0 tracking-tight">{fmtDate(m.sentAt)}</span>
                                        </div>
                                        <h4 className="text-[11px] font-bold text-navy uppercase tracking-tight mb-2 border-l-2 border-primary/20 pl-2 leading-tight">{m.subject}</h4>
                                        {expanded === m.id ? (
                                            <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm text-[12px] text-slate-600 font-medium leading-relaxed whitespace-pre-wrap mt-3 animate-in zoom-in-95 duration-200">
                                                {m.body}
                                            </div>
                                        ) : (
                                            <p className="text-[12px] text-slate-500 font-medium line-clamp-1 opacity-70 leading-relaxed">{m.body}</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
