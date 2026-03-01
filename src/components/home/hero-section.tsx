
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position from center (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2

      // Scale for subtle movement (e.g., 30px max)
      setMousePos({
        x: x * 20,
        y: y * 20,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="relative flex h-screen min-h-[800px] items-center justify-center overflow-hidden">
      {/* Background Image Container with Parallax-like movement */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.1)`,
        }}
      >
        <img src="/bb.jfif" alt="DSSL Students" className="absolute inset-0 h-full w-full object-contain w-full" />
        {/* Dim Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/30 z-10" />
        <div className="absolute inset-0 bg-black/30 z-10" />
      </div>

      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center pt-20">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="font-heading text-4xl font-black leading-[1.05] tracking-tighter text-white sm:text-7xl md:text-7xl lg:text-7xl">
            Train. Build. <br />
            <span className="text-primary italic">Innovate.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-5xl text-xl leading text-white md:text-xl">
            Launch your data-driven future with Sierra Leone&apos;s premier data science training.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-primary border-white/10 px-10 text-md font-medium text-white shadow-2xl shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/40"
            >
              <Link to="/fellowships" className="flex items-center">
                Become a Fellow <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-2 border-white/10 bg-secondary px-10 text-md font-medium text-white backdrop-blur-md transition-all hover:scale-105 hover:text-white hover:bg-secondary/40"
            >
              <Link to="/#programs" className="flex items-center">
                Explore Programs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-12 rounded-full border-2 border-white/10 bg-white px-8 text-md font-medium text-black transition-all hover:text-white hover:bg-white/60"
            >
              <Link to="/hire/application" className="flex items-center">
                Hire Our Grads <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>


    </section>
  )
}
