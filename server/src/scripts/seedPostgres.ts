import { db } from "../db/connection.js";
import { users, courses, lessons, skills, questions, quizzes, paths, subjects, sections } from "../db/schema/index.js";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding PostgreSQL test data...\n");

  // ---- Admin User ----
  const adminPass = await bcrypt.hash("admin123", 10);
  const [admin] = await db.insert(users).values({
    id: "user_admin_001",
    name: "مدير المنصة",
    email: "admin@almeaa.com",
    passwordHash: adminPass,
    role: "admin",
    points: 0,
    badges: ["المؤسس"],
    isActive: true,
  }).returning();
  console.log("✅ Admin:", admin.name, `(${admin.email})`);

  // ---- Teacher ----
  const teacherPass = await bcrypt.hash("teacher123", 10);
  const [teacher] = await db.insert(users).values({
    id: "user_teacher_001",
    name: "أستاذ خالد",
    email: "teacher@almeaa.com",
    passwordHash: teacherPass,
    role: "teacher",
    managedPathIds: ["p_qudrat"],
    managedSubjectIds: ["sub_quant"],
  }).returning();
  console.log("✅ Teacher:", teacher.name, `(${teacher.email})`);

  // ---- Students ----
  const studentPass = await bcrypt.hash("student123", 10);
  await db.insert(users).values([
    {
      id: "user_student_001",
      name: "علي سالم",
      email: "student@almeaa.com",
      passwordHash: studentPass,
      role: "student",
      enrolledCourses: ["course_qudrat_001"],
      enrolledPaths: ["p_qudrat"],
      favorites: ["q_001", "q_002"],
    },
    {
      id: "user_student_002",
      name: "سارة أحمد",
      email: "sara@almeaa.com",
      passwordHash: studentPass,
      role: "student",
      enrolledCourses: ["course_tahsili_001"],
      enrolledPaths: ["p_tahsili"],
    },
  ]);
  console.log("✅ Students: علي سالم, سارة أحمد");

  // ---- Paths ----
  await db.insert(paths).values([
    { id: "p_qudrat", name: "القدرات", color: "#8B5CF6", icon: "brain", showInNavbar: 1, showInHome: 1, isActive: 1, description: "اختبار القدرات العامة" },
    { id: "p_tahsili", name: "التحصيلي", color: "#10B981", icon: "graduation-cap", showInNavbar: 1, showInHome: 1, isActive: 1, description: "الاختبار التحصيلي" },
  ]);
  console.log("✅ مسارات: القدرات, التحصيلي");

  // ---- Subjects ----
  await db.insert(subjects).values([
    { id: "sub_quant", pathId: "p_qudrat", name: "الكمي", color: "#8B5CF6" },
    { id: "sub_verbal", pathId: "p_qudrat", name: "اللفظي", color: "#F59E0B" },
    { id: "sub_math", pathId: "p_tahsili", name: "الرياضيات", color: "#3B82F6" },
    { id: "sub_physics", pathId: "p_tahsili", name: "الفيزياء", color: "#EF4444" },
  ]);
  console.log("✅ مواد: الكمي, اللفظي, الرياضيات, الفيزياء");

  // ---- Sections ----
  await db.insert(sections).values([
    { id: "sec_algebra", subjectId: "sub_quant", name: "الجبر" },
    { id: "sec_geometry", subjectId: "sub_quant", name: "الهندسة" },
    { id: "sec_reading", subjectId: "sub_verbal", name: "استيعاب المقروء" },
  ]);
  console.log("✅ أقسام: الجبر, الهندسة, استيعاب المقروء");

  // ---- Skills ----
  await db.insert(skills).values([
    { id: "skill_algebra_eq", name: "حل المعادلات", pathId: "p_qudrat", subjectId: "sub_quant", sectionId: "sec_algebra", description: "حل المعادلات الخطية والتربيعية", lessonIds: ["lesson_001"], questionIds: ["q_001"] },
    { id: "skill_geometry_area", name: "المساحات", pathId: "p_qudrat", subjectId: "sub_quant", sectionId: "sec_geometry", description: "حساب مساحات الأشكال الهندسية", lessonIds: ["lesson_002"], questionIds: ["q_002"] },
    { id: "skill_reading_comp", name: "الفهم القرائي", pathId: "p_qudrat", subjectId: "sub_verbal", sectionId: "sec_reading", description: "استيعاب النصوص المقروءة", questionIds: ["q_003"] },
  ]);
  console.log("✅ مهارات: 3 مهارات");

  // ---- Courses ----
  await db.insert(courses).values([
    {
      id: "course_qudrat_001",
      title: "دورة القدرات الشاملة",
      thumbnail: "https://picsum.photos/seed/qudrat/400/250",
      instructor: "أستاذ خالد",
      price: 299,
      currency: "SAR",
      duration: 40,
      level: "Intermediate",
      rating: 4,
      pathId: "p_qudrat",
      features: ["محاضرات مباشرة", "بنك أسئلة", "اختبارات محاكاة", "شهادة"],
      description: "دورة شاملة للقدرات تغطي الكمي واللفظي",
      isPublished: true,
      skills: ["skill_algebra_eq", "skill_geometry_area", "skill_reading_comp"],
    },
    {
      id: "course_tahsili_001",
      title: "التحصيلي - رياضيات وفيزياء",
      thumbnail: "https://picsum.photos/seed/tahsili/400/250",
      instructor: "د. محمد",
      price: 349,
      currency: "SAR",
      duration: 50,
      level: "Advanced",
      rating: 5,
      pathId: "p_tahsili",
      features: ["شرح كامل", "ملخصات", "اختبارات"],
      description: "تغطية كاملة للرياضيات والفيزياء في التحصيلي",
      isPublished: true,
      skills: [],
    },
  ]);
  console.log("✅ دورات: 2");

  // ---- Lessons ----
  await db.insert(lessons).values([
    {
      id: "lesson_001",
      title: "مقدمة في حل المعادلات",
      type: "video",
      duration: "15 دقيقة",
      videoUrl: "https://www.youtube.com/watch?v=demo1",
      pathId: "p_qudrat",
      subjectId: "sub_quant",
      sectionId: "sec_algebra",
      skillIds: ["skill_algebra_eq"],
      order: 1,
      isLocked: false,
    },
    {
      id: "lesson_002",
      title: "مساحات الأشكال الهندسية",
      type: "video",
      duration: "20 دقيقة",
      videoUrl: "https://www.youtube.com/watch?v=demo2",
      pathId: "p_qudrat",
      subjectId: "sub_quant",
      sectionId: "sec_geometry",
      skillIds: ["skill_geometry_area"],
      order: 2,
      isLocked: false,
    },
    {
      id: "lesson_003",
      title: "استيعاب المقروء - المستوى الأول",
      type: "text",
      duration: "10 دقيقة",
      content: "في هذا الدرس سنتعلم أساسيات استيعاب المقروء...",
      pathId: "p_qudrat",
      subjectId: "sub_verbal",
      sectionId: "sec_reading",
      skillIds: ["skill_reading_comp"],
      order: 1,
      isLocked: false,
    },
  ]);
  console.log("✅ دروس: 3");

  // ---- Questions ----
  await db.insert(questions).values([
    {
      id: "q_001",
      text: "إذا كان 2س + 4 = 10، فما قيمة س؟",
      options: ["2", "3", "4", "5"],
      correctOptionIndex: 1,
      explanation: "2س = 10 - 4 = 6، س = 3",
      skillIds: ["skill_algebra_eq"],
      pathId: "p_qudrat",
      subject: "sub_quant",
      sectionId: "sec_algebra",
      difficulty: "Easy",
      type: "mcq",
    },
    {
      id: "q_002",
      text: "مساحة مستطيل طوله 6 سم وعرضه 4 سم تساوي:",
      options: ["20 سم²", "24 سم²", "28 سم²", "30 سم²"],
      correctOptionIndex: 1,
      explanation: "المساحة = الطول × العرض = 6 × 4 = 24 سم²",
      skillIds: ["skill_geometry_area"],
      pathId: "p_qudrat",
      subject: "sub_quant",
      sectionId: "sec_geometry",
      difficulty: "Easy",
      type: "mcq",
    },
    {
      id: "q_003",
      text: "المقصود بـ 'استيعاب المقروء' هو:",
      options: ["حفظ النص", "فهم النص وتحليله", "قراءة سريعة فقط", "تلخيص النص"],
      correctOptionIndex: 1,
      explanation: "استيعاب المقروء يعني فهم النص وتحليل أفكاره",
      skillIds: ["skill_reading_comp"],
      pathId: "p_qudrat",
      subject: "sub_verbal",
      sectionId: "sec_reading",
      difficulty: "Medium",
      type: "mcq",
    },
    {
      id: "q_004",
      text: "حل المعادلة س² - 9 = 0 يعطي:",
      options: ["س = 3 فقط", "س = -3 فقط", "س = ±3", "لا يوجد حل"],
      correctOptionIndex: 2,
      explanation: "س² = 9، س = ±3",
      skillIds: ["skill_algebra_eq"],
      pathId: "p_qudrat",
      subject: "sub_quant",
      sectionId: "sec_algebra",
      difficulty: "Medium",
      type: "mcq",
    },
  ]);
  console.log("✅ أسئلة: 4");

  // ---- Quizzes ----
  await db.insert(quizzes).values([
    {
      id: "quiz_qudrat_001",
      title: "اختبار الجبر السريع",
      pathId: "p_qudrat",
      subjectId: "sub_quant",
      sectionId: "sec_algebra",
      type: "quiz",
      mode: "regular",
      questionIds: ["q_001", "q_004"],
      skillIds: ["skill_algebra_eq"],
      isPublished: true,
      accessType: "free",
    },
    {
      id: "quiz_qudrat_002",
      title: "اختبار شامل - كمي ولفظي",
      pathId: "p_qudrat",
      subjectId: "sub_quant",
      type: "quiz",
      mode: "regular",
      questionIds: ["q_001", "q_002", "q_003", "q_004"],
      skillIds: ["skill_algebra_eq", "skill_geometry_area", "skill_reading_comp"],
      isPublished: true,
      accessType: "free",
    },
  ]);
  console.log("✅ اختبارات: 2\n");

  console.log("🎉 Seeding complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📧 Admin:    admin@almeaa.com / admin123");
  console.log("📧 Teacher:  teacher@almeaa.com / teacher123");
  console.log("📧 Student:  student@almeaa.com / student123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
