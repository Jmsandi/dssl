
import * as React from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"

const testimonials = [
  {
    quote: "DSSL transformed my career completely. I went from knowing nothing about data to landing a data analyst role within three months of graduating.",
    name: "Aminata Kamara",
    program: "Data Analytics Fellow",
    company: "Standard Chartered Bank",
    image: "/bbb.jfif",
  },
  {
    quote: "The hands-on approach made all the difference. Working on real projects gave me the confidence and portfolio I needed to stand out to employers.",
    name: "Mohamed Sesay",
    program: "Data Science Fellow",
    company: "Orange Sierra Leone",
    image: "/bb.jfif",
  },
  {
    quote: "As a business leader, the AI program opened my eyes to how data can drive our organization forward. The instructors were world-class.",
    name: "Fatmata Koroma",
    program: "AI for Business Leaders",
    company: "Ecobank",
    image: "/bbb.jfif",
  },
  {
    quote: "The data engineering program taught me skills I use every day in my role. The cloud and pipeline modules were especially valuable.",
    name: "Ibrahim Bangura",
    program: "Data Engineering Fellow",
    company: "Sierra Leone Government",
    image: "/bb.jfif",
  },
]

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)

    // Autoplay logic: 7 seconds
    const intervalId = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext()
    }, 7000)

    return () => {
      emblaApi.off("select", onSelect)
      clearInterval(intervalId)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = React.useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  return (
    <section className="bg-background py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-black text-foreground md:text-4xl lg:text-4xl mx-auto">
            What Our Graduates are Saying About Us
          </h2>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 px-4">
                  <div className="max-w-4xl mx-auto flex flex-col items-start text-left">

                    <blockquote className="text-lg md:text-xl font-medium leading-relaxed text-foreground">
                      {testimonial.quote}
                    </blockquote>

                    <div className="mt-10 flex items-center justify-between w-full max-w-4xl">
                      <div>
                        <p className="font-heading text-lg font-black text-foreground">{testimonial.name}</p>
                        <p className="text-sm font-semibold text-primary">{testimonial.program}</p>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{testimonial.company}</p>
                      </div>
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-primary/10">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls - Simple Icons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
            <button
              onClick={scrollPrev}
              className="flex h-12 w-12 items-center justify-center text-primary transition-all hover:scale-110 pointer-events-auto"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
            <button
              onClick={scrollNext}
              className="flex h-12 w-12 items-center justify-center text-primary transition-all hover:scale-110 pointer-events-auto"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="mt-12 flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === selectedIndex ? "w-8 bg-primary" : "w-1.5 bg-slate-400 hover:bg-secondary/40"
                }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
