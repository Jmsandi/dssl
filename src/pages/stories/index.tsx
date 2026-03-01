import { Badge } from "@/components/ui/badge"

const stories = [
    {
        title: "From Freetown to Data Analyst: Aminata's Journey",
        excerpt: "After completing the Data Analytics Fellowship, Aminata landed a role at one of Sierra Leone's largest telecom companies. Her story shows the power of hands-on training.",
        category: "Alumni Spotlight",
        date: "January 2026",
        image: "/bb.jfif",
    },
    {
        title: "How DSSL is Closing the Gender Gap in Tech",
        excerpt: "With 45% women enrollment, DSSL is actively working to create equal opportunities in Sierra Leone's emerging tech sector.",
        category: "Impact",
        date: "December 2025",
        image: "/hero-bg.jpg",
    },
    {
        title: "Building Data Pipelines for Sierra Leone's Health Sector",
        excerpt: "A team of Data Engineering fellows built a real-time data pipeline for a national health organization as their capstone project.",
        category: "Projects",
        date: "November 2025",
        image: "/bb.jfif",
    },
    {
        title: "DSSL Partners with World Bank for Data Literacy",
        excerpt: "Our latest partnership expands access to data training across three additional regions in Sierra Leone.",
        category: "Partnerships",
        date: "October 2025",
        image: "/bbg.jfif",
    },
    {
        title: "Mohamed's Path to Machine Learning Engineer",
        excerpt: "After graduating from the Data Science Fellowship, Mohamed now builds ML models that help farmers predict crop yields.",
        category: "Alumni Spotlight",
        date: "September 2025",
        image: "/bbb.jfif",
    },
    {
        title: "Inside Our First AI for Business Leaders Cohort",
        excerpt: "Twenty executives completed our inaugural AI strategy program. Here's what they learned and how they're applying it.",
        category: "Programs",
        date: "August 2025",
        image: "/bbg.jfif",
    },
]

const categoryColors: Record<string, string> = {
    "Alumni Spotlight": "bg-primary/10 text-primary border-primary/20",
    Impact: "bg-secondary/10 text-secondary border-secondary/20",
    Projects: "bg-primary/10 text-primary border-primary/20",
    Partnerships: "bg-secondary/10 text-secondary border-secondary/20",
    Programs: "bg-primary/10 text-primary border-primary/20",
}

export default function StoriesPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative h-[65vh] min-h-[400px] flex items-end overflow-hidden pb-12 lg:pb-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1600"
                        alt="DSSL Community Stories"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/75"></div>
                </div>

                <div className="container relative z-10 mx-auto px-6 lg:px-12">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                            Our Community
                        </p>
                        <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            Stories
                        </h1>
                        <p className="mt-4 text-lg text-slate-200 leading-relaxed max-w-xl">
                            Real stories of transformation, impact, and innovation from the DSSL community.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stories Grid */}
            <section className="bg-background py-20 lg:py-24">
                <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {stories.map((story) => (
                            <article
                                key={story.title}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                    <img
                                        src={story.image || "/placeholder.svg"}
                                        alt={story.title}
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className={categoryColors[story.category] || ""}>
                                            {story.category}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{story.date}</span>
                                    </div>
                                    <h2 className="mt-3 font-heading text-lg font-semibold leading-snug text-card-foreground transition-colors group-hover:text-primary">
                                        {story.title}
                                    </h2>
                                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                                        {story.excerpt}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
