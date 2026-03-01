import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, ChevronRight, BookOpen, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams()
    const transactionId = searchParams.get('transaction_id')
    const courseId = searchParams.get('course_id')

    const courseName = courseId
        ? courseId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : null

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-white to-[#e8f5e9] flex flex-col items-center justify-center p-4">
            {/* Confetti-style decorative dots */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-[15%] w-3 h-3 bg-blue-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="absolute top-32 right-[20%] w-2 h-2 bg-green-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="absolute top-48 left-[35%] w-2 h-2 bg-yellow-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.4s' }} />
                <div className="absolute bottom-32 right-[15%] w-3 h-3 bg-purple-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="absolute bottom-48 left-[20%] w-2 h-2 bg-pink-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 max-w-md w-full text-center shadow-2xl shadow-green-500/10 overflow-hidden animate-in fade-in zoom-in duration-500">
                {/* Green header band */}
                <div className="bg-gradient-to-r from-[#0B3C6F] to-[#2D7FF9] px-8 pt-12 pb-16 relative">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white/30">
                            <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-1 tracking-tight">Enrolled!</h1>
                        <p className="text-white/70 text-sm font-medium">Your payment was successful 🎉</p>
                    </div>
                </div>

                {/* White card content */}
                <div className="px-8 pb-8 -mt-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6 text-left space-y-3">
                        {courseName && (
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                    <BookOpen className="w-5 h-5 text-[#2D7FF9]" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Course Enrolled</p>
                                    <p className="font-black text-slate-900 text-sm">{courseName}</p>
                                </div>
                            </div>
                        )}
                        {transactionId && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-medium">Transaction ID</span>
                                <span className="font-mono text-slate-700 font-semibold text-xs bg-slate-50 px-2 py-1 rounded-lg">{transactionId}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 font-medium">Status</span>
                            <span className="text-green-600 font-bold flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                                Confirmed
                            </span>
                        </div>
                    </div>

                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Welcome to the course! Access your learning materials and track your progress from your student dashboard.
                    </p>

                    <div className="space-y-3">
                        <Button asChild className="w-full bg-[#0B3C6F] hover:bg-[#0B3C6F]/90 text-white rounded-xl h-13 text-base font-bold shadow-lg shadow-blue-900/20 hover:scale-[1.02] transition-all active:scale-[0.98]">
                            <Link to="/student/dashboard" className="flex items-center justify-center gap-2 py-3">
                                Go to My Dashboard <ChevronRight className="w-4 h-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full text-slate-500 hover:text-slate-800 rounded-xl h-11 text-sm font-medium">
                            <Link to="/">Back to Home</Link>
                        </Button>
                    </div>
                </div>
            </div>

            <p className="mt-6 text-slate-400 text-xs text-center">
                Questions? Contact us at{' '}
                <a href="mailto:support@dssl.edu.sl" className="text-[#2D7FF9] underline underline-offset-2">
                    support@dssl.edu.sl
                </a>
            </p>
        </div>
    )
}
