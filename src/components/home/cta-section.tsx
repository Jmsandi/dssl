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
      <div className="relative z-10 mx-auto w-[92%] sm:w-[85%] lg:w-[80%] max-w-[1200px] overflow-hidden rounded-2xl sm:rounded-[2.5rem] mt-4 sm:mt-8 lg:py-0">
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-2">
          {/* Left Column: Content */}
          <div className="px-5 py-8 text-left sm:px-8 sm:py-12 lg:px-30 lg:py-16">
            <h2 className="font-heading text-2xl font-black text-[#0a1128] sm:text-3xl md:text-4xl lg:text-3xl xl:text-5xl">
              <span className="text-balance">
                Join Sierra Leone&apos;s Data Revolution
              </span>
            </h2>
            <p className="mt-4 sm:mt-6 max-w-xl text-sm font-medium text-slate-700 sm:text-base md:text-lg">
              Take the first step toward a career in data science and AI. Applications are now open for our next cohort.
            </p>
            <div className="mt-6 sm:mt-8">
              <Button
                asChild
                size="lg"
                className="h-12 sm:h-14 bg-primary px-8 sm:px-10 text-base sm:text-lg font-bold text-primary-foreground shadow-2xl shadow-primary/40 hover:bg-primary/90 hover:scale-105 transition-all outline-none"
              >
                <Link to="/programs/data-analytics">
                  Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Image Collage */}
          <div className="relative h-[280px] w-full px-4 pb-4 sm:h-[350px] sm:p-6 lg:h-[500px] lg:p-0">
            <div className="relative h-full w-full">
              {/* BACK - Top Block Image */}
              <div className="absolute right-1 sm:right-7 top-4 sm:top-8 h-[43%] w-[40%] overflow-hidden rounded-xl sm:rounded-2xl bg-muted shadow-lg">
                <img
                  src="/hero-bg.jpg"
                  alt="Students collaborating"
                  className="h-full w-full object-cover grayscale-[0.2] opacity-80"
                />
              </div>

              {/* BACK - Bottom Block Image */}
              <div className="absolute bottom-4 sm:bottom-8 right-1 sm:right-7 h-[43%] w-[40%] overflow-hidden rounded-xl sm:rounded-2xl bg-muted shadow-lg">
                <img
                  src="/bb.jfif"
                  alt="Classroom learning"
                  className="h-full w-full object-cover grayscale-[0.2] opacity-80"
                />
              </div>

              {/* FRONT - Vertical Centerpiece */}
              <div className="absolute left-0 sm:left-3 top-1/2 z-10 h-[85%] w-[50%] sm:w-[48%] -translate-y-1/2 overflow-hidden rounded-2xl sm:rounded-3xl">
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
