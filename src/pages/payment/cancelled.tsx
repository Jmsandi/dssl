import { Link, useSearchParams } from 'react-router-dom'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PaymentCancelled() {
    const [searchParams] = useSearchParams()
    const program = searchParams.get('program') || 'data-analytics'

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-white to-[#fff8f0] flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] border border-slate-100 max-w-md w-full text-center shadow-2xl shadow-red-500/10 overflow-hidden animate-in fade-in zoom-in duration-500">
                {/* Red/orange header band */}
                <div className="bg-gradient-to-r from-[#1a1a2e] to-[#374151] px-8 pt-12 pb-16 relative">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-400 rounded-full -translate-y-1/2 translate-x-1/2" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white/10">
                            <XCircle className="w-12 h-12 text-red-400" />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-1 tracking-tight">Cancelled</h1>
                        <p className="text-white/60 text-sm font-medium">Your payment was not completed</p>
                    </div>
                </div>

                {/* Card content */}
                <div className="px-8 pb-8 -mt-6">
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6 text-left">
                        <p className="text-orange-700 text-sm font-medium leading-relaxed">
                            ℹ️ No charges were made to your mobile money account. Your enrollment was not processed.
                        </p>
                    </div>

                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Changed your mind? You can return to the payment page and try again at anytime. Your account information is saved.
                    </p>

                    <div className="space-y-3">
                        <Button asChild className="w-full bg-[#0B3C6F] hover:bg-[#0B3C6F]/90 text-white rounded-xl text-base font-bold shadow-lg shadow-blue-900/20 hover:scale-[1.02] transition-all active:scale-[0.98]">
                            <Link to={`/payment?program=${program}`} className="flex items-center justify-center gap-2 py-3">
                                <RefreshCw className="w-4 h-4" /> Try Again
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full text-slate-500 hover:text-slate-800 rounded-xl h-11 text-sm font-medium">
                            <Link to="/student/dashboard" className="flex items-center justify-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Return to Dashboard
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <p className="mt-6 text-slate-400 text-xs text-center">
                Need help? Contact us at{' '}
                <a href="mailto:support@dssl.edu.sl" className="text-[#2D7FF9] underline underline-offset-2">
                    support@dssl.edu.sl
                </a>
            </p>
        </div>
    )
}
