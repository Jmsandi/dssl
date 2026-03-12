
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePos({ x: x * 20, y: y * 20 })
    }
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const x = (touch.clientX / window.innerWidth - 0.5) * 2
      const y = (touch.clientY / window.innerHeight - 0.5) * 2
      setMousePos({ x: x * 20, y: y * 20 })
    }
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [])

  return (
    <section className="relative flex min-h-[500px] h-[85vh] lg:h-screen lg:min-h-[800px] items-center justify-center overflow-hidden">
      {/* Background Image Container with Parallax-like movement */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.09)`,
        }}
      >
        <img src="/bb.jfif" alt="DSSL Students" className="absolute inset-0 h-[85vh] sm:h-full w-full object-cover lg:object-contain sm:object-cover object-center" />
        {/* Dim Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/30 z-10" />
        <div className="absolute inset-0 bg-black/30 z-10" />
      </div>

      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center pt-20">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="font-heading text-4xl font-black leading-[1.1] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-7xl">
            Train. Build. <br />
            <span className="text-primary italic">Innovate.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-white/90 sm:max-w-3xl sm:text-xl md:text-xl">
            Launch your data-driven future with Sierra Leone&apos;s premier data science training.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-12 rounded-full bg-primary border-white/10 px-10 text-md font-medium text-white shadow-2xl shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/40"
            >
              <Link to="/fellowships" className="flex items-center justify-center">
                Become a Fellow <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-12 rounded-full border-2 border-white/10 bg-secondary px-10 text-md font-medium text-white backdrop-blur-md transition-all hover:scale-105 hover:text-white hover:bg-secondary/40"
            >
              <button
                onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center"
              >
                Explore Programs <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto h-12 rounded-full border-2 border-white/10 bg-white px-8 text-md font-medium text-black transition-all hover:text-white hover:bg-white/60"
            >
              <Link to="/hire/application" className="flex items-center justify-center">
                Hire Our Grads <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>


    </section>
  )
}
