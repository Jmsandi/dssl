import { Link, useSearchParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PaymentError() {
    const [searchParams] = useSearchParams()
    const reason = searchParams.get('reason')

    const getErrorMessage = () => {
        switch (reason) {
            case 'not_found': return 'We could not find the payment record for this transaction.'
            case 'server_error': return 'An internal server error occurred while processing your callback.'
            default: return 'An unknown error occurred while verifying your payment.'
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl border border-border max-w-md w-full text-center shadow-xl shadow-yellow-500/5">
                <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-yellow-600" />
                </div>

                <h1 className="text-3xl font-black text-[#0a1128] mb-2">Payment Error</h1>
                <p className="text-slate-500 mb-2">
                    Something went wrong while confirming your payment.
                </p>
                <p className="text-sm font-medium text-yellow-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-8 mt-4">
                    {getErrorMessage()}
                </p>

                <p className="text-slate-400 text-xs mb-8">
                    If you were charged, please contact support and provide your phone number so we can manually verify the transaction.
                </p>

                <Button asChild className="w-full bg-[#0a1128] hover:bg-[#0d1a3a] text-white rounded-xl h-12 text-base">
                    <Link to="/student/dashboard">
                        Return to Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    )
}
