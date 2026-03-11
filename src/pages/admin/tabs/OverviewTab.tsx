import { useState } from 'react'
import { Users, TrendingUp, BookOpen, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react'
import { Student, Course, Payment } from '../types'
import { fmtDate, fmtCurrency } from '../utils'
import { Button } from '@/components/ui/button'

interface OverviewTabProps {
    students: Student[]
    payments: Payment[]
    courses: Course[]
    totalRevenue: number
    thisMonth: number
    loading: boolean
}

export function OverviewTab({ students, payments, courses, totalRevenue, thisMonth, loading }: OverviewTabProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const completed = payments.filter(p => p.status === 'completed').length
    const pending = payments.filter(p => p.status === 'pending').length

    const stats = [
        { label: 'Total Students', value: students.length, icon: <Users className="w-5 h-5" />, sub: `+${thisMonth} this month` },
        { label: 'Total Revenue', value: fmtCurrency(totalRevenue), icon: <TrendingUp className="w-5 h-5" />, sub: `${completed} payments completed` },
        { label: 'Active Courses', value: courses.filter(c => c.isActive).length, icon: <BookOpen className="w-5 h-5" />, sub: `${courses.length} total` },
        { label: 'Pending Payments', value: pending, icon: <CreditCard className="w-5 h-5" />, sub: 'Awaiting confirmation' },
    ]

    // Pagination Logic
    const totalPages = Math.ceil(students.length / itemsPerPage)
    const paginatedStudents = students.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <div className="space-y-6 sm:space-y-8">
            <div>
                <h1 className="text-xl sm:text-2xl font-black text-navy">Dashboard Overview</h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">Welcome back - here's what's happening at DSSL.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map(s => (
                    <div key={s.label} className="bg-white border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">{s.label}</p>
                            <span className="text-primary opacity-80">{s.icon}</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-navy">{s.value}</p>
                        <p className="text-slate-400 text-[10px] mt-1 font-medium">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Recent Students */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden mt-8 shadow-sm">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold text-navy">Recent Registrations</h2>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Total: {students.length}</span>
                </div>
                {/* Table for Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-border bg-slate-50">
                            <th className="px-5 py-3 text-left text-slate-500 font-medium whitespace-nowrap">Name</th>
                            <th className="px-5 py-3 text-left text-slate-500 font-medium whitespace-nowrap">Program</th>
                            <th className="px-5 py-3 text-left text-slate-500 font-medium whitespace-nowrap">Date</th>
                        </tr></thead>
                        <tbody>
                            {paginatedStudents.map(s => (
                                <tr key={s.uid} className="border-b border-border hover:bg-slate-50 transition">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                                {s.name?.charAt(0).toUpperCase() ?? '?'}
                                            </div>
                                            <span className="font-medium text-navy">{s.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3"><span className="bg-secondary/10 text-secondary rounded-full px-2.5 py-0.5 text-xs font-medium">{s.program}</span></td>
                                    <td className="px-5 py-3 text-slate-400">{fmtDate(s.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Cards for Mobile */}
                <div className="md:hidden divide-y divide-border">
                    {paginatedStudents.map(s => (
                        <div key={s.uid} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition duration-200">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-navy text-white flex items-center justify-center text-[10px] font-black shadow-sm uppercase">
                                    {s.name?.charAt(0).toUpperCase() ?? '?'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-navy leading-tight mb-0.5 break-words">{s.name}</p>
                                    <p className="text-[9px] text-primary font-black uppercase tracking-widest italic break-words">{s.program}</p>
                                </div>
                            </div>
                            <div className="shrink-0 text-right ml-2">
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic break-words">{fmtDate(s.createdAt)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {students.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">No registrations yet.</div>
                ) : (
                    <div className="px-5 py-3 bg-slate-50 border-t border-border flex items-center justify-between">
                        <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                            Showing <span className="font-bold text-navy">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-navy">{Math.min(currentPage * itemsPerPage, students.length)}</span> of <span className="font-bold text-navy">{students.length}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-7 w-7 p-0 rounded-lg hover:bg-white hover:text-primary transition-all disabled:opacity-30"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] sm:text-xs font-black text-navy">{currentPage}</span>
                                <span className="text-[10px] sm:text-xs font-bold text-slate-300">/</span>
                                <span className="text-[10px] sm:text-xs font-bold text-slate-400">{totalPages}</span>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-7 w-7 p-0 rounded-lg hover:bg-white hover:text-primary transition-all disabled:opacity-30"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
