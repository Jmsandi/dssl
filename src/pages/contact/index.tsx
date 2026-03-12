import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Mail,
    MapPin,
    Phone,
    AlertTriangle,
    Code2,
    Infinity,
    Settings,
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const contactCategories = [
    {
        title: "General info",
        icon: AlertTriangle,
        phones: ["+232 76 000 000", "+232 30 111 111"],
        email: "info@datasciencesl.org",
    },
    {
        title: "Fellowship Programs",
        icon: Code2,
        phones: ["+232 76 222 222", "+232 30 333 333"],
        email: "fellowships@datasciencesl.org",
    },
    {
        title: "Partnerships",
        icon: Infinity,
        phones: ["+232 76 444 444", "+232 50 555 555"],
        email: "partnerships@datasciencesl.org",
    },
    {
        title: "Certification Programs",
        icon: Settings,
        phones: ["+232 76 666 666", "+232 20 777 777"],
        email: "pro@datasciencesl.org",
    },
]

const offices = [
    {
        city: "Freetown, Sierra Leone",
        address: "Main Office, 123 Wilkinson Road, Freetown",
    },
    {
        city: "Bo, Sierra Leone",
        address: "Regional Hub, 45 Tikonko Road, Bo",
    },
    {
        city: "Makeni, Sierra Leone",
        address: "Innovation Centre, 12 Azzolini Highway, Makeni",
    },
]

export default function ContactPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative h-[50vh] min-h-[300px] lg:h-[65vh] lg:min-h-[400px] flex items-end overflow-hidden pb-8 sm:pb-12 lg:pb-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=1600"
                        alt="Contact DSSL"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                            Get In Touch
                        </p>
                        <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                            Contact Us
                        </h1>
                        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl">
                            Have questions about our programs or want to partner with us? Use the contact form,
                            call us, or send us an email.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Grid Section */}
            <section className="bg-[#0f172a] py-10 sm:py-16 -mt-1">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {contactCategories.map((cat, idx) => (
                            <div key={idx} className="group flex gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-white/10 bg-[#1e293b]/60 p-5 sm:p-7 transition-all hover:bg-[#1e293b]/80 hover:border-primary/30">
                                <div className="shrink-0 pt-1">
                                    <cat.icon className="h-5 w-5 sm:h-7 sm:w-7 text-white opacity-80 group-hover:text-primary group-hover:opacity-100 transition-all" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">{cat.title}</h3>
                                    <div className="space-y-1">
                                        {cat.phones.map((p, i) => (
                                            <p key={i} className="text-sm sm:text-base text-slate-300 font-medium">{p}</p>
                                        ))}
                                        <p className="text-sm sm:text-base text-slate-400 font-medium pt-0.5 break-all sm:break-normal">{cat.email}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Offices Card */}
                        <div className="flex gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-white/10 bg-[#1e293b]/60 p-5 sm:p-7 hover:border-primary/30">
                            <div className="shrink-0 pt-1">
                                <MapPin className="h-5 w-5 sm:h-7 sm:w-7 text-white opacity-80" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Offices</h3>
                                <div className="space-y-3">
                                    {offices.map((office, i) => (
                                        <div key={i}>
                                            <p className="text-base font-bold text-slate-200">{office.city}</p>
                                            <p className="text-[0.875rem] text-slate-400 font-medium leading-snug">{office.address}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Image Card */}
                        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl min-h-[180px] sm:min-h-[250px] border border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
                                alt="DSSL Community"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Map and Form Section */}
            <section className="bg-white py-10 sm:py-16 lg:py-20 mx-auto max-w-[1310px] px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-xl sm:rounded-2xl">
                    {/* Map Column */}
                    <div className="h-[250px] sm:h-[350px] lg:h-auto lg:min-h-[500px] bg-slate-100 relative grayscale hover:grayscale-0 transition-all duration-700">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15798.1182283!2d-13.2344781!3d8.484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMjknMDIuNCJOIDEzwrAxNCcwNC4xIlc!5e0!3m2!1sen!2ssl!4v1234567890"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    {/* Form Column */}
                    <div className="bg-[#0f172a] p-5 sm:p-8 lg:p-20 text-white">
                        <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-5 sm:mb-8 lg:mb-10">Send Us a Message</h2>

                        <form className="space-y-4 sm:space-y-6">
                            <div className="space-y-2">
                                <Select>
                                    <SelectTrigger className="h-12 sm:h-14 bg-white text-[#0a1128] border-none text-base sm:text-lg rounded-md">
                                        <SelectValue placeholder="Kindly select a subject." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General Inquiry</SelectItem>
                                        <SelectItem value="fellowship">Fellowship Program</SelectItem>
                                        <SelectItem value="partnership">Technical Partnership</SelectItem>
                                        <SelectItem value="certification">Professional Certification</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Input placeholder="First Name" className="h-12 sm:h-14 bg-white text-[#0a1128] border-none text-base sm:text-lg rounded-md" />
                                </div>
                                <div className="space-y-2">
                                    <Input placeholder="Last Name" className="h-12 sm:h-14 bg-white text-[#0a1128] border-none text-base sm:text-lg rounded-md" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Input type="email" placeholder="Email Address" className="h-12 sm:h-14 bg-white text-[#0a1128] border-none text-base sm:text-lg rounded-md" />
                            </div>

                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Your message..."
                                    rows={4}
                                    className="bg-white text-[#0a1128] border-none text-base sm:text-lg rounded-md resize-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="h-12 sm:h-14 w-full sm:w-auto px-8 sm:px-12 bg-primary text-white hover:bg-primary/90 text-base sm:text-lg font-bold rounded-md transition-all"
                            >
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}
