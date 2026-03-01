import { CheckCircle } from "lucide-react"

const benefits = [
  "Career Mentorship from Industry Experts",
  "Hands-on Experience with Real-World Projects",
  "A Supportive Global Peer Community",
  "Access to Industry-Standard Tools",
  "Networking with Top Hiring Partners",
  "Recognized Professional Certificate",
]

export function BenefitsSection() {
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-10">
          {/* Left Side: YouTube Video */}
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-2xl">
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="DSSL Training Benefits"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Right Side: Content and List */}
          <div className="max-w-xl">
            <h2 className="font-heading text-3xl font-black text-foreground md:text-5xl lg:text-3xl">
              Our Amazing Benefits
            </h2>
            <p className="mt-6 text-md font-medium leading-relaxed">
              DSSL training programs provide the following benefits:
            </p>

            <ul className="mt-5 space-y-0">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 border-b border-gray-200 py-2 transition-colors hover:bg-muted/30 last:border-b-0"
                >
                  <CheckCircle className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} />
                  <span className="text-md text-foreground">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
