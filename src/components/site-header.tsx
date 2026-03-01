import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, X, ChevronDown, Linkedin, Twitter, Instagram, LogIn, UserCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"

const programs = [
    {
        name: "Data Analytics",
        href: "/programs/data-analytics",
        image: "/data-analytics.jpg"
    },
    {
        name: "Data Science",
        href: "/programs/data-science",
        image: "/data-science.jpg"
    },
    {
        name: "Data Engineering",
        href: "/programs/data-engineering",
        image: "/data-engineering.jpg"
    },
    {
        name: "AI for Business Leaders",
        href: "/programs/ai-business-leaders",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400"
    },
]

const navLinks = [
    { name: "About Us", href: "/about" },
    { name: "Fellowships", href: "/fellowships", hasDropdown: true },
    { name: "Hire Talent", href: "/hire" },
    { name: "Stories", href: "/stories" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faq" },
]

export function SiteHeader() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { user, profile, signOut } = useAuth()

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/"
        if (href.startsWith("/#")) return pathname === "/"
        return pathname.startsWith(href)
    }

    return (
        <header className="absolute top-8 left-0 text-black right-0 z-50 h-[80px] xl:h-[70px] flex items-center justify-center transition-all duration-300">
            <div className={cn(
                "relative flex h-full w-full items-center justify-between transition-all duration-300 px-6 xl:px-10",
                "bg-slate-100/45 backdrop-blur-md shadow-lg rounded-full max-w-7xl border border-white/20"
            )}>
                {/* Logo */}
                <Link to="/" className="flex items-center shrink-0">
                    <img
                        src="/logo.png"
                        alt="DSSL Logo"
                        className="h-14 w-auto object-contain transition-all duration-300"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="flex items-center gap-8">
                    <nav className="hidden items-center gap-8 xl:flex" aria-label="Main navigation">
                        {navLinks.map((link) => (
                            link.hasDropdown ? (
                                <div key={link.name} className="static group/menu">
                                    <button
                                        className={cn(
                                            "flex items-center gap-1 py-1 text-base font-bold transition-colors group",
                                            isActive(link.href)
                                                ? "text-primary"
                                                : "text-slate-700 hover:text-primary"
                                        )}
                                    >
                                        {link.name}
                                        <ChevronDown className="h-4 w-4 transition-transform group-hover/menu:rotate-180" />
                                        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                                    </button>

                                    {/* Mega Menu Dropdown */}
                                    <div className="invisible absolute top-[100%] right-0 z-50 pt-4 opacity-0 transition-all duration-300 group-hover/menu:visible group-hover/menu:opacity-100">
                                        <div className="w-[900px] overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-2xl">
                                            <div className="grid grid-cols-4 gap-4 mb-6">
                                                {programs.map((prog) => (
                                                    <Link
                                                        key={prog.name}
                                                        to={prog.href}
                                                        className="group/item flex flex-col gap-3"
                                                    >
                                                        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-slate-100 transition-transform duration-500 group-hover/item:scale-[1.02]">
                                                            <img
                                                                src={prog.image}
                                                                alt={prog.name}
                                                                className="absolute inset-0 h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="py-2 px-4 rounded-full bg-gradient-to-r from-[#0a192f] via-secondary to-secondary text-white text-center text-sm font-semibold shadow-md transition-all group-hover/item:shadow-lg group-hover/item:brightness-110">
                                                            {prog.name}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                            <Button
                                                asChild
                                                className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#0a192f] via-secondary to-secondary text-lg font-bold text-white shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] border-none"
                                            >
                                                <Link to="/fellowships">See All Fellowships</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={cn(
                                        "relative py-1 text-base font-bold transition-colors group",
                                        isActive(link.href)
                                            ? "text-primary"
                                            : "text-slate-700 hover:text-primary"
                                    )}
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                                </Link>
                            )
                        ))}
                    </nav>


                    {/* Hamburger Icon */}
                    <button
                        className="flex items-center justify-center rounded-full hover:bg-foreground/5 p-2 transition-colors"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Toggle menu"
                    >
                        <Menu className="h-7 w-7 text-slate-900 transition-colors" />
                    </button>
                </div>
            </div>

            {/* Mobile & Desktop Sidebar System */}
            <div className={cn(
                "fixed inset-0 z-[60] transition-all duration-500",
                mobileOpen ? "visible" : "invisible"
            )}>
                {/* Backdrop */}
                <div
                    className={cn(
                        "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500",
                        mobileOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={() => setMobileOpen(false)}
                />

                {/* Sidebar */}
                <div className={cn(
                    "absolute inset-y-0 right-0 w-full max-w-md bg-[#0a1128] p-8 text-white shadow-2xl transition-transform duration-500 ease-out",
                    "after:absolute after:inset-0 after:bg-gradient-to-r after:from-[#0a1128] after:to-primary/20 after:pointer-events-none",
                    mobileOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between">
                            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center">
                                <img
                                    src="/logo.png"
                                    alt="DSSL Logo"
                                    className="h-10 w-auto object-contain"
                                />
                            </Link>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="mt-12 overflow-y-auto pr-2">
                            <div className="space-y-12">
                                {/* Primary Navigation Section - Visible on Mobile Sidebar */}
                                <section className="xl:hidden">
                                    <h3 className="text-sm font-bold  tracking-widest text-white/80 mb-6">Primary Navigation</h3>
                                    <div className="flex flex-col gap-4">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                to={link.href}
                                                onClick={() => setMobileOpen(false)}
                                                className="text-xl font-bold hover:text-white/80 transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </div>
                                </section>

                                {/* Our courses Section */}
                                <section>
                                    <h3 className="text-xl font-bold  tracking-widest text-white/80 mb-6">Our Fellowships</h3>
                                    <div className="flex flex-col gap-4">
                                        {programs.map((prog) => (
                                            <Link
                                                key={prog.name}
                                                to={prog.href}
                                                onClick={() => setMobileOpen(false)}
                                                className="text-md font-medium hover:text-primary transition-colors opacity-90"
                                            >
                                                {prog.name}
                                            </Link>
                                        ))}
                                        <Button
                                            asChild
                                            className="mt-4 bg-primary/40 text-md text-white hover:bg-primary/60"
                                        >
                                            <Link to="/fellowships" onClick={() => setMobileOpen(false)}>See All Fellowships</Link>
                                        </Button>
                                    </div>
                                </section>

                                {/* Certification Section */}
                                <section>
                                    <h3 className="text-lg font-bold tracking-widest text-white/80 mb-6">Explore Our Certification Courses</h3>
                                    <Button
                                        asChild
                                        className="w-full text-md bg-primary/40 hover:bg-primary/60"
                                    >
                                        <Link to="/fellowships" onClick={() => setMobileOpen(false)}>Get Certified</Link>
                                    </Button>
                                </section>

                                {/* Auth Section — Mobile Sidebar */}
                                <section>
                                    <h3 className="text-lg font-bold tracking-widest text-white/80 mb-6">Account</h3>
                                    {user ? (
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10">
                                                <UserCircle className="h-6 w-6 text-emerald-400" />
                                                <div>
                                                    <p className="font-semibold text-sm">{profile?.name ?? 'Student'}</p>
                                                    <p className="text-white/50 text-xs">{profile?.email}</p>
                                                </div>
                                            </div>
                                            <Button asChild className="bg-white/10 hover:bg-white/20 text-white">
                                                <Link
                                                    to={profile?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    Go to Dashboard
                                                </Link>
                                            </Button>
                                            <button
                                                onClick={() => { handleSignOut(); setMobileOpen(false) }}
                                                className="w-full text-center py-2 text-red-400 hover:text-red-300 text-sm font-medium transition"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <Button asChild className="w-full bg-primary/40 hover:bg-primary/60 text-white">
                                                <Link to="/student/login" onClick={() => setMobileOpen(false)}>
                                                    <LogIn className="h-4 w-4 mr-2" /> Log In
                                                </Link>
                                            </Button>
                                            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white font-bold">
                                                <Link to="/student/register" onClick={() => setMobileOpen(false)}>
                                                    Sign Up — It's Free
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </section>

                                {/* Social Media Section */}
                                <section>
                                    <h3 className="text-lg font-bold tracking-widest text-white/80 mb-6">Follow Us on Social Media</h3>
                                    <div className="flex gap-6">
                                        <a href="#" className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all">
                                            <Linkedin className="h-6 w-6" />
                                        </a>
                                        <a href="#" className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all">
                                            <Twitter className="h-6 w-6" />
                                        </a>
                                        <a href="#" className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all">
                                            <Instagram className="h-6 w-6" />
                                        </a>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
