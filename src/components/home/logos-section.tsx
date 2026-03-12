

const employers = [
  { name: "Orange SL", logo: "/orange.jfif" },
  { name: "Africell", logo: "/africell.png" },
  { name: "World Bank", logo: "/bank.png" },
  { name: "UNDP", logo: "/undp.png" },
  { name: "UNICEF", logo: "/unicef.png" },
]

export function LogosSection() {
  return (
    <section className="overflow-hidden border-y border-border bg-background py-12 lg:py-16">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <p className="mb-10 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Where Our Graduates Work
        </p>
      </div>

      {/* Mobile: 2-col grid (no slideshow) */}
      <div className="block sm:hidden px-6">
        <div className="grid grid-cols-2 gap-6">
          {employers.map((employer) => (
            <div
              key={employer.name}
              className="flex h-16 items-center justify-center"
            >
              <img
                src={employer.logo}
                alt={employer.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Marquee slideshow */}
      <div className="relative hidden sm:block">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {[...employers, ...employers].map((employer, i) => (
            <div
              key={`${employer.name}-${i}`}
              className="flex h-12 w-32 shrink-0 items-center justify-center transition-all hover:scale-110"
            >
              <img
                src={employer.logo}
                alt={employer.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

