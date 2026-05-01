import { pgTable, text, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";

// ============================================================
// Users & Authentication
// ============================================================

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  avatar: text("avatar").default(""),
  role: varchar("role", { length: 20 }).notNull().default("student"),
  points: integer("points").default(0),
  badges: text("badges").array().default([]),
  subscriptionPlan: varchar("subscription_plan", { length: 20 }).default("free"),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  purchasedCourses: text("purchased_courses").array().default([]),
  purchasedPackages: text("purchased_packages").array().default([]),
  isActive: boolean("is_active").default(true),
  schoolId: text("school_id"),
  groupIds: text("group_ids").array().default([]),
  linkedStudentIds: text("linked_student_ids").array().default([]),
  managedPathIds: text("managed_path_ids").array().default([]),
  managedSubjectIds: text("managed_subject_ids").array().default([]),
  enrolledCourses: text("enrolled_courses").array().default([]),
  enrolledPaths: text("enrolled_paths").array().default([]),
  completedLessons: text("completed_lessons").array().default([]),
  favorites: text("favorites").array().default([]),
  reviewLater: text("review_later").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
