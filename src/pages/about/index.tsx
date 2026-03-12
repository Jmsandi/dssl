import { Link } from "react-router-dom"
import { useState } from "react"
import { Eye, Target, ArrowRight, Play, Quote, Linkedin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const coreValues = [
    { title: "Resilience", description: "Portraying resilience in all we do makes us stronger.", image: "/bb.jfif" },
    { title: "Innovation", description: "Fostering creative problem-solving and excellence.", image: "/bbb.jfif" },
    { title: "Accessibility", description: "Ensuring every Sierra Leonean has the opportunity to lead.", image: "/bbg.jfif" },
    { title: "Integrity", description: "Upholding the highest standards of ethics and trust.", image: "/hero-bg.jpg" },
    { title: "Community", description: "Creating a supportive ecosystem for professional growth.", image: "/b.jpg" },
]

export default function AboutPage() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[400px] flex items-end overflow-hidden pb-12 lg:pb-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1600"
                        alt="DSSL Learning Environment"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/75"></div>
                </div>
                <div className="container relative z-10 mx-auto px-6 lg:px-12">
                    <div className="max-w-2xl">
                        <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            Empowering Sierra Leone's <span className="text-primary">Data Leaders</span>
                        </h1>
                        <p className="mt-4 text-lg text-slate-200 leading-relaxed">
                            Equipping the next generation with the skills to solve challenges through data science and AI.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Mission & Vision */}
            <section className="py-12 lg:py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex flex-col-reverse lg:grid gap-12 lg:gap-16 lg:grid-cols-2 items-center">
                        <div className="relative w-full aspect-video overflow-hidden rounded-3xl shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                                alt="Students collaborating at DSSL"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>
                        <div className="space-y-10">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary shadow-lg shadow-secondary/20 text-white">
                                        <Eye className="h-6 w-6" />
                                    </div>
                                    <h2 className="font-heading text-3xl font-bold text-[#0a1128]">Our Vision</h2>
                                </div>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    A Sierra Leone where data literacy powers innovation, informs decision-making, and creates economic opportunity for all.
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 text-white">
                                        <Target className="h-6 w-6" />
                                    </div>
                                    <h2 className="font-heading text-3xl font-bold text-[#0a1128]">Our Mission</h2>
                                </div>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    To equip Sierra Leoneans with practical data science and AI skills through accessible, hands-on training, building a generation of global problem-solvers.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-12 lg:py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-8">
                        <h2 className="font-heading text-2xl md:text-4xl font-semibold text-[#0a1128]">Our Core Values</h2>
                    </div>
                    <div className="flex flex-col sm:flex-row h-auto sm:h-[400px] lg:h-[700px] w-full overflow-hidden shadow-2xl border border-slate-200">
                        {coreValues.map((value, index) => (
                            <div
                                key={value.title}
                                className={cn("relative cursor-pointer transition-all duration-700 ease-in-out overflow-hidden border-none", "h-[200px] sm:h-full", expandedIndex === index ? "h-[350px] sm:flex-[4]" : "sm:flex-1")}
                                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                                onMouseEnter={() => setExpandedIndex(index)}
                                onMouseLeave={() => setExpandedIndex(null)}
                            >
                                <img src={value.image} alt={value.title} className="absolute inset-0 h-full w-full object-cover" />
                                <div className={cn("absolute inset-0 transition-opacity duration-500 bg-black/20", expandedIndex === index && "bg-black/40")} />
                                <div className={cn("absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500", expandedIndex === index ? "opacity-100" : "opacity-40")} />
                                <div className={cn("absolute bottom-0 left-0 w-full p-4 sm:p-8 text-white transition-all duration-500 delay-100", expandedIndex === index ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none")}>
                                    <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 tracking-tight">{value.title}</h3>
                                    <p className="text-sm sm:text-lg text-slate-200 max-w-lg leading-relaxed">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Section with Vision Quote */}
            <section className="py-12 lg:py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
                        <div className="overflow-hidden rounded-[2rem] shadow-2xl">
                            <div className="relative aspect-video">
                                <iframe className="h-full w-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="What is DSSL?" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                            </div>
                        </div>
                        <div className="relative p-6 sm:p-8 lg:p-12 shadow-sm">
                            <div className="absolute top-8 left-8 text-black">
                                <Quote className="h-12 w-12 fill-current" />
                            </div>
                            <div className="relative z-10 pt-12">
                                <p className="text-xl leading-relaxed">Our vision is to create a dynamic community of skilled leaders who promote progress in Sierra Leone.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The team behind it all */}
            <section className="py-12 lg:py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-4xl font-bold text-[#0a1128]">The team behind it all</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {["/bb.jfif", "/bbb.jfif", "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400", "/hero-bg.jpg", "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400", "/bbg.jfif", "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400", "/bbb.jfif"].map((image, index) => (
                            <div key={index} className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200 group">
                                <img src={image} alt={`Team member ${index + 1}`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sponsors & Partners */}
            <section className="py-10 lg:py-20 bg-white">
                <div className="container mx-auto px-6 lg:px-12 text-center">
                    <h2 className="font-heading text-4xl font-bold text-[#0a1128] mb-16">Our Sponsors & <span className="text-secondary">Partners</span></h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 items-center justify-items-center transition-all duration-500">
                        {[{ name: "Orange SL", logo: "/orange.jfif" }, { name: "Africell", logo: "/africell.png" }, { name: "World Bank", logo: "/bank.png" }, { name: "UNDP", logo: "/undp.png" }, { name: "UNICEF", logo: "/unicef.png" }].map((partner) => (
                            <div key={partner.name} className="h-12 w-32 relative">
                                <img src={partner.logo} alt={partner.name} className="h-full w-full object-contain" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Updates */}
            <section className="py-12 lg:py-24 bg-slate-50 border-t border-slate-100">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-10 sm:mb-16 lg:mb-20">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#0a1128]">Latest Updates</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {[
                            { title: "The Future of AI in West Africa", date: "Oct 24, 2023", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600", socialLink: { type: "linkedin", href: "https://linkedin.com" } },
                            { title: "Empowering Women in Tech", date: "Oct 12, 2023", image: "/hero-bg.jpg", socialLink: { type: "instagram", href: "https://instagram.com" } },
                            { title: "Data Literacy for All", date: "Sep 28, 2023", image: "/bbg.jfif" },
                            { title: "DSSL's 5th Anniversary", date: "Sep 15, 2023", image: "/data-engineering.jpg" },
                            { title: "Data Science for Sustainable Goals", date: "Upcoming: Nov 05", image: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=600", socialLink: { type: "linkedin", href: "https://linkedin.com" }, isVideo: true },
                            { title: "Intro to Machine Learning Workshop", date: "Recorded Session", image: "https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?auto=format&fit=crop&q=80&w=600", isVideo: true },
                            { title: "Ethical AI Principles", date: "Recorded Session", image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=600", isVideo: true },
                            { title: "Career Paths in Data", date: "Upcoming: Nov 20", image: "/data-science.jpg", socialLink: { type: "instagram", href: "https://instagram.com" }, isVideo: true }
                        ].map((item, index) => (
                            <div key={index} className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-xl transition-all duration-500 hover:-translate-y-2">
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    {item.isVideo ? (
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center text-primary shadow-lg">
                                                <Play className="h-5 w-5 fill-current" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col p-8 text-white bg-secondary">
                                    <h4 className="font-heading text-xl font-bold leading-tight line-clamp-2">{item.title}</h4>
                                    <p className="mt-4 flex-1 text-sm leading-relaxed text-white/80">
                                        {item.date.includes("Upcoming") || item.date.includes("Recorded") ? item.date : `Published on ${item.date}`}
                                    </p>
                                    <div className="mt-6 flex items-center justify-between">
                                        <Link to="#" className="group/btn inline-flex items-center gap-2">
                                            <span className="text-sm font-bold">{item.isVideo ? "Watch Now" : "Read More"}</span>
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 group-hover/btn:translate-x-1">
                                                <ArrowRight className="h-3 w-3 text-black" />
                                            </div>
                                        </Link>
                                        {(item as any).socialLink && (
                                            <a href={(item as any).socialLink.href} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                                                {(item as any).socialLink.type === "linkedin" ? <Linkedin className="h-5 w-5" /> : <Instagram className="h-5 w-5" />}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-16 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" alt="Join our community" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/70" />
                </div>
                <div className="container relative z-10 mx-auto px-6 lg:px-12 text-center">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">Ready to start your data journey?</h2>
                    <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">Join our next cohort and gain the skills highly sought after in today's digital economy.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Button asChild size="lg" className="rounded-full bg-secondary hover:bg-secondary/90 text-white px-10 h-14 text-lg shadow-xl">
                            <Link to="/fellowships">View Our Programs</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-full hover:bg-transparent hover:text-white border-2 border-primary bg-transparent px-10 h-14 text-lg shadow-xl">
                            <Link to="/contact" className="flex items-center text-primary">
                                Contact Us <ArrowRight className="ml-2 h-5 w-5 text-primary hover:text-white" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}
