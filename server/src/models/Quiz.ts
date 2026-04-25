import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema(
  {
    id: { type: String, index: true, sparse: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    pathId: { type: String, required: true, index: true },
    subjectId: { type: String, required: true, index: true },
    sectionId: { type: String, default: null },
    type: { type: String, enum: ["quiz", "bank"], default: "quiz" },
    mode: { type: String, enum: ["regular", "saher", "central"], default: "regular" },
    settings: {
      showExplanations: { type: Boolean, default: true },
      showAnswers: { type: Boolean, default: true },
      maxAttempts: { type: Number, default: 3 },
      passingScore: { type: Number, default: 60 },
      timeLimit: { type: Number, default: 60 },
    },
    access: {
      type: {
        type: String,
        enum: ["free", "paid", "private", "course_only"],
        default: "free",
      },
      price: { type: Number, default: 0 },
      allowedGroupIds: { type: [String], default: [] },
    },
    questionIds: { type: [String], default: [] },
    skillIds: { type: [String], default: [] },
    targetGroupIds: { type: [String], default: [] },
    targetUserIds: { type: [String], default: [] },
    dueDate: { type: String, default: null },
    isPublished: { type: Boolean, default: false },
    ownerType: { type: String, enum: ["platform", "teacher", "school"], default: "platform" },
    ownerId: { type: String, default: "" },
    createdBy: { type: String, default: "" },
    assignedTeacherId: { type: String, default: "" },
    approvalStatus: { type: String, enum: ["draft", "pending_review", "approved", "rejected"], default: "draft", index: true },
    approvedBy: { type: String, default: "" },
    approvedAt: { type: Number, default: null },
    reviewerNotes: { type: String, default: "" },
    revenueSharePercentage: { type: Number, default: null },
  },
  {
    timestamps: true,
  },
);

export const QuizModel = mongoose.model("Quiz", quizSchema);
