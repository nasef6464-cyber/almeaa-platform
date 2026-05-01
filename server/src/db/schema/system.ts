import { pgTable, text, integer, varchar, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";

// ============================================================
// Groups, Library, Homepage, Activity
// ============================================================

export const groups = pgTable("groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  parentId: text("parent_id"),
  ownerId: text("owner_id").notNull(),
  supervisorIds: text("supervisor_ids").array().default([]),
  studentIds: text("student_ids").array().default([]),
  courseIds: text("course_ids").array().default([]),
  description: text("description").default(""),
  location: text("location").default(""),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const libraryItems = pgTable("library_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  size: text("size").default(""),
  downloads: integer("downloads").default(0),
  type: varchar("type", { length: 20 }).default("pdf"),
  pathId: text("path_id"),
  subjectId: text("subject_id").notNull(),
  sectionId: text("section_id"),
  skillIds: text("skill_ids").array().default([]),
  url: text("url"),
  showOnPlatform: boolean("show_on_platform").default(true),
  isLocked: boolean("is_locked").default(false),
  ownerType: varchar("owner_type", { length: 20 }).default("platform"),
  ownerId: text("owner_id"),
  createdBy: text("created_by"),
  assignedTeacherId: text("assigned_teacher_id"),
  approvalStatus: varchar("approval_status", { length: 20 }).default("draft"),
  approvedBy: text("approved_by"),
  approvedAt: integer("approved_at"),
  reviewerNotes: text("reviewer_notes"),
  revenueSharePercentage: integer("revenue_share_percentage"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const homepageSettings = pgTable("homepage_settings", {
  id: text("id").primaryKey(),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  title: text("title").notNull(),
  description: text("description").default(""),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});
