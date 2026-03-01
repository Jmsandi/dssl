
import { Link } from "react-router-dom"
import { Eye, Target, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MissionSection() {
  return (
    <section className="bg-white py-24 lg:py-">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-32 items-stretch">
          {/* Left Side */}
          <div className="flex flex-col">
            <div>
              <h2 className="font-heading text-3xl font-semibold leading-[1.2] text-foreground md:text-2xl lg:text-3xl">
                Empowering the Next Generation of Digital Leaders in Sierra Leone
              </h2>
              <div className="relative mt-12 flex-1 w-[700px] min-h-[400px] overflow-hidden rounded-3xl shadow-2xl shadow-black/10">
                <img src="/b.jpg" alt="DSSL Mission" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-md font-poppins leading-relaxed  md:text-xl ">
                A Sierra Leone where data literacy powers innovation, informs decision-making, and creates economic opportunity for all.
              </p>

              <div className="mt-10 max-w-2xl space-y-6">
                {/* Mission Card */}
                <div className="group rounded-3xl border border-black/5 bg-white p-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="flex items-start gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary shadow-lg shadow-secondary/20">
                      <Eye className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading text-3xl font-bold text-foreground">Our Mission</h3>
                      <p className="mt-2 text-md leading-relaxed text-black">
                        To equip Sierra Leoneans with practical data science and AI skills through accessible, hands-on training building a generation of global problem-solvers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Community Card */}
                <div className="group rounded-3xl border border-black/5 bg-white p-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="flex items-start gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary shadow-lg shadow-secondary/20">
                      <Target className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading text-3xl font-bold text-foreground">Our Community</h3>
                      <p className="mt-2 text-md leading-relaxed text-black">
                        Producing 10,000 skilled data professionals by 2035 and creating a future where every organization is empowered by data-driven insights.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                asChild
                size="lg"
                className="h-10 w-40 rounded-full bg-gradient-to-r from-secondary to-primary/20 px-12 text-md font-medium text-white shadow-2xl shadow-primary/30 transition-all hover:scale-105"
              >
                <Link to="/about" className="flex items-center text-md">
                  Learn More <ArrowRight className="ml-0 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
