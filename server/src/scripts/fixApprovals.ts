import { db } from "../db/connection.js";
import { courses, questions, quizzes, lessons, libraryItems } from "../db/schema/index.js";
import { eq } from "drizzle-orm";

async function fix() {
  await db.update(courses).set({ approvalStatus: "approved" } as any);
  await db.update(questions).set({ approvalStatus: "approved" } as any);
  await db.update(quizzes).set({ approvalStatus: "approved" } as any);
  await db.update(lessons).set({ approvalStatus: "approved" } as any);
  await db.update(libraryItems).set({ approvalStatus: "approved" } as any);
  console.log("All approvalStatus = approved ✅");
  process.exit(0);
}

fix().catch((e) => { console.error(e); process.exit(1); });
