import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

const programLinks = [
    { name: "Data Analytics", href: "/programs/data-analytics" },
    { name: "Data Science", href: "/programs/data-science" },
    { name: "Data Engineering", href: "/programs/data-engineering" },
    { name: "AI for Business Leaders", href: "/programs/ai-business-leaders" },
]

const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Stories", href: "/stories" },
    { name: "Hire Our Grads", href: "/hire" },
    { name: "FAQs", href: "/faq" },
    { name: "Contact", href: "/contact" },
]

const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "LinkedIn", href: "#", icon: Linkedin },
]

export function SiteFooter() {
    return (
        <footer className="bg-[#0a1128] text-white pt-16 pb-8 border-t border-slate-800">
            <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
                {/* Top Section */}
                <div className="grid gap-12 lg:grid-cols-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 flex flex-col items-start">
                        <Link to="/" className="mb-6 inline-block">
                            <img
                                src="/footer-logo.png"
                                alt="DSSL Logo"
                                className="h-24 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                            Empowering Africa's future through world-class data science, AI, and analytics education. Join us to transform your career and build innovative solutions.
                        </p>
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-primary hover:-translate-y-1"
                                    aria-label={social.name}
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-8 grid gap-8 sm:grid-cols-3">
                        {/* Programs */}
                        <div>
                            <h3 className="font-heading text-sm font-bold tracking-wider text-white mb-6 uppercase">
                                Programs
                            </h3>
                            <ul className="flex flex-col gap-4">
                                {programLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="text-sm font-medium text-slate-400 transition-colors hover:text-white flex items-center gap-2"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="font-heading text-sm font-bold tracking-wider text-white mb-6 uppercase">
                                Company
                            </h3>
                            <ul className="flex flex-col gap-4">
                                {companyLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="text-sm font-medium text-slate-400 transition-colors hover:text-white flex items-center gap-2"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="font-heading text-sm font-bold tracking-wider text-white mb-6 uppercase">
                                Contact
                            </h3>
                            <ul className="flex flex-col gap-5">
                                <li className="flex items-start gap-4 text-sm font-medium text-slate-400">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-primary">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col pt-2">
                                        <span className="text-white">Email Us</span>
                                        <a href="mailto:info@datasciencesl.org" className="hover:text-white transition-colors">info@datasciencesl.org</a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 text-sm font-medium text-slate-400">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-primary">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col pt-2">
                                        <span className="text-white">Call Us</span>
                                        <a href="tel:+23276000000" className="hover:text-white transition-colors">+232 76 000 000</a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 text-sm font-medium text-slate-400">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-primary">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col pt-2">
                                        <span className="text-white">Visit Us</span>
                                        <span>Freetown, Sierra Leone</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Border & Copyright */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-medium text-slate-500">
                        {"\u00A9"} {new Date().getFullYear()} Data Science Sierra Leone (DSSL). All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm font-medium text-slate-500">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
