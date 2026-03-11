import { useState } from 'react'
import { ChevronUp, ChevronDown, Search, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { Student } from '../types'
import { fmtDate } from '../utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoadingSpinner, EmptyState } from '../components/SharedUI'

interface StudentsTabProps {
    students: Student[]
    loading: boolean
}

export function StudentsTab({ students, loading }: StudentsTabProps) {
    const [search, setSearch] = useState('')
    const [sortField, setSortField] = useState<keyof Student>('name')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
    const [program, setProgram] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const programs = ['All', ...Array.from(new Set(students.map(s => s.program).filter(Boolean)))]

    const handleSort = (f: keyof Student) => {
        if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortField(f); setSortDir('asc') }
        setCurrentPage(1) // Reset to first page on sort
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

    // Pagination Logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const paginatedStudents = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const Th = ({ label, field }: { label: string; field: keyof Student }) => (
        <th onClick={() => handleSort(field)} className="px-5 py-3 text-left text-slate-500 font-medium cursor-pointer hover:text-navy transition select-none">
            <span className="flex items-center gap-1 font-bold uppercase tracking-wider text-[10px]">{label}
                {sortField === field ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-primary" /> : <ChevronDown className="w-3 h-3 text-primary" />) : <ChevronUp className="w-3 h-3 opacity-20" />}
            </span>
        </th>
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-navy">Students</h1>
                    <p className="text-slate-500 text-xs sm:text-sm">{students.length} registered students</p>
                </div>
            </div>

            <div className="bg-white border border-border rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
                <div className="p-3 sm:p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search students…" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1) }} className="pl-9 h-10 text-xs font-medium" />
                    </div>
                    <select value={program} onChange={e => { setProgram(e.target.value); setCurrentPage(1) }} className="h-10 border border-border rounded-lg px-3 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                        {programs.map(p => <option key={p}>{p}</option>)}
                    </select>
                </div>

                {loading ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState icon={<Users className="w-8 h-8" />} text="No students found." /> : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-border bg-slate-50">
                                    <Th label="Name" field="name" />
                                    <Th label="Email" field="email" />
                                    <Th label="Phone" field="phone" />
                                    <Th label="Program" field="program" />
                                    <Th label="Registered" field="createdAt" />
                                </tr></thead>
                                <tbody>
                                    {paginatedStudents.map(s => (
                                        <tr key={s.uid} className="border-b border-border hover:bg-slate-50/50 transition duration-200">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-black shadow-sm uppercase">{s.name?.charAt(0).toUpperCase() ?? '?'}</div>
                                                    <span className="font-bold text-navy truncate max-w-[150px]">{s.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-slate-500 font-medium truncate max-w-[200px]">{s.email}</td>
                                            <td className="px-5 py-4 text-slate-500 font-medium">{s.phone || '—'}</td>
                                            <td className="px-5 py-4"><span className="bg-secondary/10 text-secondary border border-secondary/10 rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">{s.program}</span></td>
                                            <td className="px-5 py-4 text-slate-400 font-bold text-xs">{fmtDate(s.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="md:hidden divide-y divide-border">
                            {paginatedStudents.map(s => (
                                <div key={s.uid} className="p-5 flex flex-col gap-4 hover:bg-slate-50/30 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center text-sm font-black shadow-md uppercase">{s.name?.charAt(0).toUpperCase() ?? '?'}</div>
                                        <div className="min-w-0">
                                            <p className="text-[13px] font-black text-navy break-words leading-tight">{s.name}</p>
                                            <p className="text-[10.5px] text-slate-500 break-words font-medium">{s.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[9px] mb-1.5 opacity-60">Program</p>
                                            <span className="bg-primary/5 text-primary border border-primary/10 rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-widest inline-block">{s.program}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[9px] mb-1.5 opacity-60">Phone</p>
                                                <p className="text-slate-600 font-bold text-xs italic">{s.phone || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[9px] mb-1.5 opacity-60">Joined</p>
                                                <p className="text-navy font-black text-xs uppercase tracking-tighter opacity-80">{fmtDate(s.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="px-5 py-3 bg-slate-50 border-t border-border flex items-center justify-between">
                            <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                                Showing <span className="font-bold text-navy">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-navy">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="font-bold text-navy">{filtered.length}</span> students
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
