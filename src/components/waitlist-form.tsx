"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const formSchema = z.object({
    firstName: z.string().min(2, {
        message: "First name is required.",
    }),
    lastName: z.string().min(2, {
        message: "Last name is required.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
        message: "Please enter a valid phone number.",
    }),
    location: z.string().min(2, {
        message: "Location is required.",
    }),
    program: z.string({
        required_error: "Please select a program.",
    }),
    referral: z.string({
        required_error: "Please tell us how you heard about us.",
    }),
})

type FormValues = z.infer<typeof formSchema>

interface WaitlistFormProps {
    defaultProgram?: string
    onSuccess?: () => void
}

const STEPS = [
    { id: 1, name: "firstName", label: "First Name" },
    { id: 2, name: "lastName", label: "Last Name" },
    { id: 3, name: "email", label: "Email Address" },
    { id: 4, name: "phone", label: "Phone/Mobile" },
    { id: 5, name: "location", label: "Location" },
    { id: 6, name: "program", label: "Program of Interest" },
    { id: 7, name: "referral", label: "How did you hear about us?" },
]

export function WaitlistForm({ defaultProgram, onSuccess }: WaitlistFormProps) {
    const [step, setStep] = useState(1);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            program: defaultProgram || "",
            location: "",
            referral: "",
        },
    })

    const watchAllFields = form.watch();
    const filledFields = Object.values(watchAllFields).filter(val => val !== "" && val !== undefined).length;
    const percentage = Math.round((filledFields / STEPS.length) * 100);

    async function nextStep() {
        const currentFieldName = STEPS[step - 1].name as keyof FormValues;
        const isValid = await form.trigger(currentFieldName);
        if (isValid) {
            setStep(s => Math.min(s + 1, STEPS.length));
        }
    }

    function prevStep() {
        setStep(s => Math.max(s - 1, 1));
    }

    function onSubmit(values: FormValues) {
        console.log(values)
        toast.success("Successfully joined the waitlist!", {
            description: "We'll notify you when the next cohort opens.",
        })
        if (onSuccess) onSuccess()
    }

    const inputClasses = "border-0 border-b border-slate-900 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-slate-900 transition-colors text-xl sm:text-2xl md:text-3xl lg:text-4xl h-12 sm:h-16 md:h-24 pb-2 sm:pb-4 placeholder:text-slate-300 font-medium w-full"
    const labelClasses = "text-[#ff4d6d] font-bold text-lg sm:text-xl md:text-2xl flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4"

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-[400px] flex flex-col justify-center relative max-w-3xl mx-auto pb-32">
                <div className="flex-1 py-8 sm:py-12">
                    {step === 1 && (
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <FormLabel className={labelClasses}>
                                        <span className="text-black font-medium text-base">1 &rarr;</span> First Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Your First Name"
                                            {...field}
                                            className={inputClasses}
                                            autoFocus
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), nextStep())}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-lg" />
                                </FormItem>
                            )}
                        />
                    )}

                    {step === 2 && (
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <FormLabel className={labelClasses}>
                                        <span className="text-black font-medium text-base">2 &rarr;</span> Last Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Your Last Name"
                                            {...field}
                                            className={inputClasses}
                                            autoFocus
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), nextStep())}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-lg" />
                                </FormItem>
                            )}
                        />
                    )}

                    {step === 3 && (
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <FormLabel className={labelClasses}>
                                        <span className="text-black font-medium text-base">3 &rarr;</span> Email Address <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Your Email"
                                            type="email"
                                            {...field}
                                            className={inputClasses}
                                            autoFocus
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), nextStep())}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-lg" />
                                </FormItem>
                            )}
                        />
                    )}

                    {step === 4 && (
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <FormLabel className={labelClasses}>
                                        <span className="text-black font-medium text-base">4 &rarr;</span> Phone/Mobile <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Your Phone Number"
                                            {...field}
                                            className={inputClasses}
                                            autoFocus
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), nextStep())}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-lg" />
                                </FormItem>
                            )}
                        />
                    )}

                    {step === 5 && (
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <FormLabel className={labelClasses}>
                                        <span className="text-black font-medium text-base">5 &rarr;</span> Location <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Freetown, Sierra Leone"
                                            {...field}
                                            className={inputClasses}
                                            autoFocus
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), nextStep())}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-lg" />
                                </FormItem>
                            )}
                        />
                    )}

                    {step === 6 && (
                        <FormField
                            control={form.control}
                            name="program"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <FormLabel className={labelClasses}>
                                        <span className="text-black font-medium text-base">6 &rarr;</span> Program of Interest <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select onValueChange={(val) => { field.onChange(val); nextStep(); }} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className={inputClasses}>
                                                <SelectValue placeholder="Select a program" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                                            <SelectItem value="Data Science">Data Science</SelectItem>
                                            <SelectItem value="Data Engineering">Data Engineering</SelectItem>
                                            <SelectItem value="AI for Business Leaders">AI for Business Leaders</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-lg" />
                                </FormItem>
                            )}
                        />
                    )}

                    {step === 7 && (
                        <FormField
                            control={form.control}
                            name="referral"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <FormLabel className={labelClasses}>
                                        <span className="text-black font-medium text-base">7 &rarr;</span> How did you hear about us? <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className={inputClasses}>
                                                <SelectValue placeholder="Select an option" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Social Media">Social Media</SelectItem>
                                            <SelectItem value="Referral">Friend or Colleague</SelectItem>
                                            <SelectItem value="Website">Website</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-lg" />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                <div className="flex items-center gap-6 pt-12">
                    {step < STEPS.length ? (
                        <Button
                            type="button"
                            onClick={nextStep}
                            className="px-8 sm:px-12 bg-black hover:bg-black/90 text-white font-bold h-12 sm:h-14 md:h-16 rounded-md border-none text-lg sm:text-xl transition-all flex items-center gap-2 sm:gap-4"
                        >
                            Next <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="px-8 sm:px-12 bg-[#ff4d6d] hover:bg-[#ff4d6d]/90 text-white font-bold h-12 sm:h-14 md:h-16 rounded-md border-none text-lg sm:text-xl transition-all shadow-lg shadow-pink-200"
                        >
                            Submit
                        </Button>
                    )}

                    {step > 1 && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={prevStep}
                            className="text-slate-500 hover:text-black hover:bg-transparent px-4 font-medium"
                        >
                            Back
                        </Button>
                    )}
                </div>

                {/* Progress Bar (Bottom Right) */}
                {/* Progress Bar (Bottom Docked on Mobile, Floating on Desktop) */}
                <div className="fixed bottom-0 left-0 right-0 sm:left-auto sm:right-12 sm:bottom-12 z-50 flex flex-col items-center sm:items-end gap-3 bg-white/95 backdrop-blur-md p-4 sm:p-6 sm:rounded-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] sm:shadow-2xl border-t sm:border border-slate-100 ring-0 sm:ring-1 sm:ring-black/5">
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
                        <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{step} of {STEPS.length} <span className="hidden sm:inline">Questions</span></span>
                            <span className="text-sm sm:text-lg font-bold text-[#0a1128]">{percentage}% <span className="hidden sm:inline">completed</span></span>
                        </div>
                        <div className="h-2 w-24 sm:w-32 bg-slate-100 rounded-full overflow-hidden shrink-0">
                            <div
                                className="h-full bg-gradient-to-r from-[#ff4d6d] to-[#ff4d6d] transition-all duration-700 ease-out"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <div className="flex gap-1 shrink-0">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={step === 1}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-400 transition-all"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={nextStep}
                                disabled={step === STEPS.length}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-400 transition-all"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}

