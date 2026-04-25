import { UserModel } from "../models/User.js";

const uniqueStrings = (values: Array<string | undefined | null>) =>
  Array.from(new Set(values.filter((value): value is string => typeof value === "string" && value.trim().length > 0)));

export const applyPurchaseToUser = async (
  userId: string,
  payload: { courseId?: string; packageId?: string; includedCourseIds?: string[] },
) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    return null;
  }

  const purchasedCourses = uniqueStrings([
    ...(user.subscription?.purchasedCourses || []),
    ...(payload.courseId ? [payload.courseId] : []),
    ...((payload.includedCourseIds || []).map(String)),
  ]);

  const enrolledCourses = uniqueStrings([
    ...(user.enrolledCourses || []),
    ...(payload.courseId ? [payload.courseId] : []),
    ...((payload.includedCourseIds || []).map(String)),
  ]);

  const purchasedPackages = uniqueStrings([
    ...(user.subscription?.purchasedPackages || []),
    ...(payload.packageId ? [payload.packageId] : []),
  ]);

  user.subscription = {
    ...user.subscription,
    plan: purchasedPackages.length > 0 ? "premium" : (user.subscription?.plan || "free"),
    purchasedCourses,
    purchasedPackages,
  };
  user.enrolledCourses = enrolledCourses;
  await user.save();
  return user;
};
