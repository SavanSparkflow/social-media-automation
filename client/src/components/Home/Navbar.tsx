import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 ">
                    <img src="/logo.svg" alt="logo" className="size-7" />
                    <span className="text-xl lg:text-2xl font-medium font-serif text-slate-800">Scheduler</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
                    <Link to="/features" onClick={() => window.scrollTo(0, 0)} className="hover:text-slate-900 transition-colors">
                        Features
                    </Link>
                    <Link to="/how-it-works" onClick={() => window.scrollTo(0, 0)} className="hover:text-slate-900 transition-colors">
                        How it works
                    </Link>
                    <Link to="/pricing" onClick={() => window.scrollTo(0, 0)} className="hover:text-slate-900 transition-colors">
                        Pricing
                    </Link>
                    <Link to="/blog" onClick={() => window.scrollTo(0, 0)} className="hover:text-slate-900 transition-colors">
                        Blog
                    </Link>
                </div>

                {user ? (
                    <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-sm hover:shadow-red-200 hover:shadow-md transition-all">
                        Go to Dashboard <ArrowRightIcon className="size-3.5" />
                    </Link>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900 hidden sm:block transition-colors">
                            Sign In
                        </Link>
                        <Link to="/login" className="flex items-center gap-1.5 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-sm hover:shadow-red-200 hover:shadow-md transition-all">
                            Get Started <ArrowRightIcon className="size-3.5" />
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
