import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth'
import { BookOpen, CreditCard, ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Course } from '@/lib/courses'

export default function StudentApply() {
    const { profile, user } = useAuth()
    const navigate = useNavigate()
    const [courses, setCourses] = useState<Course[]>([])
    const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(true)
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

    // Checkout form state
    const [phone, setPhone] = useState(profile?.phone || '')
    const [provider, setProvider] = useState('orange')
    const [paying, setPaying] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return
            try {
                // Fetch active courses
                const coursesSnap = await getDocs(query(collection(db, 'courses'), where('isActive', '==', true)))
                const cData = coursesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Course))
                setCourses(cData)

                // Fetch student enrollments
                const enrollSnap = await getDocs(query(
                    collection(db, 'enrollments'),
                    where('student_id', '==', user.uid),
                    where('status', '==', 'active')
                ))
                setEnrolledIds(new Set(enrollSnap.docs.map(d => d.data().course_id)))
            } catch (err) {
                console.error('Error fetching data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [user])

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedCourse || !phone || !provider) return

        setPaying(true)
        setError('')

        try {
            // Call the Firebase Cloud Function directly (not a Vite proxy route)
            const functionsUrl = import.meta.env.VITE_FUNCTIONS_URL ||
                'https://us-central1-d-website-8967d.cloudfunctions.net'
            const res = await fetch(`${functionsUrl}/coursePayment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_id: user?.uid,
                    student_name: profile?.name,
                    student_email: profile?.email,
                    course_id: selectedCourse.id,
                    course_name: selectedCourse.name,
                    amount: selectedCourse.price,
                    currency: selectedCourse.currency,
                    phone_number: phone,
                    provider: provider
                })
            })

            // Guard against HTML responses (backend unreachable / wrong URL)
            const contentType = res.headers.get('content-type') || ''
            if (!contentType.includes('application/json')) {
                const text = await res.text()
                console.error('Non-JSON response from payment API:', text.slice(0, 200))
                throw new Error('Payment service is unavailable. Please try again later.')
            }

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Payment initiation failed')
            }

            if (data.checkout_url) {
                // Redirect user to Monime checkout page
                window.location.href = data.checkout_url
            } else {
                throw new Error('No checkout URL returned from payment provider.')
            }

        } catch (err: any) {
            console.error('Checkout error:', err)
            setError(err.message || 'An unexpected error occurred.')
            setPaying(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (selectedCourse) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <button
                    onClick={() => { setSelectedCourse(null); setError(''); }}
                    className="flex items-center text-slate-500 hover:text-[#0a1128] font-medium text-sm transition"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to courses
                </button>

                <div className="bg-white border border-border rounded-3xl overflow-hidden shadow-xl shadow-[#0a1128]/5 flex flex-col md:flex-row">
                    {/* Course Summary Side */}
                    <div className="bg-[#0a1128] text-white p-8 md:w-5/12 flex flex-col justify-between">
                        <div>
                            <p className="text-white/60 text-sm font-medium uppercase tracking-wider mb-2">Checkout</p>
                            <h2 className="text-2xl font-black mb-4">{selectedCourse.name}</h2>
                            <p className="text-white/70 text-sm">{selectedCourse.description}</p>

                            <div className="mt-8 space-y-4 text-sm text-white/80">
                                <div className="flex justify-between border-b border-white/10 pb-4">
                                    <span>Format</span>
                                    <span className="font-medium text-white">{selectedCourse.format}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-4">
                                    <span>Duration</span>
                                    <span className="font-medium text-white">{selectedCourse.duration}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <p className="text-white/60 text-sm mb-1">Total Due</p>
                            <p className="text-4xl font-black text-primary">
                                {selectedCourse.currency} {selectedCourse.price.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Payment Form Side */}
                    <div className="p-8 md:w-7/12">
                        <h3 className="font-bold text-lg text-[#0a1128] mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" /> Mobile Money Payment
                        </h3>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handlePaymentSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <Label className="text-slate-700 font-semibold">Mobile Money Provider</Label>
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setProvider('orange')}
                                        className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-medium transition ${provider === 'orange' ? 'border-[#FF7900] bg-[#FF7900]/10 text-[#FF7900]' : 'border-border text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${provider === 'orange' ? 'bg-[#FF7900]' : 'bg-slate-300'}`} />
                                        Orange Money
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setProvider('afrimoney')}
                                        className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-medium transition ${provider === 'afrimoney' ? 'border-[#E3000F] bg-[#E3000F]/10 text-[#E3000F]' : 'border-border text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${provider === 'afrimoney' ? 'bg-[#E3000F]' : 'bg-slate-300'}`} />
                                        Afrimoney
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <Label className="text-slate-700 font-semibold">Mobile Number</Label>
                                <Input
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="e.g. 076123456"
                                    required
                                    className="h-11 rounded-xl bg-slate-50"
                                />
                                <p className="text-xs text-slate-500 mt-1">Make sure this number is registered with {provider === 'orange' ? 'Orange Money' : 'Afrimoney'}.</p>
                            </div>

                            <Button
                                type="submit"
                                disabled={paying || !phone}
                                className="w-full h-12 rounded-xl bg-[#0a1128] hover:bg-[#0d1a3a] text-white text-base mt-4"
                            >
                                {paying ? (
                                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing Checkout…</>
                                ) : (
                                    <>Pay {selectedCourse.currency} {selectedCourse.price.toLocaleString()} Securely</>
                                )}
                            </Button>

                            <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center">
                                Payments powered securely by Monime
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-[#0a1128]">Course Catalog</h1>
                    <p className="text-slate-500 text-sm">{courses.length} courses immediately available</p>
                </div>
                {enrolledIds.size > 0 && (
                    <Button variant="outline" onClick={() => navigate('/student/dashboard')} className="rounded-xl border-border">
                        My Enrollments
                    </Button>
                )}
            </div>

            {courses.length === 0 ? (
                <div className="bg-white border border-border rounded-2xl p-16 text-center">
                    <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No courses are currently open for enrollment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => {
                        const isEnrolled = enrolledIds.has(course.id)

                        return (
                            <div key={course.id} className="bg-white border border-border rounded-3xl overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition flex flex-col">
                                {/* Course image or coloured header */}
                                {course.imageUrl ? (
                                    <div className="w-full h-36 overflow-hidden">
                                        <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-full h-36 bg-gradient-to-br from-[#0a1128] to-primary/60 flex items-center justify-center">
                                        <BookOpen className="w-10 h-10 text-white/60" />
                                    </div>
                                )}
                                <div className="flex-1 p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-right ml-auto">
                                            <span className="block text-xl font-black text-[#0a1128]">
                                                {course.currency} {course.price.toLocaleString()}
                                            </span>
                                            {isEnrolled && (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Enrolled
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-[#0a1128] mb-2">{course.name}</h3>
                                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                        {course.description}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <span>⏳ {course.duration}</span>
                                        <span>·</span>
                                        <span>💻 {course.format}</span>
                                    </div>

                                    {isEnrolled ? (
                                        <Button
                                            onClick={() => navigate('/student/dashboard')}
                                            className="w-full bg-slate-100 hover:bg-slate-200 text-[#0a1128] rounded-xl font-semibold h-11"
                                        >
                                            View Classroom
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => setSelectedCourse(course)}
                                            className="w-full bg-primary hover:bg-primary/90 text-[#0a1128] rounded-xl font-semibold h-11 shadow-[0_0_15px_rgba(34,197,94,0.3)] shadow-primary/30 text-white"
                                        >
                                            Apply & Pay
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
