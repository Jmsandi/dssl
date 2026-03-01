import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (

    <section className="relative overflow-hidden">
      {/* Full-width Background Image and Overlays - Light "White Opacity" Theme */}
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-fixed bg-cover bg-center opacity-70"
        style={{ backgroundImage: 'url("/b.jpg")' }}
      >
        {/* White wash overlay */}
        <div className="absolute inset-0 bg-white/40"></div>
        {/* Subtle horizontal gradients to blend sides */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80"></div>
      </div>

      {/* Contained Centered "Page" Content Box */}
      <div className="relative z-10 mx-auto w-[80%] max-w-[1200px] overflow-hidden rounded-[2.5rem] mt-8 lg:py-0">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          {/* Left Column: Content */}
          <div className="px-8 py-12 text-left lg:px-30 lg:py-16">
            <h2 className="font-heading text-4xl font-black text-[#0a1128] md:text-5xl lg:text-3xl xl:text-5xl">
              <span className="text-balance">
                Join Sierra Leone&apos;s Data Revolution
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-base font-medium text-slate-700 md:text-lg">
              Take the first step toward a career in data science and AI. Applications are now open for our next cohort.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="h-14 bg-primary px-10 text-lg font-bold text-primary-foreground shadow-2xl shadow-primary/40 hover:bg-primary/90 hover:scale-105 transition-all outline-none"
              >
                <Link to="/programs/data-analytics">
                  Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Image Collage (1 Vertical Front, 2 Block Behind) */}
          <div className="relative h-[450px] w-full p-8 lg:h-[500px] lg:p-0">
            <div className="relative h-full w-full">
              {/* BACK - Top Block Image */}
              <div className="absolute right-7 top-8 h-[43%] w-[42%] overflow-hidden rounded-2xl bg-muted shadow-lg">
                <img
                  src="/hero-bg.jpg"
                  alt="Students collaborating"
                  className="h-full w-full object-cover grayscale-[0.2] opacity-80"
                />
              </div>

              {/* BACK - Bottom Block Image */}
              <div className="absolute bottom-8 right-7 h-[43%] w-[42%] overflow-hidden rounded-2xl bg-muted shadow-lg">
                <img
                  src="/bb.jfif"
                  alt="Classroom learning"
                  className="h-full w-full object-cover grayscale-[0.2] opacity-80"
                />
              </div>

              {/* FRONT - Vertical Centerpiece */}
              <div className="absolute left-3 top-1/2 z-10 h-[85%] w-[48%] -translate-y-1/2 overflow-hidden rounded-3xl">
                <img
                  src="/bbb.jfif"
                  alt="Student working"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
