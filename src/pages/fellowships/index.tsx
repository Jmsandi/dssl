import { useEffect, useState } from "react"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronRight, Loader2 } from "lucide-react"

export interface Offering {
    id: string
    title: string
    description: string
    image: string
    slug: string
    price: number
    currency: string
}

const overviewPillars = [
    {
        number: "01",
        title: "Intensive Training",
        description: "Develop intensive data skills anywhere from 12 to 24 weeks, coupled with leadership skills training and dedicated careers support."
    },
    {
        number: "02",
        title: "Internship Placement",
        description: "Put your skills into practice with access to hands-on, real-world internships with our employer partners."
    },
    {
        number: "03",
        title: "Economic Opportunity",
        description: "85% of our program graduates secure data science jobs within 3 months, earning 3x the average salary of their peers."
    }
]

const steps = [
    { id: 1, title: "Apply", description: "Submit your application. Share a bit about yourself and what's driving you to start a career in data science." },
    { id: 2, title: "Admissions Assessment", description: "Complete a short critical thinking and problem-solving assessment. This allows us to assess your aptitude for data." },
    { id: 3, title: "Admissions Interview", description: "Speak with an Admissions representative in a non-technical interview. This is an opportunity for us to get to know each other a little better." },
    { id: 4, title: "Admissions Decision", description: "Receive your acceptance decision from Admissions. This usually happens within 3 business days." },
    { id: 5, title: "Prework", description: "If accepted, you'll begin course pre-work to prepare for the first day of class. Our data courses pre-work consists of 20-40 hours of lessons and labs." }
]

