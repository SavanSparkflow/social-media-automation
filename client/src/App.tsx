import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts.tsx";
import Scheduler from "./pages/Scheduler";
import AIComposer from "./pages/AIComposer";
import Settings from "./pages/Settings";
import ContentRepurposer from "./pages/ContentRepurposer";
import CampaignPlanner from "./pages/CampaignPlanner";
import CompetitorDecoder from "./pages/CompetitorDecoder";
import LeadMagnetStudio from "./pages/LeadMagnetStudio";
import { Toaster } from "react-hot-toast";

// Public Informational Pages
import PublicLayout from "./components/Home/PublicLayout";
import FeaturesPage from "./pages/public/FeaturesPage";
import HowItWorksPage from "./pages/public/HowItWorksPage";
import PricingPage from "./pages/public/PricingPage";
import ChangelogPage from "./pages/public/ChangelogPage";
import AboutPage from "./pages/public/AboutPage";
import BlogPage from "./pages/public/BlogPage";
import CareersPage from "./pages/public/CareersPage";
import PressPage from "./pages/public/PressPage";
import PrivacyPage from "./pages/public/PrivacyPage";
import TermsPage from "./pages/public/TermsPage";
import SecurityPage from "./pages/public/SecurityPage";
import CookiesPage from "./pages/public/CookiesPage";

export default function App() {
    return (
        <>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                {/* Public / Marketing / Legal Pages */}
                <Route element={<PublicLayout />}>
                    {/* Product */}
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/changelog" element={<ChangelogPage />} />

                    {/* Company */}
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/careers" element={<CareersPage />} />
                    <Route path="/press" element={<PressPage />} />

                    {/* Legal */}
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/security" element={<SecurityPage />} />
                    <Route path="/cookies" element={<CookiesPage />} />
                </Route>

                {/* Authenticated Dashboard Area */}
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/schedule" element={<Scheduler />} />
                    <Route path="/ai-composer" element={<AIComposer />} />
                    <Route path="/repurpose" element={<ContentRepurposer />} />
                    <Route path="/campaign" element={<CampaignPlanner />} />
                    <Route path="/competitor-decoder" element={<CompetitorDecoder />} />
                    <Route path="/lead-magnets" element={<LeadMagnetStudio />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </>
    );
}
