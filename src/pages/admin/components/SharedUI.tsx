import React from 'react'

export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-24 sm:py-32">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    )
}

export function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-slate-400 p-4 text-center">
            <span className="mb-3 opacity-30 scale-125">{icon}</span>
            <p className="text-sm sm:text-base font-medium">{text}</p>
        </div>
    )
}
