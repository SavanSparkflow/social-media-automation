import { useEffect, useState } from "react"
import { PLATFORMS } from "../assets/assets";
import { ArrowRightIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, HistoryIcon, Loader2Icon, TimerIcon, Wand2Icon, XIcon } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import AICreditBadge from "../components/AICreditBadge";


const AIComposer = () => {
  const { refreshCredits } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generateImage, setGenerateImage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generations, setGenerations] = useState<any[]>([]);

  // Scheduling state
  const [activeScheduler, setActiveScheduler] = useState<any>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduling, setScheduling] = useState(false);

  // Filter & Pagination state
  const [selectedToneFilter, setSelectedToneFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchGenerations = async () => {
    try {
      const { data } = await api.get("/api/posts/generations");
      setGenerations(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error?.message || "Failed to fetch generations");
    }
  }

  useEffect(() => {
    fetchGenerations()
  }, [])

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error("Enter a prompt");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/api/posts/generate", {
        prompt,
        tone,
        generateImage
      })
      setGenerations([data.generation, ...generations])
      setActiveScheduler(data.generation);
      setPrompt("");
      toast.success("Content generated successfully");
      refreshCredits();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error?.message || "Failed to generate content");
      refreshCredits();
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteGeneration = async (id: string) => {
    try {
      await api.delete(`/api/posts/generations/${id}`);
      fetchGenerations();
      toast.success("Generation deleted successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error?.message || "Failed to delete generation");
    }
  }

  const handleSchedule = async () => {
    if (!activeScheduler) return;
    if (selectedPlatform.length === 0) {
      toast.error("Select atleast one platform")
      return;
    }
    if (!scheduleDate || !scheduleTime) {
      toast.error("Select a valid date and time");
      return;
    }

    const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
    setScheduling(true);
    try {
      await api.post("/api/posts", {
        content: activeScheduler.content,
        mediaUrl: activeScheduler.mediaUrl,
        mediaType: activeScheduler.mediaType,
        platforms: selectedPlatform,
        scheduledFor,
        status: "scheduled"
      })

      toast.success("AI Generated Post Scheduled successfully");
      setActiveScheduler(null);
      setScheduleDate("");
      setScheduleTime("");
      setSelectedPlatform([]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error?.message || "Failed to schedule post");
    } finally {
      setScheduling(false);
    }
  }

  const tones = ["Professional", "Creative", "Funny", "Minimalist", "Excited"];

  // Filtered and Paginated Generations
  const filteredGenerations = selectedToneFilter === "All"
    ? generations
    : generations.filter((g) => g.tone?.toLowerCase() === selectedToneFilter.toLowerCase());

  const totalPages = Math.ceil(filteredGenerations.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedGenerations = filteredGenerations.slice(startIndex, startIndex + pageSize);


  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Input Section */}
      <div className="space-y-6 text-center mt-12">
        <AICreditBadge />
        <h1 className="text-3xl text-slate-700 tracking-tight">What should we create today?</h1>
        <div className="relative group mt-12">
          <textarea className="w-full px-6 py-6 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 transition resize-none h-40" placeholder="Share your idea... (e.g. A post about the launch of our new eco-friendly coffee beans)" value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>
          <div className="absolute bottom-4 right-2.5 flex items-center gap-3 text-sm">
            <button onClick={() => setGenerateImage(!generateImage)} className="flex items-center gap-3 bg-red-50 py-2 px-3 rounded-lg">
              <span>AI Image</span>
              <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${generateImage ? "bg-red-500" : "bg-slate-200"}`}>
                <span className={`pointer-events-none size-4 transform translate-y-0.5 rounded-full bg-white transition ${generateImage ? "translate-x-4.5" : "translate-x-0.5"}`} />
              </div>
            </button>
            <button onClick={handleGenerate} disabled={loading} className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 px-4 py-2 rounded-lg">
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : <>
                Generate
                <ArrowRightIcon className="size-4" />
              </>}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {tones.map((t) => (
            <button key={t} onClick={() => setTone(t)} className={`px-4 py-1.5 rounded-full text-sm transition-all border ${tone === t ? "bg-red-500 border-red-500 text-white" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {/* AI Generated Posts */}
      <div className="space-y-6 pt-12 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-600">
          <div className="flex items-center gap-2">
            <HistoryIcon className="size-5" />
            <h2 className="text-xl">Recent Generations</h2>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
              {filteredGenerations.length} total
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:border-red-500 transition cursor-pointer font-medium"
            >
              {[10, 15, 20, 30, 40].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tone Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {["All", ...tones].map((t) => {
            const count =
              t === "All"
                ? generations.length
                : generations.filter((g) => g.tone?.toLowerCase() === t.toLowerCase()).length;
            const isSelected = selectedToneFilter === t;
            return (
              <button
                key={t}
                onClick={() => {
                  setSelectedToneFilter(t);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? "bg-red-500 border-red-500 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <span>{t}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid of Generations */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedGenerations.map((gen) => (
            <div key={gen._id} className="group bg-white rounded-2xl border border-slate-100 p-5 hover:border-red-200 transition-all relative overflow-hidden">
              <div className="flex flex-col h-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 uppercase tracking-widest">
                    {new Date(gen.createdAt).toLocaleString()}
                  </span>
                  <span className="text-sm text-red-500 bg-red-50 px-2 py-0.5 rounded-md">{gen.tone}</span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed flex-1">{gen.content}</p>
                {gen.mediaUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-50 bg-slate-50">
                    <img src={gen.mediaUrl} alt="Gen" className="w-full aspect-video object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button onClick={() => setActiveScheduler(gen)} className="flex-1 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 text-xs py-2.5 rounded-lg transition-all">
                    Schedule Post
                  </button>
                  <button onClick={() => handleDeleteGeneration(gen._id)} className="p-2.5 bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 rounded-lg transition-all" title="Delete Generation">
                    <XIcon className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredGenerations.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-2">
              <div className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                <Wand2Icon className="size-6" />
              </div>
              <p className="text-slate-400 text-sm">
                {generations.length === 0
                  ? "No content generated yet. Try generating some content using the AI."
                  : `No generations found with the "${selectedToneFilter}" tone.`}
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredGenerations.length > pageSize && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 text-sm text-slate-500">
            <div>
              Showing <span className="font-medium text-slate-700">{startIndex + 1}</span> to{" "}
              <span className="font-medium text-slate-700">{Math.min(startIndex + pageSize, filteredGenerations.length)}</span> of{" "}
              <span className="font-medium text-slate-700">{filteredGenerations.length}</span> generations
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Previous Page"
              >
                <ChevronLeftIcon className="size-4 text-slate-600" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`size-8 text-xs rounded-lg font-medium transition ${
                    currentPage === page
                      ? "bg-red-500 text-white shadow-sm"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Next Page"
              >
                <ChevronRightIcon className="size-4 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Scheduler Modal */}
      {activeScheduler && (
        <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 bg-slate-50/30">
              <h3 className="text-slate-900">Schedule Generation</h3>
              <button onClick={() => setActiveScheduler(null)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                <XIcon className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {activeScheduler.prompt}
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {activeScheduler.content}
                  {activeScheduler.mediaUrl && <img src={activeScheduler.mediaUrl} alt="preview" className="w-full aspect-video object-cover rounded-xl border border-slate-200 shadow-sm" />}
                </p>
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 border-t border-slate-50 space-y-8">
              {/* Options */}
              <div className="space-y-8">
                <div>
                  <label className="block text-xs text-slate-600 uppercase tracking-widest mb-4">Select Channels</label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => {
                      const active = selectedPlatform.includes(p.id);
                      return (
                        <button key={p.id} onClick={() => setSelectedPlatform((prev) => (prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]))} className={`p-2.5 rounded-md border text-xs ${active ? "bg-red-500/80 text-white" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"}`}>
                          <p.icon className="size-4.5" />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <CalendarIcon className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="date" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-md text-slate-900 text-sm focus:outline-none transition-all" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                  </div>
                  <div className="relative">
                    <ClockIcon className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="time" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-md text-slate-900 text-sm focus:outline-none transition-all" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                  </div>
                </div>
              </div>
              <button onClick={handleSchedule} className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-slate-200 text-slate-700 hover:bg-red-500 hover:text-white transition">
                {scheduling ? <Loader2Icon className="size-4 animate-spin" /> : <TimerIcon className="size-3" />}
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIComposer