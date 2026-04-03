import { pgTable, text, timestamp, varchar, integer, boolean, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
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
  replyText: text("reply_text").notNull(),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  socialAccounts: many(socialAccounts),
  posts: many(posts),
  autoReplyRules: many(autoReplyRules),
  mediaAssets: many(mediaAssets),
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
