import { db } from "@/db";
import { posts, socialAccounts, autoReplyLogs } from "@/db/schema";
import { eq, desc, isNotNull, and, count } from "drizzle-orm";
import { getDemoUserId } from "@/lib/demo-auth";
import { formatDistanceToNow } from "date-fns";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default async function DashboardPage() {
  const userId = getDemoUserId();
  
  const dbUser = await db.query.users.findFirst();

  if (!dbUser) {
    return <div>No users found in database. Please run migrations or seeds.</div>;
  }

  // Fetch real data
  const userPosts = await db.query.posts.findMany({
    where: eq(posts.userId, dbUser.id),
    orderBy: desc(posts.createdAt),
  });

  const scheduled = userPosts.filter(p => p.status === "scheduled");
  const published = userPosts.filter(p => p.status === "published");

  const accounts = await db.query.socialAccounts.findMany({
    where: eq(socialAccounts.userId, dbUser.id),
  });

  const stats = [
    {
      label: "Total posts",
      value: userPosts.length.toString(),
      change: "Active",
      trend: "up",
      icon: "Share2",
      note: "all time",
    },
    {
      label: "Scheduled",
      value: scheduled.length.toString(),
      change: "Ready",
      trend: "neutral",
      icon: "Calendar",
      note: "upcoming",
    },
    {
      label: "Published",
      value: published.length.toString(),
      change: "Live",
      trend: "up",
      icon: "CheckCircle2",
      note: "verified",
    },
    {
      label: "Avg. engagement",
      value: "4.2%", // Engagement would need platform API data, leaving as 4.2% for now
      change: "+0.5%",
      trend: "up",
      icon: "TrendingUp",
      note: "highly active",
    },
  ];

  const recentPosts = userPosts.slice(0, 4).map((p, i) => {
    const matchingAccount = accounts.find(a => p.platforms.some((pl: string) => pl.toLowerCase() === a.platform.toLowerCase()));
    
    return {
      post: p, // full post for detail view
      id: p.id,
      label: `Post ${p.status}`,
      detail: p.platforms.join(" & ") || "Multiple platforms",
      time: formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }),
      dot: p.status === "published" ? "#09825d" : p.status === "scheduled" ? "#f5a623" : "#2d6a4f",
      avatarUrl: matchingAccount?.avatarUrl || null,
    };
  });

  const platformMeta: Record<string, { icon: string, color: string, bg: string }> = {
    instagram: { icon: "FaInstagram", color: "#E1306C", bg: "#fdf0f5" },
    twitter: { icon: "FaXTwitter", color: "#000000", bg: "#f0f0f0" },
    "twitter / x": { icon: "FaXTwitter", color: "#000000", bg: "#f0f0f0" },
    x: { icon: "FaXTwitter", color: "#000000", bg: "#f0f0f0" },
    linkedin: { icon: "FaLinkedinIn", color: "#0077B5", bg: "#eef6fb" },
    youtube: { icon: "FaYoutube", color: "#FF0000", bg: "#fff0f0" },
  };

  const connectedAccounts = accounts.map(a => {
    const meta = platformMeta[a.platform.toLowerCase()] || { icon: "FaXTwitter", color: "#2d6a4f", bg: "#f6f9fc" };
    return {
      platform: a.platform,
      handle: a.username || "Connected",
      icon: meta.icon,
      color: meta.color,
      bg: meta.bg,
      active: true,
    };
  });

  // AI Insight (real if we have data, otherwise fallback)
  const aiInsight = userPosts.length > 0 
    ? `Your latest post on ${userPosts[0].platforms[0] || "your channels"} was marked as ${userPosts[0].status}. Keep publishing consistently to see more engagement metrics flow in.`
    : "You haven't published any posts yet. Head to the compose section to start your first multi-platform broadcast.";

  return (
    <DashboardClient 
      stats={stats} 
      activities={recentPosts} 
      connectedAccounts={connectedAccounts} 
      aiInsight={aiInsight}
    />
  );
}
