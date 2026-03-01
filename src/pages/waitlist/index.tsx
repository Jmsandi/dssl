import { WaitlistForm } from "@/components/waitlist-form"

export default function WaitlistPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <main className="flex-grow">
                {/* Panoramic Hero */}
                <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden flex items-end pb-24 lg:pb-32">
                    <img
                        src="/data-analytics.jpg"
                        alt="DSSL Students"
                        className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/80 to-transparent" />

                    <div className="container relative z-10 mx-auto px-6">
                        <div className="max-w-3xl">
                            <h1 className="text-6xl md:text-8xl font-bold font-heading text-white mb-6 tracking-tight">Waitlist</h1>
                            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                                Be the first to be contacted when applications are opened
                            </p>
                        </div>
                    </div>
                </section>

                {/* Form Section */}
                <section className="py-24 px-6 bg-slate-50/50">
                    <div className="container mx-auto max-w-4xl">
                        <WaitlistForm />
                    </div>
                </section>
            </main>
        </div>
    )
}
