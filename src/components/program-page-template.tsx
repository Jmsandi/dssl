import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowRight, Smartphone, Landmark, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { WaitlistForm } from "./waitlist-form"

export interface ProgramModule {
  title: string
  weeks?: string
  outcomes: string[]
  topics: string[]
}

export interface ProgramData {
  title: string
  duration: string
  format: string
  price: string
  description: string
  heroImage: string
  introImages: string[]
  eligibility: string[]
  jobRoles: string[]
  admissionSteps: {
    title: string
    description: string
  }[]
  whoItsFor: string
  whatYouLearn: string
  careerOutcomes: string
  tools: string[]
  modules: ProgramModule[]
  capstone: {
    description: string
    tools: string[]
    deliverables: string[]
  }
  jobTitles: string[]
  slug: string
}

export function ProgramPageTemplate({ program }: { program: ProgramData }) {
  const { user, profile } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [enrollmentStep, setEnrollmentStep] = useState<"auth" | "payment" | "success">("auth")
  const [paymentMethod, setPaymentMethod] = useState<"orange" | "africell" | "bank">("orange")
  const [isProcessing, setIsProcessing] = useState(false)

  // Auth Form State
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" })

  const navigate = useNavigate()

  const handleApply = () => {
    navigate(`/payment?program=${program.slug}`)
  }

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect user to the student login/register portal
    setShowAuthModal(false)
    setShowPaymentModal(true)
    setEnrollmentStep('payment')
  }

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setEnrollmentStep("success")
    }, 2000)
  }

  const handleDownload = () => {
    // Basic curriculum print/download logic
    const printContent = `
      <h1>${program.title} - Curriculum</h1>
      <p>${program.description}</p>
      
      <h2>Tools</h2>
      <ul>${program.tools.map(tool => `<li>${tool}</li>`).join('')}</ul>
      
      <h2>Modules</h2>
      ${program.modules.map(mod => `
        <div style="margin-bottom: 20px;">
          <h3>${mod.title}</h3>
          <p><strong>Outcomes:</strong> ${mod.outcomes.join(', ')}</p>
          <p><strong>Topics:</strong> ${mod.topics.join(', ')}</p>
        </div>
      `).join('')}

      <h2>Capstone</h2>
      <p>${program.capstone.description}</p>
      <p><strong>Deliverables:</strong> ${program.capstone.deliverables.join(', ')}</p>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${program.title} Curriculum</title>
            <style>
              body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
              h1 { color: #0a1128; }
              h2 { color: #0a1128; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 30px; }
              h3 { color: #800020; }
              ul { padding-left: 20px; }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }

  return (
    <div className="flex flex-col">
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] bg-white p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#0a1128]">Join the Fellowship</DialogTitle>
            <DialogDescription className="text-slate-500">
              Create an account to apply for the {program.title}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAuthSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
                className="rounded-xl border-slate-200"
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                className="rounded-xl border-slate-200"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="rounded-xl border-slate-200"
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-primary text-white rounded-full font-bold mt-4 shadow-xl shadow-primary/20">
              Continue to Application
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] bg-white p-0 overflow-hidden border-none shadow-2xl">
          {enrollmentStep === "payment" ? (
            <div className="flex flex-col">
              <div className="bg-[#0a1128] p-8 text-white">
                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Enrollment Final Step</p>
                <DialogTitle className="text-3xl font-bold">{program.title}</DialogTitle>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-black">NLe {program.price}</span>
                  <span className="text-white/60 text-sm">Full Program Fee</span>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Select Payment Method</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod("orange")}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                        paymentMethod === "orange" ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <Smartphone className={cn("h-6 w-6", paymentMethod === "orange" ? "text-primary" : "text-slate-400")} />
                      <span className="text-[10px] font-bold uppercase">Orange Money</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("africell")}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                        paymentMethod === "africell" ? "border-red-500 bg-red-50" : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <Smartphone className={cn("h-6 w-6", paymentMethod === "africell" ? "text-red-500" : "text-slate-400")} />
                      <span className="text-[10px] font-bold uppercase">Africell Money</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("bank")}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                        paymentMethod === "bank" ? "border-slate-800 bg-slate-50" : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <Landmark className={cn("h-6 w-6", paymentMethod === "bank" ? "text-slate-800" : "text-slate-400")} />
                      <span className="text-[10px] font-bold uppercase">Bank Transfer</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Phone Number (Mobile Money)</Label>
                    <Input placeholder="076 000 000" className="h-12 rounded-xl bg-slate-50 border-slate-100" />
                  </div>
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full h-14 bg-[#E31E24] hover:bg-[#C1191F] text-white rounded-full font-bold text-lg shadow-xl shadow-red-500/20"
                  >
                    {isProcessing ? "Processing..." : `Pay NLe ${program.price} Now`}
                  </Button>
                  <p className="text-center text-slate-400 text-xs mt-4">
                    Secure and encrypted payment processing.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <Check className="h-10 w-10 font-black" />
              </div>
              <h2 className="text-3xl font-bold text-[#0a1128] mb-4">Enrollment Successful!</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Welcome to the DSSL Fellowship, <span className="text-primary font-bold">{profile?.name ?? user?.email}</span>!<br />
                We&apos;ve sent the next steps and program details to your email.
              </p>
              <Button
                onClick={() => setShowPaymentModal(false)}
                className="w-full h-14 bg-primary text-white rounded-full font-bold text-lg"
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Immersive Hero */}
      <section className="relative h-[70vh] mx-auto min-h-[600px] w-full items-end flex pb-20 overflow-hidden">
        <img
          src={program.heroImage}
          alt={program.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/80 to-transparent"></div>
        <div className="container relative z-10 px-6 lg:px-10 mx-auto">
          <h1 className="font-heading text-3xl font-black text-white sm:text-5xl md:text-7xl lg:text-7xl tracking-tighter">
            <span className="text-balance">{program.title}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium text-white/80 leading-relaxed sm:text-xl md:text-xl">
            {program.description}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Button
              onClick={handleApply}
              size="lg"
              className="w-full sm:w-auto h-14 px-10 bg-primary/90 text-white shadow-2xl shadow-primary/30 hover:bg-primary/90 rounded-full font-black text-lg transition-transform hover:scale-105"
            >
              Apply Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4 text-white/60">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Duration</span>
                <span className="text-sm font-medium text-white">{program.duration}</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Format</span>
                <span className="text-sm font-medium text-white">{program.format}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview & Eligibility */}
      <section className="bg-white py-24 mx-auto">
        <div className="container px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-12 items-start">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <h2 className="font-heading text-4xl font-bold text-[#0a1128] mb-8">Course Overview</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-12">
                {program.description} This program is designed to transform your career through intensive hands-on training and real-world project experience.
              </p>

              <div className="relative mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
                  <img src={program.introImages[0]} alt="Training" className="h-full w-full object-cover" />
                </div>
                <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl ">
                  <img src={program.introImages[1]} alt="Collaboration" className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Button size="lg" onClick={handleDownload} className="w-full sm:w-auto h-12 px-10 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold border-none hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                  Download Curriculum
                </Button>
                <Link to="/waitlist" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-12 px-10 rounded-full bg-gradient-to-r from-secondary to-primary text-white font-bold border-none hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                    Join Our Waitlist
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Eligibility Card */}
            <div className="lg:col-span-5">
              <div className="rounded-[2.5rem] bg-[#0c1633] p-8 text-white shadow-2xl shadow-blue-900/20">
                <h3 className="text-2xl font-bold mb-8">Program Eligibility</h3>
                <ul className="space-y-6">
                  {program.eligibility.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-white/80 font-medium leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-12 pt-10 border-t border-white/10">
                  <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Program Tuition</p>
                  <p className="text-4xl font-black">NLe {program.price}</p>
                  <p className="text-white/40 text-sm mt-1">Limited spots available for the next cohort.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-24 w-full mx-auto">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="font-heading text-4xl font-bold text-[#0a1128] mb-16">Testimonials</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:max-w-8xl mx-auto">
            <div className="overflow-hidden bg-white shadow-xl relative aspect-video">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Fellow Testimonial 1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="overflow-hidden bg-white shadow-xl relative aspect-video">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Fellow Testimonial 2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Job Opportunities */}
      <section className="bg-white py-16 overflow-hidden mx-auto">
        <div className="container px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div>
              <h2 className="font-heading text-4xl font-bold text-[#0a1128] mb-6">Job Opportunities</h2>
              <p className="text-slate-500 mb-10 text-lg">
                Job opportunities you can apply for at the end of the training includes:
              </p>
              <ul className="space-y-4">
                {program.jobRoles.map((role, idx) => (
                  <li key={idx} className="flex items-center gap-4 py-2 border-b border-black/15 last:border-0 group">
                    <div className="h-5 w-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 group-hover:border-primary transition-colors">
                      <div className="h-2 w-2 rounded-full bg-primary opacity-0 group-hover:opacity-100" />
                    </div>
                    <span className="text-slate-700 font-medium">{role}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[3rem] overflow-hidden shadow-2xl h-[500px]">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="Work" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Admission Process - Signature Gradient */}
      <section className="bg-gradient-to-r from-[#0c1633] to-secondary/85 py-10 text-white w-full">
        <div className="container px-6 lg:px-16 mx-auto max-w-8xl">
          <h2 className="font-heading text-4xl font-bold mb-16">Our Admission Process</h2>
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <Accordion type="single" collapsible className="space-y-2">
                {program.admissionSteps.map((step, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`step-${idx}`}
                    className="border-none bg-white/5 rounded-2xl px-6 py-2 overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <span className="text-lg font-bold">{step.title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-white/70 leading-relaxed pb-6">
                      {step.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div className="overflow-hidden bg-black/20 shadow-2xl relative aspect-video rounded-[2.5rem] border border-white/10">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Meet our Fellows"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-white py-24 w-full">
        <div className="container px-6 lg:px-16 mx-auto max-w-8xl text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
          <h2 className="font-heading text-3xl md:text-3xl font-semibold text-[#0a1128] max-w-xl leading">
            Want to learn more about our training programs?
          </h2>
          <div className="flex flex-col sm:flex-row items-center">
            <Button size="lg" className="h-16 px-10 rounded-full bg-[#0a1128] hover:bg-[#800020] text-white font-black text-xl shadow-2xl transition-all">
              Get in Touch
            </Button>
            <a href="#" className="h-12 w-12 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.996-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.133c1.53.907 3.275 1.386 5.051 1.388 5.485.002 9.947-4.461 9.949-9.946.001-2.657-1.034-5.155-2.913-7.034-1.878-1.878-4.377-2.912-7.034-2.913-5.487 0-9.95 1.463-9.952 9.95-.001 1.75.459 3.456 1.332 4.978l-1.011 3.693 3.782-.992zm11.756-7.14c-.273-.137-1.62-.8-1.87-.891-.249-.091-.433-.137-.617.137-.184.274-.71.891-.871 1.073-.16.183-.321.206-.594.069-.273-.137-1.15-.424-2.19-1.354-.809-.722-1.354-1.614-1.512-1.888-.158-.273-.017-.421.12-.558.123-.122.273-.32.41-.481.137-.16.183-.274.274-.457.091-.183.046-.343-.023-.48-.068-.137-.617-1.486-.845-2.035-.221-.532-.465-.459-.617-.467-.159-.008-.341-.01-.523-.01s-.48.069-.731.343c-.251.274-.961.938-.961 2.287 0 1.35.982 2.651 1.119 2.835.137.183 1.933 2.951 4.682 4.142.654.282 1.164.451 1.562.577.656.208 1.253.179 1.725.109.526-.078 1.62-.663 1.85-1.303.229-.64.229-1.189.16-1.303-.069-.114-.273-.183-.547-.32z" /></svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
