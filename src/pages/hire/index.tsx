import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

const employers = [
    { name: "Orange SL", logo: "/orange.jfif" },
    { name: "Africell", logo: "/africell.png" },
    { name: "World Bank", logo: "/world-bank.png" },
    { name: "UNDP", logo: "/undp.png" },
    { name: "UNICEF", logo: "/unicef.png" },
]

const hiringSteps = [
    { number: "1", title: "Identify Talent Needs", description: "Partner with DSSL to define the technical requirements and role specificities for your organization. We help you pinpoint exactly what skills will drive your data projects forward." },
    { number: "2", title: "Predictive Matching", description: "Our team utilizes data-driven insights to match our highly trained fellows with your specific organizational culture and technical needs, ensuring a high-impact fit." },
    { number: "3", title: "Shortlist & Portfolio Review", description: "Access a curated list of top-tier graduates, complete with their CVs, project portfolios, and technical assessment reports for immediate review." },
    { number: "4", title: "Collaborative Assessment", description: "Conduct direct interviews or technical assessments. DSSL provides full support to ensure a smooth evaluation process for both the employer and the candidate." },
    { number: "5", title: "Seamless Integration", description: "Select your candidate and integrate them into your team. DSSL facilitates the onboarding process to ensure a professional transition and immediate contribution to your goals." }
]

export default function HirePage() {
    return (
        <>
            <main>
                {/* Hero */}
                <section className="relative h-[70\5vh] min-h-[600px] flex items-end overflow-hidden pb-12 lg:pb-24 pt-40">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1600"
                            alt="DSSL Hiring Partnerships"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/75"></div>
                    </div>
                    <div className="container relative z-10 mx-auto px-6 lg:px-12">
                        <div className="max-w-2xl">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">For Employers</p>
                            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                Hire Our <span className="text-primary">Graduates</span>
                            </h1>
                            <p className="mt-4 text-lg text-slate-200 leading-relaxed max-w-xl">
                                Access a pipeline of trained, motivated data professionals ready to make an impact at your organization.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Why Hire */}
                <section className="bg-background overflow-hidden border-y border-border py-20 lg:py-24">
                    <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
                        <div className="grid lg:grid-cols-2 items-stretch">
                            <div className="flex flex-col justify-center py-10 lg:pr-12">
                                <h2 className="font-heading text-3xl font-bold text-foreground md:text-5xl lg:text-4xl xl:text-5xl leading-tight">
                                    Why Hire DSSL Graduates
                                </h2>
                                <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
                                    Our rigorous training program ensures that every graduate is equipped with the technical proficiency and professional mindset needed to drive value from day one.
                                </p>
                            </div>
                            <div className="relative rounded-xl min-h-[400px] lg:min-h-full overflow-hidden">
                                <img src="/b.jpg" alt="DSSL Graduates Collaboration" className="absolute inset-0 h-full w-full object-cover" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hiring Procedure */}
                <section className="bg-slate-50/50 py-20 lg:py-24">
                    <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
                        <div className="grid gap-16 lg:grid-cols-[1.5fr,1fr]">
                            <div>
                                <h2 className="font-heading text-3xl font-bold text-[#0a192f] md:text-4xl mb-10">Hiring Procedure</h2>
                                <div className="space-y-6">
                                    {hiringSteps.map((step) => (
                                        <div key={step.number} className="flex gap-6 rounded-[1.5rem] bg-white p-8 shadow-sm border border-slate-100/50 transition-all hover:shadow-md group">
                                            <div className="text-4xl font-bold text-secondary opacity-80 group-hover:opacity-100 transition-opacity pt-1">{step.number}</div>
                                            <div>
                                                <h3 className="text-xl font-bold text-[#0a1128] mb-3">{step.title}</h3>
                                                <p className="text-slate-600 leading-relaxed text-[0.95rem]">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-8 pt-20">
                                <Button asChild className="w-full h-14 rounded-full bg-gradient-to-r from-[#0a192f] via-secondary to-secondary text-lg font-bold text-white shadow-xl hover:scale-[1.02] transition-transform border-none">
                                    <Link to="/hire/application">Access Amazing Talents</Link>
                                </Button>

                                <div className="group relative aspect-video overflow-hidden rounded-2xl bg-slate-200 shadow-md">
                                    <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" alt="Training preview" className="absolute inset-0 h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <div className="h-12 w-16 bg-[#FF0000] rounded-xl flex items-center justify-center text-white border-2 border-white/20 transition-transform group-hover:scale-110">
                                            <Play className="h-7 w-7 fill-current" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 left-3 text-white text-xs font-semibold drop-shadow-md">How Data Analysts are Tra...</div>
                                </div>

                                <div className="group relative aspect-video overflow-hidden rounded-2xl bg-slate-200 shadow-md">
                                    <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800" alt="Students learning" className="absolute inset-0 h-full w-full object-cover" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-white text-[0.9rem] font-bold leading-tight">Our Partners: Reaping Talent Rewards</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-slate-700 italic text-[0.9rem] leading-relaxed font-medium">
                                        "The #1 benefit of becoming a DSSL partner? Preferred access to the most driven data talents in the region, ready to fuel your company's sustainable innovation."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Where Our Graduates Work */}
                <section className="bg-white py-20 lg:py-24 border-t border-slate-100">
                    <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
                        <div className="grid gap-16 lg:grid-cols-2 items-center">
                            <div className="overflow-hidden rounded-[2rem] shadow-2xl bg-slate-100">
                                <div className="relative aspect-video">
                                    <iframe className="h-full w-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Where Our Graduates Work" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <h2 className="font-heading text-3xl font-bold text-[#0a1128] md:text-4xl mb-4">Where Our Graduates Work</h2>
                                    <p className="text-lg text-slate-600 leading-relaxed">...and so many more across industries and around the world.</p>
                                </div>
                                <div className="relative overflow-hidden py-4">
                                    <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
                                        {[...employers, ...employers].map((employer, i) => (
                                            <div key={`${employer.name}-${i}`} className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                                <span className="text-lg font-bold text-slate-400 px-4">{employer.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Join Us CTA */}
                <section className="relative py-32 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" alt="Join DSSL in transforming talent" className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/70" />
                    </div>
                    <div className="container relative z-10 mx-auto px-6 lg:px-12 text-center">
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">Join Us in Transforming Africa's Tech Talent</h2>
                        <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">Let's talk about the opportunities we can create together!</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Button asChild className="h-14 rounded-full bg-primary/70 text-white px-8 text-lg font-bold hover:bg-primary/60 transition-all shadow-xl">
                                <Link to="/contact">Become a tech partner &rarr;</Link>
                            </Button>
                            <Button asChild className="h-14 rounded-full bg-secondary text-white px-8 text-lg font-bold hover:bg-secondary/60 transition-all shadow-xl">
                                <Link to="/contact">Mentor the next generation &rarr;</Link>
                            </Button>
                            <Button asChild className="h-14 rounded-full bg-primary/70 text-white px-8 text-lg font-bold hover:bg-primary/60 transition-all shadow-xl">
                                <Link to="/hire/application">Hire our grads &rarr;</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
