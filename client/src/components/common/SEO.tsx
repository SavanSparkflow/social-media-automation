import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    canonical?: string;
    ogImage?: string;
    ogType?: "website" | "article";
    noIndex?: boolean;
    jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = "Social Media Scheduler - AI-Powered Social Automation & Growth";
const DEFAULT_DESC = "All-in-one AI-powered social media management and automation platform. Schedule posts, repurpose viral content, decode competitors, and grow across Instagram, X, LinkedIn, and Facebook.";
const DEFAULT_OG_IMAGE = "/og-image.jpg";
const BASE_URL = "https://socialscheduler.app";

function setOrCreateMeta(selector: string, attr: "name" | "property", attrValue: string, content: string) {
    let element = document.querySelector(selector) as HTMLMetaElement | null;
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, attrValue);
        document.head.appendChild(element);
    }
    element.setAttribute("content", content);
}

function setOrCreateLink(rel: string, href: string) {
    let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
    }
    element.setAttribute("href", href);
}

export default function SEO({
    title,
    description = DEFAULT_DESC,
    keywords = "social media scheduler, ai social media automation, content repurposer, competitor decoder",
    canonical,
    ogImage = DEFAULT_OG_IMAGE,
    ogType = "website",
    noIndex = false,
    jsonLd,
}: SEOProps) {
    const location = useLocation();
    const fullTitle = title ? `${title} | Social Media Scheduler` : DEFAULT_TITLE;
    const pageUrl = canonical || `${BASE_URL}${location.pathname}`;
    const fullOgImage = ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`;

    useEffect(() => {
        // Document Title
        document.title = fullTitle;

        // Standard Meta Tags
        setOrCreateMeta('meta[name="description"]', "name", "description", description);
        setOrCreateMeta('meta[name="keywords"]', "name", "keywords", keywords);
        setOrCreateMeta('meta[name="robots"]', "name", "robots", noIndex ? "noindex, nofollow" : "index, follow");

        // Open Graph
        setOrCreateMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
        setOrCreateMeta('meta[property="og:description"]', "property", "og:description", description);
        setOrCreateMeta('meta[property="og:type"]', "property", "og:type", ogType);
        setOrCreateMeta('meta[property="og:url"]', "property", "og:url", pageUrl);
        setOrCreateMeta('meta[property="og:image"]', "property", "og:image", fullOgImage);

        // Twitter
        setOrCreateMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
        setOrCreateMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
        setOrCreateMeta('meta[name="twitter:image"]', "name", "twitter:image", fullOgImage);

        // Canonical
        setOrCreateLink("canonical", pageUrl);

        // Structured Data (JSON-LD)
        const scriptId = "seo-json-ld";
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
            existingScript.remove();
        }

        if (jsonLd) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.type = "application/ld+json";
            script.text = JSON.stringify(jsonLd);
            document.head.appendChild(script);
        }

        return () => {
            const dynamicScript = document.getElementById(scriptId);
            if (dynamicScript) {
                dynamicScript.remove();
            }
        };
    }, [fullTitle, description, keywords, pageUrl, fullOgImage, ogType, noIndex, jsonLd]);

    // React 19 native head element hoisting support
    return (
        <>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
            <link rel="canonical" href={pageUrl} />
        </>
    );
}
