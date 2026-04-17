"use client";

import { useState, useEffect } from "react";
import { Bell, Zap, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useIsMounted } from "@/hooks/use-is-mounted";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useIsMounted();

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) setNotifications(await res.json());
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-[#09825d]" />;
      case "warning": return <Zap className="w-4 h-4 text-[#f5a623]" />;
      case "error": return <AlertCircle className="w-4 h-4 text-[#e11d48]" />;
      default: return <Bell className="w-4 h-4 text-[#2d6a4f]" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-8 h-8 rounded-lg border border-[#e3e8ef] bg-white flex items-center justify-center text-[#697386] hover:bg-[#f6f9fc] hover:text-[#3c4257] transition-all shadow-[0_1px_2px_rgba(60,66,87,0.06)] active:scale-95"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#e11d48] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in-50 duration-200">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#e3e8ef] z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-[#f0f3f7] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1a1f36]">Notifications</h3>
                {unreadCount > 0 && (
                    <span className="text-[10px] font-semibold text-[#2d6a4f] bg-[#f0eeff] px-2 py-0.5 rounded-full">
                        {unreadCount} New
                    </span>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto divide-y divide-[#f0f3f7]">
                {isLoading ? (
                  <div className="p-8 flex justify-center">
                    <Loader2 className="w-5 h-5 text-[#2d6a4f] animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-xs text-[#8792a2]">No notifications yet.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-[#fcfdfe] transition-colors text-left ${!n.isRead ? "bg-[#f0f4ff]/10" : ""}`}
                    >
                      <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!n.isRead ? "bg-white shadow-sm" : "bg-[#f6f9fc]"}`}>
                        {getTypeIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                           <p className={`text-xs font-bold truncate ${!n.isRead ? "text-[#1a1f36]" : "text-[#475467]"}`}>
                                {n.title}
                           </p>
                           {!n.isRead && (
                               <div className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f]" />
                           )}
                        </div>
                        <p className="text-[11px] text-[#8792a2] mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-[#8792a2] mt-1">
                          {isMounted ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="p-3 bg-[#fcfdfe] border-t border-[#f0f3f7] text-center">
                <button className="text-[11px] font-bold text-[#2d6a4f] hover:text-[#1b4332] transition-colors">
                  View All Alerts
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
