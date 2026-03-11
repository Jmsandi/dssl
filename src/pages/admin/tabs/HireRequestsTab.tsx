import React, { useState, useMemo } from 'react'
import { Check, Trash2, UserCircle2, Briefcase, Search, Target, Mail, Phone, Eye, EyeOff, Building2, Globe, Zap, Info, AlertTriangle } from 'lucide-react'
import { HireRequest } from '../types'
import { fmtDate } from '../utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { db } from '@/lib/firebase'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { EmptyState } from '../components/SharedUI'

interface HireRequestsTabProps {
    requests: HireRequest[]
}

export function HireRequestsTab({ requests }: HireRequestsTabProps) {
    const [search, setSearch] = useState('')
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

    const filteredRequests = useMemo(() => {
        return requests.filter(r =>
            r.fullName.toLowerCase().includes(search.toLowerCase()) ||
            r.company.toLowerCase().includes(search.toLowerCase()) ||
            r.talentType.toLowerCase().includes(search.toLowerCase())
        ).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    }, [requests, search])

    const markRead = async (id: string) => {
        await updateDoc(doc(db, 'hire_requests', id), { status: 'read' })
    }

    const executeDelete = async () => {
        if (!confirmDeleteId) return
        const id = confirmDeleteId
        setConfirmDeleteId(null)
        setDeletingId(id)
        try {
            await deleteDoc(doc(db, 'hire_requests', id))
        } catch (error) {
            console.error("Error deleting request:", error)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-navy uppercase tracking-tight">Hire Requests</h1>
                    <p className="text-slate-500 text-xs">Manage incoming talent inquiries</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search..."
                        className="pl-10 h-10 text-xs border-slate-200 rounded-lg"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {requests.length === 0 ? (
                <EmptyState icon={<Briefcase className="w-8 h-8" />} text="No hire requests yet." />
            ) : (
                <div className="space-y-4">
                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 gap-3 md:hidden">
                        {filteredRequests.map(r => (
                            <div key={r.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${r.status === 'unread' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                                            <UserCircle2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-navy text-sm leading-tight">{r.fullName}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">{r.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                                            className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${expandedId === r.id ? 'bg-navy border-navy text-white' : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'}`}
                                        >
                                            {expandedId === r.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setConfirmDeleteId(r.id)}
                                            className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            disabled={deletingId === r.id}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {expandedId === r.id && (
                                    <div className="px-4 pb-4 space-y-4 bg-slate-50 border-t border-slate-100 animate-in fade-in duration-200">
                                        <div className="pt-4 grid grid-cols-1 gap-4 text-[11px]">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Contact</p>
                                                    <div className="space-y-1">
                                                        <a href={`mailto:${r.email}`} className="text-primary flex items-center gap-1 hover:underline truncate"><Mail className="w-3 h-3" /> {r.email}</a>
                                                        <a href={`tel:${r.phone}`} className="text-navy flex items-center gap-1 font-semibold"><Phone className="w-3 h-3" /> {r.phone}</a>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Talent Info</p>
                                                    <p className="text-navy font-semibold flex items-center gap-1"><Target className="w-3 h-3" /> {r.talentType}</p>
                                                    <p className="text-navy font-semibold">{r.count} Position(s)</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Industry & Source</p>
                                                <p className="text-navy font-semibold">{r.industry} • {r.referral || 'Direct'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Skills</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {r.skills.map(s => <span key={s} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-600 uppercase">{s}</span>)}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Responsibilities</p>
                                                <div className="bg-white p-3 rounded border border-slate-200 text-xs italic leading-relaxed text-slate-600 whitespace-pre-wrap">
                                                    {r.responsibilities}
                                                </div>
                                            </div>
                                        </div>
                                        {r.status === 'unread' && (
                                            <Button size="sm" onClick={() => markRead(r.id)} className="w-full bg-navy hover:bg-navy/90 text-white font-bold h-9 uppercase text-[10px]">
                                                Mark as Handled
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider">Talent Type</th>
                                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-right w-32">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredRequests.map(r => (
                                        <React.Fragment key={r.id}>
                                            <tr className={`hover:bg-slate-50 transition-colors ${r.status === 'unread' ? 'bg-primary/[0.02]' : ''}`}>
                                                <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-medium">
                                                    {fmtDate(r.createdAt)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${r.status === 'unread' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                            <UserCircle2 className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-navy">{r.fullName}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{r.company}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-slate-600">{r.talentType}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                                                            className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 ${expandedId === r.id ? 'bg-navy border-navy text-white' : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'}`}
                                                            title="Toggle Details"
                                                        >
                                                            {expandedId === r.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setConfirmDeleteId(r.id)}
                                                            disabled={deletingId === r.id}
                                                            className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                                            title="Delete Request"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedId === r.id && (
                                                <tr className="bg-slate-50 border-t border-slate-100">
                                                    <td colSpan={4} className="px-10 py-6">
                                                        <div className="grid grid-cols-3 gap-10 animate-in fade-in duration-200">
                                                            <div className="space-y-4">
                                                                <div className="space-y-1">
                                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contact Info</p>
                                                                    <div className="space-y-1">
                                                                        <a href={`mailto:${r.email}`} className="text-sm font-bold text-primary hover:underline flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {r.email}</a>
                                                                        <p className="text-sm font-bold text-navy flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {r.phone}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Organization & Source</p>
                                                                    <p className="text-sm font-bold text-navy uppercase">{r.industry} • {r.referral || 'Organic'}</p>
                                                                </div>
                                                            </div>

                                                            <div className="col-span-2 space-y-4">
                                                                <div className="grid grid-cols-2 gap-8">
                                                                    <div className="space-y-2">
                                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Talent Brief</p>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {r.skills.map(s => (
                                                                                <span key={s} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-600 uppercase">{s}</span>
                                                                            ))}
                                                                        </div>
                                                                        <p className="text-xs font-semibold text-slate-500 pt-1">Needs <span className="text-navy">{r.count} Position(s)</span></p>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Responsibilities</p>
                                                                        <div className="bg-white p-4 rounded border border-slate-200 text-xs italic leading-relaxed text-slate-600 whitespace-pre-wrap">
                                                                            {r.responsibilities}
                                                                        </div>
                                                                        {r.status === 'unread' && (
                                                                            <div className="pt-3 flex justify-end">
                                                                                <Button size="sm" onClick={() => markRead(r.id)} className="bg-navy hover:bg-navy/90 text-white font-bold text-[10px] uppercase h-8 px-6 rounded shadow-sm">
                                                                                    <Check className="w-3 h-3 mr-1" /> Mark as Handled
                                                                                </Button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Modal */}
            {confirmDeleteId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setConfirmDeleteId(null)} />
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-navy uppercase tracking-tight">Delete Request?</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Are you sure you want to remove this hire request? This action cannot be undone.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 w-full pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="h-12 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 uppercase text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={executeDelete}
                                    className="h-12 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white uppercase text-xs"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
