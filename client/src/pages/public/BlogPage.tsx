import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogPage() {
    const posts = [
        {
            id: 1,
            title: "How to Grow Your LinkedIn Audience 3x Faster Using AI Tools in 2026",
            excerpt: "Learn how top creators are using generative AI to brainstorm engaging hooks, structure storytelling carousels, and maintain consistency without burnout.",
            date: "Oct 5, 2026",
            readTime: "5 min read",
            category: "Growth Strategy",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
        },
        {
            id: 2,
            title: "The Ultimate Guide to Cross-Platform Social Media Scheduling",
            excerpt: "Why posting the exact same message across Twitter, LinkedIn, and Instagram hurts your engagement — and how to tailor formatting effortlessly.",
            date: "Sep 28, 2026",
            readTime: "7 min read",
            category: "Automation",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
        },
        {
            id: 3,
            title: "Prompt Engineering for Marketers: Crafting High-Converting AI Copy",
            excerpt: "Master the art of giving context to LLMs like Google Gemini to generate crisp, persuasive social captions that drive actual clicks.",
            date: "Sep 15, 2026",
            readTime: "6 min read",
            category: "AI & Tech",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80",
        },
        {
            id: 4,
            title: "Why Visual Consistency Matters on Instagram & How AI Can Help",
            excerpt: "Explore how consistent color palettes, visual themes, and AI image generation can give your brand profile an instant professional upgrade.",
            date: "Sep 2, 2026",
            readTime: "4 min read",
            category: "Design",
            image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80",
        },
    ];

    return (
        <div className="py-20 px-5 sm:px-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                    Insights & Articles
                </span>
                <h1 className="text-4xl sm:text-5xl font-serif font-medium text-slate-900 mt-4 mb-4">
                    The Scheduler Blog
                </h1>
                <p className="text-base text-slate-600">
                    Tips, strategies, and deep dives on AI workflows, social growth, and marketing automation.
                </p>
            </div>

            {/* Featured Post */}
            <div className="mb-16 bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-sm">
                <img
                    src={posts[0].image}
                    alt={posts[0].title}
                    className="w-full h-64 sm:h-80 object-cover rounded-2xl"
                />
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                            {posts[0].category}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="size-3" /> {posts[0].readTime}
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-slate-900 mb-4 hover:text-red-500 cursor-pointer transition-colors">
                        {posts[0].title}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">{posts[0].excerpt}</p>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="size-3" /> {posts[0].date}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-500 cursor-pointer hover:gap-2 transition-all">
                            Read Article <ArrowRight className="size-4" />
                        </span>
                    </div>
                </div>
            </div>

            {/* Grid of Posts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.slice(1).map((post) => (
                    <div
                        key={post.id}
                        className="border border-slate-100 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    >
                        <div>
                            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[11px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                                        {post.category}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Clock className="size-3" /> {post.readTime}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-slate-900 text-lg mb-2 hover:text-red-500 cursor-pointer transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{post.excerpt}</p>
                            </div>
                        </div>

                        <div className="px-6 pb-6 pt-2 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                            <span>{post.date}</span>
                            <span className="text-red-500 font-medium inline-flex items-center gap-1 cursor-pointer">
                                Read <ArrowRight className="size-3" />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
