import { Outlet } from 'react-router-dom'
import { SiteHeader } from './site-header'
import { SiteFooter } from './site-footer'
import { WhatsAppButton } from './whatsapp-button'

export function Layout() {
    return (
        <>
            <SiteHeader />
            <main className="min-h-screen">
                <Outlet />
            </main>
            <WhatsAppButton />
            <SiteFooter />
        </>
    )
}
