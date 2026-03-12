import { useState, Suspense, FormEvent, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Wallet, Loader2, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface CourseData {
    id: string
    title: string
    description: string
    image: string
    price: number | string
    currency: string
    slug: string
}

function PaymentContent() {
    const [searchParams] = useSearchParams()
    const programSlug = searchParams.get("program") || "data-analytics"

    const [course, setCourse] = useState<CourseData | null>(null)
    const [loadingCourse, setLoadingCourse] = useState(true)

    // Fetch dynamic course from Firestore
    useEffect(() => {
        let mounted = true;

        const fetchCourse = async () => {
            try {
                // First, try to find by slug field
                const q = query(collection(db, "courses"), where("slug", "==", programSlug))
                const querySnapshot = await getDocs(q)

                if (!mounted) return;

                let courseDoc = querySnapshot.empty ? null : querySnapshot.docs[0];

                // If not found by slug, try fetching directly by document ID
                // (this happens when a course has no slug, and we use doc.id as the URL param)
                if (!courseDoc) {
                    const directRef = doc(db, "courses", programSlug)
                    const directSnap = await getDoc(directRef)
                    if (!mounted) return;
                    if (directSnap.exists()) {
                        courseDoc = directSnap as any;
                    }
                }

                if (courseDoc) {
                    const data = courseDoc.data()

                    // Standard fallback images for premium look based on slug
                    let defaultImg = "/data-analytics.jpg"
                    if (data?.slug === "data-science") defaultImg = "/data-science.jpg"
                    if (data?.slug === "data-engineering") defaultImg = "/data-engineering.jpg"

                    setCourse({
                        id: courseDoc.id,
                        title: data?.name,
                        description: data?.description || "Premium professional certification course.",
                        image: data?.imageUrl || defaultImg,
                        price: data?.price ?? 0,
                        currency: data?.currency || "SLE",
                        slug: data?.slug || programSlug
                    })
                } else {
                    // Fallback to error state if not found
                    setCourse({
                        id: "not_found",
                        title: "Course Unavailable",
                        description: "The course you are trying to enroll in could not be found or is no longer active.",
                        image: "/data-analytics.jpg",
                        price: 0,
                        currency: "SLE",
                        slug: programSlug
                    })
                }
            } catch (error: any) {
                if (!mounted) return;
                // Ignore benign abort errors caused by React Strict Mode or fast navigation
                if (
                    error?.name === 'AbortError' ||
                    error?.code === 'aborted' ||
                    error?.message?.toLowerCase().includes('aborted')
                ) {
                    return;
                }
                console.error("Error fetching course:", error)
            } finally {
                if (mounted) {
                    setLoadingCourse(false)
                }
            }
        }

        fetchCourse()

        return () => {
            mounted = false;
        }
    }, [programSlug])

    const { user, profile, signUp, signIn } = useAuth()

    // Calculate numeric price for display and payload
    let numericPrice = 0;
    if (course && course.id !== "not_found") {
        if (typeof course.price === 'string') {
            numericPrice = parseInt(course.price.replace(/[^\d]/g, ''), 10)
        } else {
            numericPrice = course.price;
        }
    }

    // Auth State
    const [isLoginMode, setIsLoginMode] = useState(false)
    const [authLoading, setAuthLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Formatted price for display
    const displayPrice = course ? `${course.currency} ${numericPrice.toLocaleString()}` : "SLE 0"

    // Payment State
    const [phone, setPhone] = useState("")
    const [provider, setProvider] = useState("orange")
    const [isPaying, setIsPaying] = useState(false)

    const handleAuth = async (e: FormEvent) => {
        e.preventDefault()
        setAuthLoading(true)
        try {
            if (isLoginMode) {
                await signIn(email, password)
                toast.success("Successfully logged in!")
            } else {
                if (!name) throw new Error("Name is required")
                await signUp({
                    email,
                    password,
                    name,
                    phone: phone || "",
                    program: programSlug,
                })
                toast.success("Account created successfully. You can now checkout.")
            }
        } catch (err: any) {
            toast.error(err.message || "Authentication failed")
        } finally {
            setAuthLoading(false)
        }
    }

    const handlePayment = async () => {
        if (!user || !profile) {
            toast.error("Please log in to continue")
            return
        }
        if (!phone) {
            toast.error("Please enter a mobile money number")
            return
        }
        if (!course || course.id === "not_found") {
            toast.error("Invalid course selected")
            return
        }

        setIsPaying(true)
        try {
            const functionsUrl = import.meta.env.VITE_FUNCTIONS_URL
            const res = await fetch(`${functionsUrl}/coursePayment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    student_id: user.uid,
                    student_name: profile.name,
                    student_email: profile.email,
                    course_id: course.id, // Use real Firestore course internal ID
                    course_name: course.title,
                    amount: numericPrice,
                    currency: course.currency || "SLE",
                    phone_number: phone,
                    provider: provider
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Payment initiation failed")

            if (data.checkout_url) {
                // Redirect user to Monime checkout
                window.location.href = data.checkout_url
            } else {
                toast.error("Invalid response from server. Missing checkout URL.")
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to start payment")
            console.error("Payment error:", err)
        } finally {
            setIsPaying(false)
        }
    }

    if (loadingCourse) {
        return (
            <div className="max-w-7xl mx-auto h-[600px] flex items-center justify-center">
                <div className="flex flex-col items-center text-slate-400 gap-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="font-semibold uppercase tracking-widest text-sm">Loading Order Details...</p>
                </div>
            </div>
        )
    }

    if (!course) return null;

    return (
        <div className="max-w-7xl mx-auto h-full px-4 md:px-8 py-6 sm:py-10 lg:py-16 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-[850px] rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-white border border-slate-100">
                {/* Left Column: Transaction & Course Info (Dark) */}
                <div className="w-full lg:w-[48%] bg-[#0a1128] text-white p-6 sm:p-8 md:p-12 xl:p-16 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-[120px]" />
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary rounded-full blur-[120px]" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-8 sm:mb-10 text-center lg:text-left">
                            <h2 className="text-xl sm:text-2xl lg:text-4xl font-black text-white mb-2 tracking-tighter uppercase">Order Details</h2>
                            <p className="text-slate-400 text-base sm:text-lg leading-snug">Review your enrollment and complete payment via Monime.</p>
                        </div>

                        {/* Course Summary */}
                        <div className="mb-8 sm:mb-10 flex items-start gap-4 sm:gap-6 bg-white/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5">
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 shrink-0">
                                <img src={course.image} alt={course.title} className="absolute inset-0 h-full w-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <span className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1 block">Course Selection</span>
                                <h3 className="text-lg sm:text-2xl font-black tracking-tight mb-1 sm:mb-2 leading-tight">{course.title}</h3>
                                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2">{course.description}</p>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="flex-1 space-y-4 sm:space-y-6 bg-white/5 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-white/5 backdrop-blur-xl flex flex-col justify-center">
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="w-5 h-5 text-primary shrink-0" />
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/80 whitespace-normal">Monime Mobile Payment</Label>
                                    </div>
                                    <span className="text-xs font-black text-white px-3 py-1 bg-white/10 w-fit rounded-full border border-white/10 uppercase tracking-tighter self-start sm:self-auto">{displayPrice}</span>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block pb-1">Mobile Provider</Label>
                                    <select
                                        value={provider}
                                        onChange={(e) => setProvider(e.target.value)}
                                        disabled={!user}
                                        className="w-full h-12 sm:h-14 bg-white/5 border border-white/10 text-white rounded-xl px-4 sm:px-6 focus:bg-white/10 transition-all focus:border-primary font-mono text-base sm:text-lg appearance-none cursor-pointer disabled:opacity-50"
                                    >
                                        <option value="orange" className="text-black bg-white">Orange Money</option>
                                        <option value="afrimoney" className="text-black bg-white">Afrimoney</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pay-phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 block pb-1">Mobile Number</Label>
                                    <div className="flex gap-2 sm:gap-3">
                                        <div className="h-12 sm:h-14 px-4 sm:px-5 bg-white/5 border border-white/10 rounded-xl flex items-center font-black text-slate-300 text-sm sm:text-base">+232</div>
                                        <Input
                                            id="pay-phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            disabled={!user}
                                            placeholder="76 000 000"
                                            className="h-12 sm:h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl px-4 sm:px-6 focus:bg-white/10 transition-all ring-0 border focus:border-primary flex-1 font-mono text-base sm:text-lg disabled:opacity-50"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block pb-1">Total Amount (SLE)</Label>
                                    <div className="relative">
                                        <Input
                                            readOnly
                                            value={numericPrice}
                                            className="h-12 sm:h-14 bg-white/5 border-white/10 text-white rounded-xl px-4 sm:px-6 font-mono text-base sm:text-lg cursor-not-allowed opacity-80"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs uppercase tracking-widest">SLE</div>
                                    </div>
                                </div>

                            </div>

                            <div className="pt-6 border-t border-white/5 mt-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                                    <p className="text-[9px] text-slate-500 font-medium sm:whitespace-nowrap uppercase tracking-wider">SECURE TRANSACTION VIA MONIME</p>
                                    <div className="hidden sm:block h-px bg-white/10 flex-1" />
                                    <span className="text-sm font-black text-primary underline underline-offset-4 decoration-primary/30 uppercase tracking-tighter self-start sm:self-auto">TOTAL: {displayPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Signup / Checkout Auth */}
                <div className="w-full lg:w-[52%] bg-white p-6 sm:p-8 md:p-12 xl:p-16 flex flex-col relative">
                    <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">

                        {user ? (
                            // ALREADY LOGGED IN
                            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-100">
                                    <CheckCircle2 className="w-12 h-12 text-[#2D7FF9]" />
                                </div>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Ready to Checkout</h2>
                                    <p className="text-slate-500 text-base sm:text-lg leading-snug">You are securely logged in and ready to enroll.</p>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Enrolling As</p>
                                    <p className="text-xl font-black text-slate-900">{profile?.name || "Student"}</p>
                                    <p className="text-slate-500 text-sm font-medium">{profile?.email}</p>
                                </div>

                                <p className="text-slate-500 text-sm">Please ensure you've selected your mobile money provider and entered your phone number on the left before proceeding to the Monime payment gateway.</p>

                                <Button
                                    onClick={handlePayment}
                                    disabled={isPaying || !phone}
                                    className="w-full h-14 sm:h-16 bg-[#0a1128] hover:bg-[#0a1128]/90 text-white font-black text-lg sm:text-xl rounded-2xl shadow-xl shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {isPaying ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mx-auto" /> : "Proceed to Payment"}
                                </Button>
                            </div>
                        ) : (
                            // NOT LOGGED IN - SHOW AUTH FORM
                            <div className="animate-in fade-in duration-500">
                                <div className="mb-8 sm:mb-10 text-center lg:text-left">
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">
                                        {isLoginMode ? "Welcome Back" : "Enter Details"}
                                    </h2>
                                    <p className="text-slate-500 text-base sm:text-lg leading-snug">
                                        {isLoginMode ? "Sign in to complete your enrollment." : "Create an account to track your courses and progress."}
                                    </p>
                                </div>

                                <form onSubmit={handleAuth} className="space-y-5">
                                    {!isLoginMode && (
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-slate-700 font-bold text-sm">Full Name <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="John Doe"
                                                className="h-12 sm:h-14 bg-slate-50 border-slate-200 text-slate-900 rounded-xl px-4 sm:px-6 focus:bg-white transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                                                required={!isLoginMode}
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-700 font-bold text-sm">Email Address <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="john@example.com"
                                            className="h-12 sm:h-14 bg-slate-50 border-slate-200 text-slate-900 rounded-xl px-4 sm:px-6 focus:bg-white transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-slate-700 font-bold text-sm">Password <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="h-12 sm:h-14 bg-slate-50 border-slate-200 text-slate-900 rounded-xl px-4 sm:px-6 focus:bg-white transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            disabled={authLoading}
                                            className="w-full h-14 sm:h-16 bg-[#0a1128] hover:bg-[#0a1128]/90 text-white font-black text-lg sm:text-xl rounded-2xl shadow-xl shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                                        >
                                            {authLoading ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mx-auto" /> : (isLoginMode ? "Sign In" : "Create Account")}
                                        </Button>

                                        <div className="mt-8 text-center">
                                            <button
                                                type="button"
                                                onClick={() => setIsLoginMode(!isLoginMode)}
                                                className="text-slate-500 hover:text-[#0a1128] font-bold text-xs uppercase tracking-widest underline underline-offset-4 decoration-slate-200"
                                            >
                                                {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function PaymentPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <main className="flex-1 pt-24 lg:pt-32 pb-16">
                <Suspense fallback={<div className="flex items-center justify-center p-20 animate-pulse text-slate-400 font-semibold tracking-wider uppercase text-sm">Loading checkout...</div>}>
                    <PaymentContent />
                </Suspense>
            </main>
        </div>
    )
}
