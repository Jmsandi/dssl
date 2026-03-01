import { MapPin, Globe, Hand, Target } from "lucide-react"

const features = [
  {
    title: "Local Relevance",
    description: "Curriculum designed around Sierra Leone's real challenges and opportunities.",
    icon: MapPin,
  },

  {
    title: "Hands-On Approach",
    description: "Learn by doing with real data, real tools, and real-world projects from day one.",
    icon: Hand,
  },
  {
    title: "Career Outcomes",
    description: "Proven track record of placing graduates in top organizations locally and globally.",
    icon: Target,
  },

  {
    title: "Global-Standard Curriculum",
    description: "Aligned with international data science standards and industry expectations.",
    icon: Globe,
  },
]

export function WhyChooseSection() {
  return (
    <section className="bg-background py-16 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Header and Paragraph Split */}
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-6">
          <h2 className="font-heading text-4xl font-semibold text-foreground md:text-5xl lg:text-5xl">
            Why Choose DSSL?
          </h2>
          <p className="text-md font-medium leading-relaxed">
            We develop opportunities for those that have the aptitude and attitude to be successful data professionals and to provide them with the right skills they need to be ready for industry.
          </p>
        </div>

        {/* Features Grid with Centered Content and Dividers */}
        <div className="mt-20 grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={feature.title} className="relative flex flex-col items-center px-6 text-center group">
              {/* Vertical Divider Line (Starting from the second item) */}
              {index > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-1 items-center">
                  <div className="h-16 w-[1px] bg-secondary"></div>
                  <div className="h-16 w-[1px] bg-secondary"></div>
                  <div className="h-16 w-[1px] bg-secondary"></div>
                </div>
              )}

              <div className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-black  transition-all ">
                <feature.icon className="h-8 w-8 text-black" />
              </div>
              <h3 className="mt-6 font-heading text-xl font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
