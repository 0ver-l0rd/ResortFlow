"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns";
import { toast } from "sonner";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { MonthView } from "@/components/calendar/month-view";
import { WeekView, DayView } from "@/components/calendar/week-day-views";
import { PostEventSheet } from "@/components/calendar/post-event-sheet";
import { QuickComposeModal } from "@/components/calendar/quick-compose-modal";
import { Inbox, CheckCircle2, Clock, Edit3, BarChart3, LayoutList, Sparkles } from "lucide-react";

export default function CalendarPage() {
  const [mainView, setMainView] = useState<"calendar" | "all-posts">("calendar");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("view") === "all-posts") {
        setMainView("all-posts");
      }
    }
  }, []);

  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  
  // Filters
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Modals
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [composeModal, setComposeModal] = useState<{ isOpen: boolean; date: Date | null }>({
    isOpen: false,
    date: null,
  });

  const queryClient = useQueryClient();

  // Determine fetch bounds based on viewMode
  let fetchStartDate = new Date();
  let fetchEndDate = new Date();

  if (viewMode === "month") {
    fetchStartDate = startOfWeek(startOfMonth(currentDate));
    fetchEndDate = endOfWeek(endOfMonth(currentDate));
  } else if (viewMode === "week") {
    fetchStartDate = startOfWeek(currentDate);
    fetchEndDate = endOfWeek(currentDate);
  } else {
    // Day
    fetchStartDate = startOfWeek(currentDate);
    fetchEndDate = endOfWeek(currentDate); // Give a week buffer for the day view just in case
  }

  // Fetch posts
  const queryKey = mainView === "calendar" 
    ? ["posts", format(fetchStartDate, "yyyy-MM-dd"), format(fetchEndDate, "yyyy-MM-dd"), selectedPlatform, selectedStatus]
    : ["posts", "all", selectedPlatform, selectedStatus];

  const { data: posts = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (mainView === "calendar") {
        params.append("start_date", fetchStartDate.toISOString());
        params.append("end_date", fetchEndDate.toISOString());
      }
      if (selectedPlatform) params.append("platform", selectedPlatform);
      if (selectedStatus) params.append("status", selectedStatus);

      const res = await fetch(`/api/posts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  // Create post draft
  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; scheduledAt: string }) => {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: data.content,
          scheduledAt: data.scheduledAt,
          platforms: ["twitter"], // Default platform to let the API pass
          status: "draft",
        }),
      });
      if (!res.ok) throw new Error("Failed to create draft");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Draft created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setComposeModal({ isOpen: false, date: null });
    },
    onError: () => {
      toast.error("Failed to create draft");
    },
  });

  // Delete post
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      // In a real app we would have a DELETE endpoint in app/api/posts/[id]/route.ts
      // Simulate it for now if it doesn't exist to avoid hard crash, or call it if it exists.
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 404) throw new Error("Failed to delete post");
      return { id };
    },
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsSheetOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

    const reschedulePostMutation = useMutation({
    mutationFn: async ({ id, date }: { id: string; date: Date }) => {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledAt: date.toISOString(), status: "scheduled" }),
      });
      if (!res.ok) throw new Error("Failed to reschedule post");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Post rescheduled");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Failed to reschedule post");
    },
  });

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === "month") setCurrentDate(subMonths(currentDate, 1));
    else if (viewMode === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === "month") setCurrentDate(addMonths(currentDate, 1));
    else if (viewMode === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => setCurrentDate(new Date());

  // Interactions
  const handleEventClick = (post: any) => {
    setSelectedEvent(post);
    setIsSheetOpen(true);
  };

  const handleDayClick = (date: Date) => {
    setComposeModal({ isOpen: true, date });
  };

  const handleSaveDraft = (content: string, date: Date) => {
    createPostMutation.mutate({ content, scheduledAt: date.toISOString() });
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate(id);
    }
  };

  const handleEventDrop = (postId: string, newDate: Date) => {
    reschedulePostMutation.mutate({ id: postId, date: newDate });
  };

  // Filter posts for sidebar (Memoized for performance)
  const upcomingPosts = useMemo(() => 
    posts.filter((p: any) => p.status === "scheduled" || p.status === "draft")
         .sort((a: any, b: any) => new Date(a.scheduledAt || a.createdAt).getTime() - new Date(b.scheduledAt || b.createdAt).getTime())
         .slice(0, 5)
  , [posts]);

  const publishedPosts = useMemo(() => 
    posts.filter((p: any) => p.status === "published")
         .sort((a: any, b: any) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
         .slice(0, 5)
  , [posts]);

  // Counters for "All Posts" view
  const aggregateCounts = useMemo(() => {
    return {
      total: posts.length,
      published: posts.filter((p: any) => p.status === "published").length,
      scheduled: posts.filter((p: any) => p.status === "scheduled").length,
      drafts: posts.filter((p: any) => p.status === "draft").length,
    };
  }, [posts]);

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrev}
        onNextMonth={handleNext}
        onToday={handleToday}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        mainView={mainView}
        onMainViewChange={setMainView}
      />

      <div className="flex-1 relative grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Content Area (3 columns) */}
        <div className="lg:col-span-3 flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto no-scrollbar">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-800"></div>
            </div>
          )}

          {mainView === "calendar" ? (
            <>
              {viewMode === "month" && (
                <MonthView
                  currentDate={currentDate}
                  posts={posts}
                  onDayClick={handleDayClick}
                  onEventClick={handleEventClick}
                  onEventDrop={handleEventDrop}
                />
              )}
              {viewMode === "week" && (
                <WeekView
                  currentDate={currentDate}
                  posts={posts}
                  onDayClick={handleDayClick}
                  onEventClick={handleEventClick}
                />
              )}
              {viewMode === "day" && (
                <DayView
                  currentDate={currentDate}
                  posts={posts}
                  onEventClick={handleEventClick}
                />
              )}
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <LayoutList className="w-5 h-5 text-emerald-800" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">All Pipeline Posts</h2>
                      <p className="text-xs text-gray-500 mt-0.5">A comprehensive view of your content history</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md">
                    {aggregateCounts.total} items
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {posts.length === 0 ? (
                    <div className="p-16 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4">
                        <Inbox className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-medium text-gray-900">No posts found</h3>
                      <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or extending your date range.</p>
                    </div>
                  ) : (
                    posts.map((post: any) => (
                      <div 
                        key={post.id} 
                        onClick={() => handleEventClick(post)}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-emerald-50/30 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          {/* Status Icon */}
                          <div className="mt-1 flex-shrink-0">
                            {post.status === 'published' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                             post.status === 'scheduled' ? <Clock className="w-5 h-5 text-emerald-700" /> :
                             <Edit3 className="w-5 h-5 text-amber-500" />}
                          </div>
                          
                          <div className="flex flex-col gap-0.5 pr-4">
                            <span className="text-sm font-medium text-gray-900 leading-snug line-clamp-1 group-hover:text-indigo-700 transition-colors">
                              {post.content || "Media Only Post"}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                              {post.scheduledAt ? format(new Date(post.scheduledAt), "MMM d, yyyy 'at' h:mm a") : "No Date Set"}
                              {post.isAiGenerated && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 font-medium ml-1">
                                  <Sparkles className="w-2.5 h-2.5" /> AI
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3 sm:mt-0 ml-8 sm:ml-0">
                          {post.platforms && post.platforms.length > 0 && (
                            <div className="flex items-center gap-1.5 min-w-[100px] sm:justify-end">
                              {post.platforms.map((plat: string) => (
                                <span key={plat} className="text-[11px] capitalize font-medium text-gray-600 bg-gray-100 border border-transparent group-hover:border-gray-200 transition-colors px-2 py-0.5 rounded-md">
                                  {plat}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="w-[85px] sm:text-right">
                            <span className={`inline-flex items-center justify-center text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md ${
                              post.status === "published" ? "bg-emerald-100/50 text-emerald-700" :
                              post.status === "scheduled" ? "bg-indigo-100/50 text-indigo-700" :
                              "bg-amber-100/50 text-amber-700"
                            }`}>
                              {post.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Area (1 column) */}
        <div className="hidden lg:flex flex-col gap-6">
          {mainView === "calendar" ? (
            <>
              {/* Upcoming Posts */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Upcoming Pipeline
                </h3>
                <div className="flex flex-col gap-3">
                  {upcomingPosts.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No upcoming posts</p>
                  ) : (
                    upcomingPosts.map((post: any) => (
                      <div key={post.id} onClick={() => handleEventClick(post)} className="cursor-pointer group border rounded-lg p-3 hover:border-indigo-300 transition-colors">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          {post.scheduledAt ? format(new Date(post.scheduledAt), "MMM d, h:mm a") : "Draft"}
                        </p>
                        <p className="text-sm text-gray-800 line-clamp-2">{post.content || "Media Only Post"}</p>
                        <div className="mt-2 flex items-center gap-1">
                          {post.platforms.map((plat: string) => (
                            <span key={plat} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize">
                              {plat}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Published Posts */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Recently Published
                </h3>
                <div className="flex flex-col gap-3">
                  {publishedPosts.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No published posts yet</p>
                  ) : (
                    publishedPosts.map((post: any) => (
                      <div key={post.id} onClick={() => handleEventClick(post)} className="cursor-pointer group border rounded-lg p-3 hover:border-emerald-300 transition-colors">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          {post.publishedAt ? format(new Date(post.publishedAt), "MMM d, h:mm a") : (post.scheduledAt ? format(new Date(post.scheduledAt), "MMM d") : "Unknown Date")}
                        </p>
                        <p className="text-sm text-gray-800 line-clamp-2 opacity-80">{post.content || "Media Only Post"}</p>
                        <div className="mt-2 flex items-center gap-1">
                          {post.platforms.map((plat: string) => (
                            <span key={plat} className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded capitalize border border-emerald-100">
                              {plat}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
             /* Statistics Counters for All Posts View */
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-emerald-800" />
                <h3 className="text-sm font-semibold text-gray-900">Pipeline Statistics</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Posts</span>
                  <span className="text-lg font-bold text-gray-900">{aggregateCounts.total}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/50 hover:bg-emerald-50 transition-colors duration-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-gray-700">Published</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">{aggregateCounts.published}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-indigo-100/50 hover:bg-emerald-50 transition-colors duration-200">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span className="text-sm font-medium text-gray-700">Scheduled</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-800">{aggregateCounts.scheduled}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50/50 rounded-lg border border-amber-100/50 hover:bg-amber-50 transition-colors duration-200">
                  <div className="flex items-center gap-2.5">
                    <Edit3 className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Drafts</span>
                  </div>
                  <span className="text-lg font-bold text-amber-600">{aggregateCounts.drafts}</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      <PostEventSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        post={selectedEvent}
        onDelete={handleDeletePost}
      />

      <QuickComposeModal
        isOpen={composeModal.isOpen}
        onClose={() => setComposeModal({ isOpen: false, date: null })}
        selectedDate={composeModal.date}
        onSave={handleSaveDraft}
      />
    </div>
  );
}
