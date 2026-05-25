import { pgTable, text, timestamp, varchar, integer, boolean, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  authId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  plan: varchar("plan", { length: 50 }).notNull().default("free"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const socialAccounts = pgTable("social_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  platform: varchar("platform", { length: 50 }).notNull(), // e.g., 'instagram', 'twitter', 'linkedin'
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  platformUserId: varchar("platform_user_id", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }),
  avatarUrl: text("avatar_url"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  mediaUrls: jsonb("media_urls").$type<string[]>().default([]),
  platforms: jsonb("platforms").$type<string[]>().notNull(), // e.g., ['instagram', 'twitter']
  status: varchar("status", { length: 50 }).notNull().default("draft"), // 'draft', 'scheduled', 'published', 'failed'
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  isAiGenerated: boolean("is_ai_generated").default(false),
  aiPrompt: text("ai_prompt"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const postPlatformResults = pgTable("post_platform_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  platform: varchar("platform", { length: 50 }).notNull(),
  platformPostId: varchar("platform_post_id", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull(), // 'success', 'error'
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const autoReplyRules = pgTable("auto_reply_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  platform: varchar("platform", { length: 50 }).notNull(),
  triggerType: varchar("trigger_type", { length: 50 }).notNull(), // 'keyword', 'any_comment'
  keywords: jsonb("keywords").$type<string[]>().default([]),
  replyTemplate: text("reply_template"),
  useAI: boolean("use_ai").default(false),
  aiPrompt: text("ai_prompt"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const autoReplyLogs = pgTable("auto_reply_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  ruleId: uuid("rule_id").notNull().references(() => autoReplyRules.id, { onDelete: "cascade" }),
  commentId: varchar("comment_id", { length: 255 }).notNull(),
  commentText: text("comment_text").notNull().default(""),
  replyText: text("reply_text").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("success"), // 'success', 'failed'
  repliedAt: timestamp("replied_at").defaultNow().notNull(),
});

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  imageKitFileId: varchar("image_kit_file_id", { length: 255 }).notNull(),
  url: text("url").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'image', 'video'
  size: integer("size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentConversations = pgTable("agent_conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull().default("New Conversation"),
  messages: jsonb("messages").$type<any[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const agentPreferences = pgTable("agent_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  key: varchar("key", { length: 255 }).notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  goal: varchar("goal", { length: 255 }).notNull(),
  goalText: text("goal_text").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("planning"), // 'planning', 'active', 'completed', 'failed'
  planJson: jsonb("plan_json"), // Stores the full Gemini plan
  predictedRevenue: integer("predicted_revenue"),
  actualRevenue: integer("actual_revenue").default(0),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const campaignPosts = pgTable("campaign_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "set null" }), // Link to actual post if generated
  platform: varchar("platform", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const campaignMessages = pgTable("campaign_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  channel: varchar("channel", { length: 50 }).notNull(), // 'whatsapp', 'sms'
  recipientCount: integer("recipient_count").default(0),
  sentCount: integer("sent_count").default(0),
  deliveredCount: integer("delivered_count").default(0),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  socialAccounts: many(socialAccounts),
  posts: many(posts),
  autoReplyRules: many(autoReplyRules),
  mediaAssets: many(mediaAssets),
  agentConversations: many(agentConversations),
  agentPreferences: many(agentPreferences),
  campaigns: many(campaigns),
  notifications: many(notifications),
}));

export const socialAccountsRelations = relations(socialAccounts, ({ one }) => ({
  user: one(users, {
    fields: [socialAccounts.userId],
    references: [users.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  results: many(postPlatformResults),
}));

export const postPlatformResultsRelations = relations(postPlatformResults, ({ one }) => ({
  post: one(posts, {
    fields: [postPlatformResults.postId],
    references: [posts.id],
  }),
}));

export const autoReplyRulesRelations = relations(autoReplyRules, ({ one, many }) => ({
  user: one(users, {
    fields: [autoReplyRules.userId],
    references: [users.id],
  }),
  logs: many(autoReplyLogs),
}));

export const autoReplyLogsRelations = relations(autoReplyLogs, ({ one }) => ({
  rule: one(autoReplyRules, {
    fields: [autoReplyLogs.ruleId],
    references: [autoReplyRules.id],
  }),
}));

export const mediaAssetsRelations = relations(mediaAssets, ({ one }) => ({
  user: one(users, {
    fields: [mediaAssets.userId],
    references: [users.id],
  }),
}));

export const agentConversationsRelations = relations(agentConversations, ({ one }) => ({
  user: one(users, {
    fields: [agentConversations.userId],
    references: [users.id],
  }),
}));

export const agentPreferencesRelations = relations(agentPreferences, ({ one }) => ({
  user: one(users, {
    fields: [agentPreferences.userId],
    references: [users.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id],
  }),
  posts: many(campaignPosts),
  messages: many(campaignMessages),
}));

export const campaignPostsRelations = relations(campaignPosts, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignPosts.campaignId],
    references: [campaigns.id],
  }),
  post: one(posts, {
    fields: [campaignPosts.postId],
    references: [posts.id],
  }),
}));

export const campaignMessagesRelations = relations(campaignMessages, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignMessages.campaignId],
    references: [campaigns.id],
  }),
}));

export const triggers = pgTable("triggers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  condition: jsonb("condition").notNull(),
  action: jsonb("action").notNull(),
  isActive: boolean("is_active").default(true),
  cooldownHours: integer("cooldown_hours").default(6),
  fireCount: integer("fire_count").default(0),
  lastFiredAt: timestamp("last_fired_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const triggerLogs = pgTable("trigger_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  triggerId: uuid("trigger_id").notNull().references(() => triggers.id, { onDelete: "cascade" }),
  firedAt: timestamp("fired_at").defaultNow().notNull(),
  conditionSnapshot: jsonb("condition_snapshot"),
  actionTaken: text("action_taken"),
  result: text("result"),
  revenueGenerated: integer("revenue_generated").default(0),
});

export const audienceSegments = pgTable("audience_segments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull().default("ai"),
  filter: jsonb("filter"),
  memberCount: integer("member_count").default(0),
  avgRevenue: integer("avg_revenue").default(0),
  lastCalculatedAt: timestamp("last_calculated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const segmentMembers = pgTable("segment_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  segmentId: uuid("segment_id").notNull().references(() => audienceSegments.id, { onDelete: "cascade" }),
  platformUserId: varchar("platform_user_id", { length: 255 }).notNull(),
  platform: varchar("platform", { length: 50 }).notNull(),
  engagementScore: integer("engagement_score").default(0),
  predictedValue: integer("predicted_value").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  phone: varchar("phone", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }),
  whatsappOptIn: boolean("whatsapp_opt_in").default(false),
  smsOptIn: boolean("sms_opt_in").default(false),
  segmentIds: jsonb("segment_ids").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messageCampaigns = pgTable("message_campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  campaignId: uuid("campaign_id").references(() => campaigns.id, { onDelete: "set null" }),
  channel: varchar("channel", { length: 50 }).notNull(),
  message: text("message").notNull(),
  mediaUrl: text("media_url"),
  status: varchar("status", { length: 50 }).notNull().default("draft"),
  sentCount: integer("sent_count").default(0),
  deliveredCount: integer("delivered_count").default(0),
  readCount: integer("read_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations for new tables
export const triggersRelations = relations(triggers, ({ one, many }) => ({
  user: one(users, { fields: [triggers.userId], references: [users.id] }),
  logs: many(triggerLogs),
}));

export const triggerLogsRelations = relations(triggerLogs, ({ one }) => ({
  trigger: one(triggers, { fields: [triggerLogs.triggerId], references: [triggers.id] }),
}));

export const audienceSegmentsRelations = relations(audienceSegments, ({ one, many }) => ({
  user: one(users, { fields: [audienceSegments.userId], references: [users.id] }),
  members: many(segmentMembers),
}));

export const segmentMembersRelations = relations(segmentMembers, ({ one }) => ({
  segment: one(audienceSegments, { fields: [segmentMembers.segmentId], references: [audienceSegments.id] }),
}));

export const contactsRelations = relations(contacts, ({ one }) => ({
  user: one(users, { fields: [contacts.userId], references: [users.id] }),
}));

export const messageCampaignsRelations = relations(messageCampaigns, ({ one }) => ({
  user: one(users, { fields: [messageCampaigns.userId], references: [users.id] }),
  campaign: one(campaigns, { fields: [messageCampaigns.campaignId], references: [campaigns.id] }),
}));

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("info"), // 'info', 'success', 'warning', 'error'
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));
