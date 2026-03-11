import { useState } from 'react'
import { Search, CreditCard, ChevronLeft, ChevronRight, RotateCcw, Loader2 } from 'lucide-react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Payment } from '../types'
import { fmtDate, fmtCurrency } from '../utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoadingSpinner, EmptyState } from '../components/SharedUI'

interface PaymentsTabProps {
    payments: Payment[]
    totalRevenue: number
    loading: boolean
}

export function PaymentsTab({ payments, totalRevenue, loading }: PaymentsTabProps) {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [isUpdating, setIsUpdating] = useState<string | null>(null)
    const itemsPerPage = 10

    const statuses = ['All', 'completed', 'pending', 'cancelled', 'failed', 'refunded']

    const filtered = payments.filter(p => {
        const q = search.toLowerCase()
        const matchSearch = p.student_name?.toLowerCase().includes(q) || p.course_name?.toLowerCase().includes(q) || p.transaction_id?.toLowerCase().includes(q)
        const matchStatus = statusFilter === 'All' || p.status === statusFilter
        return matchSearch && matchStatus
    })

    // Pagination Logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const paginatedPayments = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const statusColors: Record<string, string> = {
        completed: 'bg-primary/10 text-primary',
        pending: 'bg-yellow-50 text-yellow-600',
        cancelled: 'bg-red-50 text-red-600 border border-red-100',
        failed: 'bg-red-50 text-red-600 border border-red-100',
        refunded: 'bg-secondary/10 text-secondary',
    }

    const handleRefund = async (paymentId: string) => {
        if (!window.confirm('Are you sure you want to mark this payment as refunded? This will update the database and adjust your revenue totals.')) return

        setIsUpdating(paymentId)
        try {
            const paymentRef = doc(db, 'course_payments', paymentId)
            await updateDoc(paymentRef, { status: 'refunded' })
        } catch (error) {
            console.error('Error updating payment status:', error)
            alert('Failed to update payment status. Please try again.')
        } finally {
            setIsUpdating(null)
        }
    }

    const completedRevenue = payments.filter(p => p.status?.toLowerCase() === 'completed').reduce((s, p) => s + p.amount, 0)
    const pendingRevenue = payments.filter(p => p.status?.toLowerCase() === 'pending').reduce((s, p) => s + p.amount, 0)

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-black text-navy">Payments</h1>
                <p className="text-slate-500 text-xs sm:text-sm">{payments.length} total transactions</p>
            </div>

            {/* Revenue cards */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { label: 'Total Revenue', value: fmtCurrency(completedRevenue), color: 'text-primary' },
                    { label: 'Pending', value: fmtCurrency(pendingRevenue), color: 'text-yellow-600' },
                    { label: 'Completed', value: payments.filter(p => p.status?.toLowerCase() === 'completed').length, color: 'text-primary' },
                    { label: 'Failed/Cancelled', value: payments.filter(p => ['failed', 'cancelled'].includes(p.status?.toLowerCase() ?? '')).length, color: 'text-red-500' },
                ].map(s => (
                    <div key={s.label} className="bg-white border border-border rounded-xl p-3 sm:p-4 shadow-sm">
                        <p className="text-slate-500 text-[10px] uppercase font-bold mb-1 sm:mb-2 leading-tight">{s.label}</p>
                        <p className={`text-sm sm:text-lg md:text-xl font-black break-words ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-border rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
                <div className="p-3 sm:p-4 border-b border-border flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search payments…" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1) }} className="pl-9 h-10 text-xs font-medium" />
                    </div>
                    <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1) }} className="h-10 border border-border rounded-lg px-3 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 capitalize cursor-pointer">
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {loading ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState icon={<CreditCard className="w-8 h-8" />} text="No payments found." /> : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-border bg-slate-50">
                                    {['Student', 'Course', 'Amount', 'Status', 'Transaction ID', 'Date', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-slate-500 font-bold uppercase tracking-wider text-[10px]">{h}</th>
                                    ))}
                                </tr></thead>
                                <tbody>
                                    {paginatedPayments.map(p => (
                                        <tr key={p.id} className="border-b border-border hover:bg-slate-50/50 transition duration-200">
                                            <td className="px-5 py-4 font-bold text-navy break-words">{p.student_name || p.student_email}</td>
                                            <td className="px-5 py-4 text-primary font-black break-words uppercase text-[11px] tracking-tight">{p.course_name}</td>
                                            <td className="px-5 py-4 font-black text-navy">{fmtCurrency(p.amount, p.currency)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`text-[10px] rounded-full px-2.5 py-0.5 font-black uppercase tracking-widest shadow-sm ${statusColors[p.status?.toLowerCase() ?? ''] ?? 'bg-slate-100 text-slate-500'}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-slate-400 font-mono text-[10px] break-words opacity-70">{p.transaction_id}</td>
                                            <td className="px-5 py-4 text-slate-400 font-bold text-[11px]">{fmtDate(p.created_at)}</td>
                                            <td className="px-5 py-4 min-w-[100px]">
                                                {p.status?.toLowerCase() === 'completed' && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleRefund(p.id)}
                                                        disabled={isUpdating === p.id}
                                                        className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1.5 transition-colors border border-transparent hover:border-red-100"
                                                    >
                                                        {isUpdating === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                                                        <span className="text-[10px] font-black uppercase tracking-tight">Refund</span>
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="md:hidden divide-y divide-border">
                            {paginatedPayments.map(p => (
                                <div key={p.id} className="p-5 flex flex-col gap-3 hover:bg-slate-50/30 transition">
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0">
                                            <p className="font-black text-navy leading-tight mb-1 break-words text-[13px]">{p.student_name || 'Legacy Student'}</p>
                                            <p className="text-[11px] text-primary font-black uppercase tracking-tight break-words">{p.course_name}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                                            <span className={`text-[9px] rounded-full px-2 py-0.5 font-black uppercase tracking-widest shadow-sm ${statusColors[p.status?.toLowerCase() ?? ''] ?? 'bg-slate-100 text-slate-500'}`}>
                                                {p.status}
                                            </span>
                                            {p.status?.toLowerCase() === 'completed' && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleRefund(p.id)}
                                                    disabled={isUpdating === p.id}
                                                    className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md flex items-center gap-1 transition-colors border border-red-100"
                                                >
                                                    {isUpdating === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                                                    <span className="text-[9px] font-black uppercase">Refund</span>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between pt-1">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1 opacity-60">Transaction ID</p>
                                            <p className="text-[10px] font-mono text-slate-400 break-words opacity-70">{p.transaction_id || 'manual-entry'}</p>
                                        </div>
                                        <div className="text-right shrink-0 ml-4">
                                            <p className="text-lg font-black text-navy leading-none mb-1">{fmtCurrency(p.amount, p.currency)}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter opacity-80">{fmtDate(p.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="px-5 py-3 bg-slate-50 border-t border-border flex items-center justify-between">
                            <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                                Showing <span className="font-bold text-navy">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-navy">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="font-bold text-navy">{filtered.length}</span> payments
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 p-0 rounded-xl hover:bg-white hover:text-primary transition-all disabled:opacity-20"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <div className="hidden sm:flex items-center gap-1.5">
                                    <span className="text-xs font-black text-navy">{currentPage}</span>
                                    <span className="text-xs font-bold text-slate-300">/</span>
                                    <span className="text-xs font-bold text-slate-400">{totalPages}</span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="h-8 w-8 p-0 rounded-xl hover:bg-white hover:text-primary transition-all disabled:opacity-20"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
