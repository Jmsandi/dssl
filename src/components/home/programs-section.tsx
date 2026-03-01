
import { Link } from "react-router-dom"

import { ArrowRight, BarChart3, Brain, Database, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

const programs = [
  {
    title: "Data Analytics",
    description: "Master Excel, SQL, Power BI, and Python to transform raw data into actionable insights.",
    href: "/programs/data-analytics",
    category: "Fellowship Programs",
    image: "/data-analytics.jpg",
    slug: "data-analytics",
  },
  {
    title: "Data Science",
    description: "Learn statistics, machine learning, and model deployment to build predictive solutions.",
    href: "/programs/data-science",
    category: "Fellowship Programs",
    image: "/data-science.jpg",
    slug: "data-science",
  },
  {
    title: "Data Engineering",
    description: "Build robust data pipelines, master cloud platforms, and work with big data tools.",
    href: "/programs/data-engineering",
    category: "Certification Courses",
    image: "/data-engineering.jpg",
    slug: "data-engineering",
  },
  {
    title: "AI for Business Leaders",
    description: "Understand AI strategy, ethics, and digital transformation for decision-making.",
    href: "/programs/ai-business-leaders",
    category: "Certification Courses",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
    slug: "ai-business-leaders",
  },
]

export function ProgramsSection() {
  return (
    <section id="programs" className="bg-background py-10 lg:py-10">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="text-center">
          <h3 className="font-poppins text-2xl font-bold text-secondary">
            Start your dream career!
          </h3>
          <h2 className="mt-4 font-heading text-5xl font-black text-foreground md:text-5xl lg:text-5xl">
            Explore Featured Courses
          </h2>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="h-12 rounded-full px-8 text-md font-bold transition-all duration-300 bg-gradient-to-r from-secondary to-primary text-white hover:scale-105"
            >
              <Link to="/programs/fellowship">Fellowship Programs</Link>
            </Button>
            <Button
              asChild
              className="h-12 rounded-full px-8 text-md font-bold transition-all duration-300 bg-secondary text-white shadow-xl shadow-secondary/20 hover:scale-105"
            >
              <Link to="/fellowships">Certification Courses</Link>
            </Button>
          </div>
        </div>

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program) => (
            <div
              key={program.title}
              className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Section */}
              <div className="relative h-48 w-full overflow-hidden">
                <img src={program.image} alt={program.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
              </div>

              {/* Content Section */}
              <div
                className="flex flex-1 flex-col p-8 text-white bg-secondary"

              >
                <h4 className="font-heading text-xl font-bold leading-tight lg:text-2xl">
                  {program.title}
                </h4>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/80">
                  {program.description}
                </p>

                <div className="mt-8 flex items-center justify-between">
                  <Link to={program.href} className="group/btn inline-flex items-center gap-2">
                    <span className="text-md font-bold text-white/90">Learn More</span>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 group-hover/btn:translate-x-2">
                      <ArrowRight
                        className="h-4 w-4 text-black"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
