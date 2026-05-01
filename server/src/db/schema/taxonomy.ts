import { pgTable, text, integer, varchar, jsonb } from "drizzle-orm/pg-core";

// ============================================================
// Taxonomy: Paths, Levels, Subjects, Sections, Skills
// ============================================================

export const paths = pgTable("paths", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color"),
  icon: text("icon"),
  iconUrl: text("icon_url"),
  iconStyle: text("icon_style"),
  showInNavbar: integer("show_in_navbar").default(1),
  showInHome: integer("show_in_home").default(1),
  isActive: integer("is_active").default(1),
  parentPathId: text("parent_path_id"),
  description: text("description"),
});

export const levels = pgTable("levels", {
  id: text("id").primaryKey(),
  pathId: text("path_id").notNull(),
  name: text("name").notNull(),
});

export const subjects = pgTable("subjects", {
  id: text("id").primaryKey(),
  pathId: text("path_id").notNull(),
  levelId: text("level_id"),
  name: text("name").notNull(),
  color: text("color"),
  icon: text("icon"),
  iconUrl: text("icon_url"),
  iconStyle: text("icon_style"),
  settings: jsonb("settings"),
});

export const sections = pgTable("sections", {
  id: text("id").primaryKey(),
  subjectId: text("subject_id").notNull(),
  name: text("name").notNull(),
});

export const skills = pgTable("skills", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  pathId: text("path_id").notNull(),
  subjectId: text("subject_id").notNull(),
  sectionId: text("section_id").notNull(),
  description: text("description").default(""),
  lessonIds: text("lesson_ids").array().default([]),
  questionIds: text("question_ids").array().default([]),
  createdAt: integer("created_at").default(0),
  updatedAt: integer("updated_at").default(0),
});