export default function FellowshipsPage() {
    const [offerings, setOfferings] = useState<Offering[]>([])
    const [loadingOfferings, setLoadingOfferings] = useState(true)

    useEffect(() => {
        let mounted = true;

        const fetchOfferings = async () => {
            try {
                // Fetch courses from Firestore (order by created desc)
                // We filter isActive locally to avoid requiring a Firebase composite index
                const q = query(collection(db, "courses"), orderBy("createdAt", "desc"))
                const querySnapshot = await getDocs(q)

                if (!mounted) return;

                // Fallback images based on index
                const fallbackImages = ["/data-analytics.jpg", "/data-science.jpg", "/data-engineering.jpg"]

                const loaded = querySnapshot.docs
                    .filter((doc) => doc.data().isActive === true)
                    .map((doc, index) => {
                        const data = doc.data()
                        return {
                            id: doc.id,
                            title: data.name,
                            description: data.description || "Learn in-demand data skills.",
                            image: data.imageUrl || fallbackImages[index % fallbackImages.length],
                            slug: data.slug || doc.id,
                            price: data.price ?? 0,
                            currency: data.currency || "SLE",
                        } as Offering
                    })

                setOfferings(loaded)
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
                console.error("Error fetching courses:", error)
            } finally {
                if (mounted) {
                    setLoadingOfferings(false)
                }
            }
        }

        fetchOfferings()

        return () => {
            mounted = false;
        }
    }, [])

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative h-[55vh] lg:h-[70vh] min-h-[250px] sm:min-h-[300px] w-full overflow-hidden flex items-end pb-12 sm:pb-16 lg:pb-32 bg-[#0a192f]">
                    <img
                        src="/data-analytics.jpg"
                        alt="DSSL Fellowships"
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/80 to-transparent" />
                    <div className="container relative z-10 mx-auto px-4 sm:px-6">
                        <div className="max-w-4xl">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold font-heading text-white mb-4 sm:mb-6 tracking-tight">Fellowships</h1>
                            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
                                We completely redefine how untapped African talents are skilled and prepared for the future of work.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Explore Our Offerings */}
                <section className="py-10 sm:py-14 px-4 sm:px-6 bg-white mx-auto">
                    <div className="container mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#0a192f] mb-8 sm:mb-16">
                            Explore Our <span className="text-secondary">Offerings</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-16">
                            {loadingOfferings ? (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
                                    <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                                    <p>Loading available programs...</p>
                                </div>
                            ) : offerings.length === 0 ? (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
                                    <p>No programs available at this time.</p>
                                </div>
                            ) : offerings.map((offering) => (
                                <div key={offering.id} className="flex flex-col sm:flex-row bg-[#f8fafc] rounded-xl sm:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-slate-100">
                                    <div className="relative w-full sm:w-2/5 min-h-[180px] sm:min-h-[250px] overflow-hidden">
                                        <img
                                            src={offering.image}
                                            alt={offering.title}
                                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {/* Price badge */}
                                        {offering.price > 0 && (
                                            <div className="absolute top-4 left-4 bg-[#0a1128]/90 backdrop-blur-sm text-white text-sm font-black px-4 py-1.5 rounded-full shadow-lg">
                                                {offering.currency} {offering.price.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-full sm:w-3/5 p-5 sm:p-8 flex flex-col justify-center">
                                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0a1128] mb-2 sm:mb-3">{offering.title}</h3>
                                        {offering.price > 0 && (
                                            <p className="text-secondary font-black text-xl mb-3">{offering.currency} {offering.price.toLocaleString()}</p>
                                        )}
                                        <p className="text-slate-600 mb-4 sm:mb-8 leading-relaxed line-clamp-3 text-sm sm:text-base">{offering.description}</p>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mt-auto">
                                            <Link
                                                to={`/programs/${offering.slug}`}
                                                className="flex items-center gap-2 text-[#0a1128] font-bold hover:text-secondary transition-colors"
                                            >
                                                Learn More <ChevronRight className="h-5 w-5 bg-[#0a1128] text-white rounded-full p-1 group-hover:bg-secondary" />
                                            </Link>
                                            <Button asChild className="bg-primary hover:bg-secondary text-white rounded-full px-8 py-2 h-auto text-sm font-bold shadow-md transition-all hover:scale-105">
                                                <Link to={`/payment?program=${offering.slug}`}>Apply Now</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Join Waitlist CTA */}
                        <div className="container mx-auto">
                            <Link to="/waitlist">
                                <div className="relative h-14 sm:h-20 w-full rounded-full overflow-hidden flex items-center justify-center group shadow-xl hover:scale-[1.01] transition-all">
                                    <div className="absolute inset-0 bg-[#0a192f]" />
                                    <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-gradient-to-l from-secondary via-secondary to-transparent" />
                                    <span className="relative z-10 text-white font-bold text-lg sm:text-xl lg:text-2xl">Join Our Waitlist</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Training Overview */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-10 sm:mt-16 font-bold text-center text-[#0a192f] mb-6 sm:mb-10 px-4">
                    Blossom Academy Training Overview
                </h2>
                <section className="relative py-10 sm:py-16 lg:py-24 px-4 sm:px-6 mx-auto overflow-hidden max-w-7xl rounded-xl sm:rounded-[3rem] shadow-2xl">
                    <div className="absolute inset-0">
                        <img
                            src="/data-engineering.jpg"
                            alt="Overview Background"
                            className="absolute inset-0 h-full w-full object-cover brightness-[0.2]"
                        />
                    </div>
                    <div className="container relative z-10 mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
                            {overviewPillars.map((pillar) => (
                                <div key={pillar.number} className="bg-[#0a1128]/90 backdrop-blur-sm p-5 sm:p-8 lg:p-10 rounded-xl sm:rounded-[2.5rem] border border-white/10 flex flex-col items-start gap-3 sm:gap-6 hover:translate-y-[-10px] transition-all duration-300">
                                    <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-none">{pillar.number}</span>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-2 sm:mt-4">{pillar.title}</h3>
                                    <p className="text-white/70 leading-relaxed text-sm sm:text-base lg:text-lg">{pillar.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Admissions Section */}
                <section className="py-12 sm:py-20 lg:py-32 px-4 sm:px-6 bg-white overflow-hidden">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 items-start">
                            <div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a1128] mb-4 sm:mb-6">
                                    Take the Leap and <span className="text-secondary">Start Your Journey</span>
                                </h2>
                                <p className="text-slate-500 text-base sm:text-lg mb-8 sm:mb-16 max-w-xl">
                                    Blossom Academy creates a community by admitting students who bring creativity, ingenuity, and curiosity to the classroom.
                                </p>
                                <div className="space-y-6 sm:space-y-12">
                                    {steps.map((step) => (
                                        <div key={step.id} className="flex flex-col items-center sm:flex-row sm:items-start gap-2 sm:gap-8 group">
                                            <div className="text-3xl sm:text-5xl font-black text-secondary/40 group-hover:text-secondary/20 transition-colors duration-300 w-8 sm:w-12 text-center shrink-0">
                                                {step.id}
                                            </div>
                                            <div className="sm:pt-2">
                                                <h3 className="text-lg sm:text-2xl font-bold text-[#0a1128] mb-1 sm:mb-2">{step.title}</h3>
                                                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="relative aspect-[4/3] rounded-xl sm:rounded-[3rem] overflow-hidden shadow-2xl">
                                    <img
                                        src="/data-analytics.jpg"
                                        alt="Student Journey"
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                </div>
                                <Link to="/contact" className="block">
                                    <div className="h-10 w-full rounded-full bg-gradient-to-r from-[#0a192f] via-[#0a192f] to-secondary flex items-center justify-center text-white font-bold text-lg sm:text-xl lg:text-2xl shadow-xl hover:scale-[1.02] transition-all">
                                        Contact Us
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
