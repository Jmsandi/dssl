
import { useEffect, useRef, useState } from "react"
import { Users, TrendingUp, Building, UserCheck } from "lucide-react"

const stats = [
  { label: "Students Trained", value: 500, suffix: "+", icon: Users },
  { label: "Career Placement Rate", value: 85, suffix: "%", icon: TrendingUp },
  { label: "Partner Organizations", value: 30, suffix: "+", icon: Building },
  { label: "Women Trained", value: 45, suffix: "%", icon: UserCheck },
]

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    let animationFrame: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      }
    }
    animationFrame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, start])
  return count
}

function StatItem({ stat }: { stat: (typeof stats)[0] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const count = useCountUp(stat.value, 2000, visible)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex flex-col items-start gap-2">
      <p className="font-heading text-5xl font-black tracking-tight text-white md:text-6xl lg:text-5xl">
        {count}
        {stat.suffix}
      </p>
      <p className="text-lg font-bold tracking-widest text-white/80">{stat.label}</p>
    </div>
  )
}

export function StatsSection() {
  return (
    <section id="impact" className="relative z-20 -mt-16 block lg:-mt-20">
      <div className="max-w-full">
        <div className="relative overflow-hidden bg-gradient-to-r from-secondary to-primary p-8 shadow-2xl shadow-black/10 transition-transform hover:scale-[1.01] lg:p-12">
          {/* Dimming Overlay */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <div className="relative z-10 mx-auto flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-8 px-6 lg:px-12">
            <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-8 md:grid-cols-4 lg:gap-x-16">
              {stats.map((stat) => (
                <StatItem key={stat.label} stat={stat} />
              ))}
            </div>

            <div className="flex shrink-0 items-center border-t border-white/20 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <p className="max-w-[200px] font-heading text-lg font-black leading-tight text-white lg:text-xl">
                Building Sierra Leone’s Data Future
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
