import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Info, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"

export default function HireApplicationPage() {
    const [skills, setSkills] = useState<string[]>([])
    const [talentType, setTalentType] = useState("")
    const [referral, setReferral] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        industry: "",
        count: "",
        responsibilities: "",
    })

    const toggleSkill = (skill: string) => {
        setSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        )
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!form.firstName || !form.lastName || !form.email || !form.company) {
            toast.error("Please fill in all required fields.")
            return
        }
        if (skills.length === 0) {
            toast.error("Please select at least one skill.")
            return
        }
        if (!talentType) {
            toast.error("Please select the type of talent you are looking for.")
            return
        }

        setSubmitting(true)
        try {
            await addDoc(collection(db, "hire_requests"), {
                firstName: form.firstName,
                lastName: form.lastName,
                fullName: `${form.firstName} ${form.lastName}`,
                email: form.email,
                phone: form.phone,
                company: form.company,
                industry: form.industry,
                talentType,
                skills,
                count: form.count,
                responsibilities: form.responsibilities,
                referral,
                status: "new",
                createdAt: serverTimestamp(),
            })
            setSubmitted(true)
        } catch (error) {
            console.error("Error submitting hire request:", error)
            toast.error("Failed to submit your request. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-white text-navy flex items-center justify-center px-6">
                <div className="text-center max-w-lg animate-in fade-in duration-700">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tighter mb-3 sm:mb-4">Request Submitted!</h2>
                    <p className="text-slate-500 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                        Thank you for your interest in hiring DSSL graduates. Our team will review your request and get back to you within <strong>2 business days</strong>.
                    </p>
                    <Button
                        onClick={() => window.location.href = "/hire"}
                        className="h-12 sm:h-14 rounded-full bg-navy text-white px-8 sm:px-10 font-bold text-base sm:text-lg"
                    >
                        Back to Hire Page
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white text-navy">
            {/* Hero Section */}
            <section className="relative h-[45vh] sm:h-[50vh] lg:h-[60vh] w-full overflow-hidden">
                <img
                    src="/data-analytics.jpg"
                    alt="DSSL Students"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-navy/60" />

                <div className="absolute bottom-10 sm:bottom-16 lg:bottom-20 left-0 right-0 px-4 sm:px-6 lg:px-12">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter uppercase animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            Hiring Application
                        </h1>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-10 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <form className="space-y-6 sm:space-y-10" onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
                            <div className="space-y-3">
                                <Label htmlFor="first-name" className="text-xs sm:text-sm font-bold flex items-center gap-1 text-navy uppercase tracking-wider">
                                    First Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="first-name"
                                    placeholder="Enter Your First Name"
                                    className="h-12 sm:h-14 bg-white border-slate-200 text-navy placeholder:text-slate-400 rounded-lg px-4 sm:px-6 text-sm sm:text-base focus:border-primary transition-all ring-0"
                                    required
                                    value={form.firstName}
                                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="last-name" className="text-xs sm:text-sm font-bold flex items-center gap-1 text-navy uppercase tracking-wider">
                                    Last Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="last-name"
                                    placeholder="Enter Your Last Name"
                                    className="h-14 bg-white border-slate-200 text-navy placeholder:text-slate-400 rounded-lg px-6 focus:border-primary transition-all ring-0"
                                    required
                                    value={form.lastName}
                                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="company-email" className="text-xs sm:text-sm font-bold flex items-center gap-1 text-navy uppercase tracking-wider">
                                Company Email <span className="text-red-500">*</span>
                                <Info className="w-3.5 h-3.5 text-primary/60 ml-1" />
                            </Label>
                            <Input
                                id="company-email"
                                type="email"
                                placeholder="Enter Your Company Email Address"
                                className="h-14 bg-white border-slate-200 text-navy placeholder:text-slate-400 rounded-lg px-6 focus:border-primary transition-all ring-0"
                                required
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="phone" className="text-xs sm:text-sm font-bold flex items-center gap-1 text-navy uppercase tracking-wider">
                                Phone/Mobile <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="phone"
                                placeholder="Enter Your Contact Number"
                                className="h-14 bg-white border-slate-200 text-navy placeholder:text-slate-400 rounded-lg px-6 focus:border-primary transition-all ring-0"
                                required
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="company-name" className="text-xs sm:text-sm font-bold flex items-center gap-1 text-navy uppercase tracking-wider">
                                Company/Organization Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="company-name"
                                placeholder="Which company are you working with?"
                                className="h-14 bg-white border-slate-200 text-navy placeholder:text-slate-400 rounded-lg px-6 focus:border-primary transition-all ring-0"
                                required
                                value={form.company}
                                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="industry" className="text-xs sm:text-sm font-bold flex items-center gap-1 text-navy uppercase tracking-wider">
                                Industry or Sector <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="industry"
                                placeholder="Which industry or sector does your company work in?"
                                className="h-14 bg-white border-slate-200 text-navy placeholder:text-slate-400 rounded-lg px-6 focus:border-primary transition-all ring-0"
                                required
                                value={form.industry}
                                onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs sm:text-sm font-bold flex items-center gap-1 text-navy uppercase tracking-wider">
                                Talent Requirement <span className="text-red-500">*</span>
                            </Label>
                            <Select value={talentType} onValueChange={setTalentType}>
                                <SelectTrigger className="h-14 bg-white border-slate-200 text-slate-500 px-6 rounded-lg focus:ring-0 focus:border-primary">
                                    <SelectValue placeholder="- Select -" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-navy">
                                    <SelectItem value="data-analyst">Data Analyst</SelectItem>
                                    <SelectItem value="data-scientist">Data Scientist</SelectItem>
                                    <SelectItem value="data-engineer">Data Engineer</SelectItem>
                                    <SelectItem value="ai-specialist">AI Specialist</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-5">
                            <Label className="text-xs sm:text-sm font-bold flex items-center gap-1 text-navy uppercase tracking-wider">
                                Skills Required <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {["Artificial Intelligence", "Data Analytics", "Data Engineering", "Data Science", "Digital Marketing", "Other"].map((skill) => (
                                    <div key={skill} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleSkill(skill)}>
                                        <div className={cn("w-5 h-5 border-2 rounded flex items-center justify-center transition-all", skills.includes(skill) ? "bg-primary border-primary" : "border-slate-200 group-hover:border-primary")}>
                                            {skills.includes(skill) && (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-slate-600 text-sm font-medium">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="count" className="text-xs sm:text-sm font-bold flex items-center gap-1 text-navy uppercase tracking-wider">
                                Professionals Count <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="count"
                                placeholder="How many professional(s) are you looking for?"
                                className="h-14 bg-white border-slate-200 text-navy placeholder:text-slate-400 rounded-lg px-6 focus:border-primary transition-all ring-0"
                                required
                                value={form.count}
                                onChange={e => setForm(f => ({ ...f, count: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="responsibilities" className="text-xs sm:text-sm font-bold flex items-center gap-1 text-navy uppercase tracking-wider">
                                Responsibilities Overview <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="responsibilities"
                                placeholder="What are the professional(s) required to do"
                                className="min-h-[150px] bg-white border-slate-200 text-navy placeholder:text-slate-400 rounded-lg px-6 py-4 focus:border-primary transition-all ring-0 resize-none"
                                required
                                value={form.responsibilities}
                                onChange={e => setForm(f => ({ ...f, responsibilities: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs sm:text-sm font-bold flex items-center gap-1 text-navy uppercase tracking-wider">
                                Discovery Channel <span className="text-red-500">*</span>
                            </Label>
                            <Select value={referral} onValueChange={setReferral}>
                                <SelectTrigger className="h-14 bg-white border-slate-200 text-slate-500 px-6 rounded-lg focus:ring-0 focus:border-primary">
                                    <SelectValue placeholder="- Select -" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-navy">
                                    <SelectItem value="social-media">Social Media</SelectItem>
                                    <SelectItem value="word-of-mouth">Word of Mouth</SelectItem>
                                    <SelectItem value="event">Event</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-6 sm:pt-10">
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-12 sm:h-14 lg:h-16 bg-primary hover:bg-primary/95 text-white font-black text-base sm:text-lg lg:text-xl rounded-full shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] tracking-tight uppercase"
                            >
                                {submitting ? (
                                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting Request...</>
                                ) : "Submit Application"}
                            </Button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    )
}
