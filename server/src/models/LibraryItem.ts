import mongoose, { Schema } from "mongoose";

const libraryItemSchema = new Schema(
  {
    id: { type: String, index: true, sparse: true },
    title: { type: String, required: true, trim: true },
    size: { type: String, default: "" },
    downloads: { type: Number, default: 0 },
    type: { type: String, enum: ["pdf", "doc", "video"], default: "pdf" },
    pathId: { type: String, required: true, index: true },
    subjectId: { type: String, required: true, index: true },
    sectionId: { type: String, default: null, index: true },
    skillIds: { type: [String], default: [] },
    url: { type: String, default: "" },
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

export const LibraryItemModel = mongoose.model("LibraryItem", libraryItemSchema);
