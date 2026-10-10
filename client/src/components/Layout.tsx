import { useState } from 'react'
import Sidebar from './Sidebar'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { MenuIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import SEO from './common/SEO'

const pageTitles: Record<string, string> = {
    "/": "Home",
    "/dashboard": "Dashboard",
    "/accounts": "Connected Accounts",
    "/schedule": "Schedule Posts",
    "/ai-composer": "AI Post Composer",
    "/repurpose": "Content Repurposer",
    "/campaign": "Campaign Planner",
    "/competitor-decoder": "Competitor Decoder",
    "/lead-magnets": "Lead Magnet Studio",
    "/settings": "Account & API Settings"
}

const Layout = () => {

    const{isAuthenticated, isLoading} = useAuth();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const location = useLocation()

    const title = pageTitles[location.pathname] || "SocialAI";

    if(isLoading) {
        return (
            <div className='flex h-screen items-center justify-center bg-slate-50'>
                <div className='size-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin' />
            </div>
        )
    }

    if(!isAuthenticated) {
        return <Navigate to={"/login"} replace />
    }


    return (
        <div className='flex h-screen bg-slate-50'>
            <SEO title={title} noIndex={true} />

            {/* Mobile Overlay */}
            {isMobileMenuOpen && <div className='fixed inset-0 bg-slate-900/50 z-40 md:hidden' onClick={() => setIsMobileMenuOpen(false)} />}

            <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

            <div className='flex-1 flex flex-col overflow-hidden'>
                {/* Top bar */}
                <header className='h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-8 gap-4'>

                    <button className='md:hidden p-2 -ml-2 text-slate-500' onClick={() => setIsMobileMenuOpen(true)}>
                        <MenuIcon className='size-6' />
                    </button>
                    <div>
                        <h1 className='text-slate-900'>{title}</h1>
                        <p className='text-sm text-slate-400 hidden sm:block'>Manage and automate your social presence</p>
                    </div>

                </header>
                <main className='flex-1 overflow-auto p-4 sm:p-6 md:p-8 xl:p-12'>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Layout