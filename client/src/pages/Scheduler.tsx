import React, { useEffect, useState } from "react"
import { PLATFORMS } from "../assets/assets";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  EditIcon,
  Loader2Icon,
  RotateCwIcon,
  SendIcon,
  Trash2Icon,
  XIcon,
  ZapIcon
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const PLATFORM_LIMITS: Record<string, { name: string; limit: number }> = {
  twitter: { name: "X (Twitter)", limit: 280 },
  instagram: { name: "Instagram", limit: 2200 },
  linkedin: { name: "LinkedIn", limit: 3000 },
  facebook: { name: "Facebook", limit: 63206 },
};

const Scheduler = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [existingMediaUrl, setExistingMediaUrl] = useState<string | null>(null);
  const [removeMedia, setRemoveMedia] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit post state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Publishing / Retrying state for individual post buttons
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const { data } = await api.get("/api/posts");
      setPosts(data);
    } catch (error: any) {
      if (!silent) {
        toast.error(error.response?.data?.message || error?.message || "Failed to fetch posts");
      }
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Auto-poll every 5 seconds to sync status in real time when scheduled posts publish
    const interval = setInterval(() => {
      fetchPosts(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const scheduled = posts.filter((p) => p.status === "scheduled");
  const published = posts.filter((p) => p.status === "published");
  const failed = posts.filter((p) => p.status === "failed");

  // Calculate dynamic character limit based on selected platforms
  const getSmallestLimit = () => {
    if (selectedPlatform.length === 0) return { name: "Default", limit: 280 };
    let smallest = { name: "Default", limit: 63206 };
    for (const p of selectedPlatform) {
      if (PLATFORM_LIMITS[p] && PLATFORM_LIMITS[p].limit < smallest.limit) {
        smallest = PLATFORM_LIMITS[p];
      }
    }
    return smallest;
  };

  const activeLimitInfo = getSmallestLimit();
  const isOverLimit = content.length > activeLimitInfo.limit;

  const togglePlatform = (id: string) => {
    setSelectedPlatform((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleEditClick = (post: any) => {
    setEditingPostId(post._id);
    setContent(post.content || "");
    setSelectedPlatform(post.platforms || []);
    setExistingMediaUrl(post.mediaUrl || null);
    setMediaFile(null);
    setRemoveMedia(false);

    if (post.scheduledFor) {
      const d = new Date(post.scheduledFor);
      const dateStr = d.toISOString().split("T")[0];
      const timeStr = d.toTimeString().slice(0, 5);
      setScheduleDate(dateStr);
      setScheduleTime(timeStr);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setContent("");
    setScheduleDate("");
    setScheduleTime("");
    setSelectedPlatform([]);
    setMediaFile(null);
    setExistingMediaUrl(null);
    setRemoveMedia(false);
  };

  const handleScheduleOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlatform.length === 0) {
      toast.error("Select at least one platform");
      return;
    }
    if (!scheduleDate || !scheduleTime) {
      toast.error("Select both date and time");
      return;
    }
    if (selectedPlatform.includes("instagram") && !mediaFile && !existingMediaUrl) {
      toast.error("Instagram requires an image or video");
      return;
    }

    const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();

    const formData = new FormData();
    formData.append("platforms", JSON.stringify(selectedPlatform));
    formData.append("content", content);
    formData.append("scheduledFor", scheduledFor);

    if (mediaFile) {
      formData.append("media", mediaFile);
    }
    if (removeMedia) {
      formData.append("removeMedia", "true");
    }

    setLoading(true);
    try {
      if (editingPostId) {
        await api.put(`/api/posts/${editingPostId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Post updated successfully");
      } else {
        await api.post("/api/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Post scheduled successfully");
      }

      handleCancelEdit();
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error?.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this scheduled post?")) return;
    try {
      await api.delete(`/api/posts/${id}`);
      toast.success("Post deleted successfully");
      if (editingPostId === id) handleCancelEdit();
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error?.message || "Failed to delete post");
    }
  };

  const handlePublishNow = async (id: string) => {
    setActionLoadingId(id);
    try {
      await api.post(`/api/posts/${id}/publish-now`);
      toast.success("Post published successfully!");
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error?.message || "Failed to publish post");
      fetchPosts();
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full pb-16">
      {/* Compose / Edit panel */}
      <div className="w-full lg:w-[460px] shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">
              {editingPostId ? "Edit Scheduled Post" : "Compose Post"}
            </h2>
            {editingPostId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded bg-red-50"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form className="space-y-5" onSubmit={handleScheduleOrUpdate}>
            {/* Platforms */}
            <div>
              <label className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                Target Platforms
              </label>
              <div className="flex flex-wrap gap-2.5">
                {PLATFORMS.map((p) => {
                  const active = selectedPlatform.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                        active
                          ? "bg-red-500 border-red-500 text-white shadow-xs"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <p.icon className="size-4" />
                      <span>{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content & Character Counter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Post Content
                </label>
                <div
                  className={`text-xs font-medium ${
                    isOverLimit ? "text-red-600 font-bold" : "text-slate-400"
                  }`}
                >
                  {content.length} / {activeLimitInfo.limit} chars ({activeLimitInfo.name})
                </div>
              </div>

              <textarea
                required
                rows={5}
                placeholder="What do you want to share today? Add hashtags and mentions..."
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder-slate-400 outline-none resize-none transition ${
                  isOverLimit
                    ? "border-red-400 focus:border-red-500 bg-red-50/20"
                    : "border-slate-200 focus:border-red-500 focus:bg-white"
                }`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {isOverLimit && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600">
                  <AlertCircleIcon className="size-3.5 shrink-0" />
                  <span>Content exceeds character limit for {activeLimitInfo.name}.</span>
                </div>
              )}
            </div>

            {/* Media Upload with Rich Preview */}
            <div>
              <label className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                Media Attachment (optional)
              </label>

              {mediaFile ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  {mediaFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(mediaFile)}
                      alt="preview"
                      className="w-full h-44 object-cover"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(mediaFile)}
                      className="w-full h-44 object-cover"
                      controls
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setMediaFile(null)}
                    className="absolute top-2 right-2 size-8 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                    title="Remove selected file"
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              ) : existingMediaUrl && !removeMedia ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img
                    src={existingMediaUrl}
                    alt="existing media"
                    className="w-full h-44 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setRemoveMedia(true)}
                    className="absolute top-2 right-2 size-8 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                    title="Remove current media"
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-red-300 hover:bg-red-50/20 transition-all group">
                  <span className="text-xs font-medium text-slate-600 group-hover:text-red-600 transition-colors">
                    Click to upload image or video
                  </span>
                  <span className="text-[11px] text-slate-400">PNG, JPG, MP4 up to 50MB</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setMediaFile(e.target.files[0]);
                        setRemoveMedia(false);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                  Publish Date
                </label>
                <div className="relative">
                  <CalendarIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-red-500 outline-none transition"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                  Publish Time
                </label>
                <div className="relative">
                  <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="time"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-red-500 outline-none transition"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 transition-all text-white rounded-xl text-sm font-medium shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  {editingPostId ? "Updating Post..." : "Scheduling Post..."}
                </>
              ) : (
                <>
                  {editingPostId ? "Save Changes" : "Schedule Post"}
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Post Queues & Lists */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Failed Posts Alert Section */}
        {failed.length > 0 && (
          <div className="bg-red-50/70 border border-red-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
                <AlertCircleIcon className="size-4.5" />
                <span>Failed to Publish ({failed.length})</span>
              </div>
              <span className="text-xs text-red-500">Check error details and retry</span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {failed.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-xl border border-red-100 p-4 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5 items-center">
                      {post.platforms.map((pl: string) => {
                        const meta = PLATFORMS.find((p) => p.id === pl);
                        return meta ? (
                          <meta.icon key={pl} className="size-3.5 text-slate-500" />
                        ) : null;
                      })}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(post.scheduledFor).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 line-clamp-2">{post.content}</p>

                  {post.errorMessage && (
                    <div className="text-[11px] bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 font-mono">
                      Error: {post.errorMessage}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handlePublishNow(post._id)}
                      disabled={actionLoadingId === post._id}
                      className="flex items-center gap-1.5 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition disabled:opacity-50"
                    >
                      {actionLoadingId === post._id ? (
                        <Loader2Icon className="size-3 animate-spin" />
                      ) : (
                        <RotateCwIcon className="size-3" />
                      )}
                      Retry Now
                    </button>
                    <button
                      onClick={() => handleEditClick(post)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                      title="Edit Post"
                    >
                      <EditIcon className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete Post"
                    >
                      <Trash2Icon className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Posts Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <CalendarDaysIcon className="size-4 text-slate-600" />
            <h3 className="text-slate-900 text-sm font-semibold">Scheduled Queue</h3>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchPosts(false)}
                title="Refresh posts"
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition"
              >
                <RotateCwIcon className={`size-3.5 ${isRefreshing ? "animate-spin text-red-500" : ""}`} />
              </button>
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                {scheduled.length}
              </span>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {scheduled.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No upcoming posts scheduled yet.
              </div>
            ) : (
              scheduled.map((post) => (
                <div key={post._id} className="p-5 hover:bg-slate-50/60 transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5 items-center">
                      {post.platforms.map((pl: string) => {
                        const meta = PLATFORMS.find((p) => p.id === pl);
                        return meta ? (
                          <meta.icon key={pl} className="size-3.5 text-slate-500" />
                        ) : null;
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      {post.mediaType && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded uppercase font-semibold">
                          {post.mediaType}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {new Date(post.scheduledFor).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 line-clamp-2">{post.content}</p>

                  {post.mediaUrl && (
                    <div className="size-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                      <img
                        src={post.mediaUrl}
                        alt="media preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Actions: Publish Now, Edit, Delete */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                    <button
                      onClick={() => handlePublishNow(post._id)}
                      disabled={actionLoadingId === post._id}
                      className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 py-1 transition disabled:opacity-50"
                    >
                      {actionLoadingId === post._id ? (
                        <Loader2Icon className="size-3 animate-spin" />
                      ) : (
                        <ZapIcon className="size-3" />
                      )}
                      Publish Now
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(post)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                        title="Edit Scheduled Post"
                      >
                        <EditIcon className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Cancel / Delete Post"
                      >
                        <Trash2Icon className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Published Posts History */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <SendIcon className="size-4 text-slate-600" />
            <h3 className="text-slate-900 text-sm font-semibold">Published History</h3>
            <span className="ml-auto text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full">
              {published.length}
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {published.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No posts published yet.
              </div>
            ) : (
              published.map((post) => (
                <div key={post._id} className="p-5 hover:bg-slate-50/60 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5 items-center">
                      {post.platforms.map((pl: string) => {
                        const meta = PLATFORMS.find((p) => p.id === pl);
                        return meta ? (
                          <meta.icon key={pl} className="size-3.5 text-slate-500" />
                        ) : null;
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        {new Date(post.updatedAt || post.createdAt).toLocaleString()}
                      </span>
                      <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-medium">
                        Published
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{post.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;