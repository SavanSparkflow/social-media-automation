import SEO from "../components/common/SEO";
import Navbar from "../components/Home/Navbar";
import Hero from "../components/Home/Hero";
import Features from "../components/Home/Features";
import HowItWorks from "../components/Home/HowItWorks";
import Testimonials from "../components/Home/Testimonials";
import Pricing from "../components/Home/Pricing";
import CTA from "../components/Home/CTA";
import Footer from "../components/Home/Footer";

export default function Landing() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <SEO
                title="AI Social Media Scheduler & Content Automation Tool"
                description="Automate and schedule your social media posts across Instagram, Twitter, LinkedIn, and Facebook with AI. Repurpose viral content and decode competitor strategies."
                keywords="ai social media scheduler, social media automation tool, auto post instagram, linkedin scheduler, ai caption generator, competitor analytics"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "Social Media Scheduler",
                    "url": "https://social-media-automation-bice-two.vercel.app/",
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": "https://social-media-automation-bice-two.vercel.app/features?q={search_term_string}",
                        "query-input": "required name=search_term_string"
                    }
                }}
            />
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Testimonials />
            <Pricing />
            <CTA />
            <Footer />
        </div>
    );
}

