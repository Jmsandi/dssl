import { Link } from "react-router-dom"


const steps = [
  {
    step: "01",
    title: "Intensive Training",
    description:
      "Hands-on learning with real tools used by data professionals worldwide. Expert-led sessions in a supportive environment.",
  },
  {
    step: "02",
    title: "Real-World Projects",
    description:
      "Apply your skills to industry-relevant capstone projects that build your portfolio and solve real problems.",
  },
  {
    step: "03",
    title: "Career Pathways",
    description:
      "Get hiring support, employer connections, and career mentorship to land your dream role in data.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative bg-background py-12 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-14 text-center">
          <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl">
            Our Training Overview
          </h2>
        </div>

        {/* Background Image Container */}
        <div className="relative overflow-hidden rounded-xl p-1 lg:p-12">
          {/* Dimmed Background image */}
          <div className="absolute inset-0 z-0">
            <img src="/b.jpg" alt="Background" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          </div>

          {/* Cards Grid */}
          <div className="relative z-10 grid gap-6 md:grid-cols-3 lg:gap-8 py-10 px-8 lg:bg-transparent">
            {steps.map((step) => (
              <div
                key={step.step}
                className="group flex flex-col rounded-xl bg-secondary p-5 sm:p-6 shadow-2xl transition-all duration-500 hover:-translate-y-2 lg:p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <span className="font-heading text-5xl font-black text-white transition-colors">
                      {step.step}
                    </span>
                    <div className="absolute -bottom-2 left-0 h-0.5 w-16 bg-slate-500" />
                  </div>
                </div>

                <h3 className="mt-12 font-heading text-2xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-md leading-relaxed text-white">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
