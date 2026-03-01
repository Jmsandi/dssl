import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqCategories = [
    {
        name: "Programs",
        faqs: [
            {
                question: "What programs does DSSL offer?",
                answer:
                    "DSSL offers four main programs: Data Analytics Fellowship (12 weeks), Data Science Fellowship (16 weeks), Data Engineering Fellowship (16 weeks), and AI for Business Leaders (6-8 weeks). Each program combines hands-on training with real-world projects.",
            },
            {
                question: "Are the programs fully online?",
                answer:
                    "Most programs follow a hybrid format combining in-person sessions in Freetown with online learning. The AI for Business Leaders program has a fully online option as well.",
            },
            {
                question: "Do I need prior experience to apply?",
                answer:
                    "The Data Analytics program requires no prior technical experience. For Data Science and Data Engineering, basic familiarity with programming concepts is helpful but not required. AI for Business Leaders is designed for professionals with management experience.",
            },
            {
                question: "What tools and technologies will I learn?",
                answer:
                    "Each program teaches industry-standard tools. Data Analytics covers Excel, SQL, Power BI, and Python. Data Science covers Python, Scikit-learn, and Flask/FastAPI. Data Engineering covers SQL, Apache Airflow, Spark, and AWS/Azure.",
            },
        ],
    },
    {
        name: "Applications",
        faqs: [
            {
                question: "How do I apply?",
                answer:
                    "Click the 'Apply Now' button on any page or program to start your application. You'll fill out a form with your background information and motivation. Our admissions team reviews applications on a rolling basis.",
            },
            {
                question: "When do applications open?",
                answer:
                    "We run multiple cohorts throughout the year. Check our homepage or social media channels for the latest application deadlines. We recommend applying early as spots are limited.",
            },
            {
                question: "What is the selection process?",
                answer:
                    "After submitting your application, qualified candidates are invited for a short interview. We assess motivation, commitment, and potential rather than existing technical skills for most programs.",
            },
        ],
    },
    {
        name: "Payments",
        faqs: [
            {
                question: "How much do the programs cost?",
                answer:
                    "Program fees vary by course. We strive to keep our training affordable and accessible. Contact us for current pricing details and available payment options.",
            },
            {
                question: "Are there scholarships available?",
                answer:
                    "Yes, we offer partial and full scholarships based on financial need and merit. We believe financial barriers should not prevent talented individuals from accessing quality data science training.",
            },
            {
                question: "Can I pay in installments?",
                answer:
                    "Yes, we offer flexible payment plans. You can spread your fees across the duration of the program. Contact our admissions team for details.",
            },
        ],
    },
    {
        name: "Careers",
        faqs: [
            {
                question: "Does DSSL help with job placement?",
                answer:
                    "Yes, we provide career support including resume reviews, mock interviews, portfolio guidance, and direct connections to our partner organizations who actively hire our graduates.",
            },
            {
                question: "What is the job placement rate?",
                answer:
                    "Over 85% of our graduates secure data-related roles within 6 months of completing the program. Our career support team works closely with each graduate to help them achieve their goals.",
            },
            {
                question: "What kinds of roles do graduates get?",
                answer:
                    "Our graduates have been placed in roles including Data Analyst, Business Analyst, Data Scientist, ML Engineer, Data Engineer, BI Developer, and Analytics Consultant at organizations across Sierra Leone and internationally.",
            },
        ],
    },
]

export default function FaqPage() {
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <>
            {/* Hero */}
            <section className="relative h-[65vh] min-h-[400px] flex items-end overflow-hidden pb-12 lg:pb-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1600"
                        alt="DSSL Help Center"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/65"></div>
                </div>

                <div className="container relative z-10 mx-auto px-6 lg:px-12">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                            Help Center
                        </p>
                        <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            Frequently Asked Questions
                        </h1>
                        <p className="mt-4 text-lg text-slate-200 leading-relaxed max-w-xl">
                            Find answers to common questions about our programs, applications, and more.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Content Area */}
            <section className="bg-[#050b1a] py-24 lg:py-32">
                <div className="mx-auto max-w-4xl px-6 lg:px-10">
                    <div className="flex flex-col gap-20">
                        {faqCategories.map((category) => (
                            <div key={category.name} className="space-y-10">
                                <h2 className="text-center font-heading text-3xl font-bold text-white md:text-4xl">
                                    {category.name} FAQ
                                </h2>
                                <Accordion type="single" collapsible className="flex flex-col gap-4">
                                    {category.faqs.map((faq, i) => (
                                        <AccordionItem
                                            key={faq.question}
                                            value={`${category.name}-${i}`}
                                            className="rounded-[2.5rem] border-none bg-[#111a35] px-8 py-2 transition-all hover:bg-[#1a2444] data-[state=open]:bg-[#1a2444]"
                                        >
                                            <AccordionTrigger className="text-left py-4 text-lg font-medium text-white hover:no-underline">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-slate-300 text-base leading-relaxed pb-6">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Still can't find your answer? */}
            <section className="relative overflow-hidden py-24 lg:py-32 bg-gradient-to-br from-[#050b1a] via-[#050b1a] to-[#800020]/40">
                <div className="container relative z-10 mx-auto px-6 lg:px-12">
                    <div className="grid gap-16 lg:grid-cols-2 items-center">
                        {/* Left: Contact Form */}
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
                                    Still can&apos;t find your answer?
                                </h2>
                                <p className="text-xl text-white/80">
                                    Reach out, we love hearing from you!
                                </p>
                            </div>

                            <form className="space-y-6 max-w-lg">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <Input placeholder="First Name" className="h-14 bg-white text-[#0a1128] border-none text-lg rounded-md" />
                                    <Input placeholder="Last Name" className="h-14 bg-white text-[#0a1128] border-none text-lg rounded-md" />
                                </div>
                                <Input type="email" placeholder="Email Address" className="h-14 bg-white text-[#0a1128] border-none text-lg rounded-md" />
                                <textarea
                                    placeholder="Your Message"
                                    rows={4}
                                    className="w-full bg-white text-[#0a1128] border-none text-lg rounded-md p-4 resize-none focus:ring-2 focus:ring-primary outline-none"
                                />
                                <Button type="submit" className="h-14 w-full bg-[#E31E24] text-white hover:bg-[#C1191F] text-lg font-bold rounded-full transition-all shadow-xl">
                                    Submit Form
                                </Button>
                            </form>
                        </div>

                        {/* Right: Community Image */}
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200"
                                alt="DSSL Community collaborating"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050b1a]/40 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
