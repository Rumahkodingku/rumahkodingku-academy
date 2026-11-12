import { User, UserRole, UserStatus } from "./user.entity";
import { RefreshSession } from "./refresh-session.entity";
import { EmailVerificationToken } from "./email-verification-token.entity";
import { PasswordResetToken } from "./password-reset-token.entity";

import { Category } from "./category.entity";
import { Course, CourseDifficulty, CourseStatus } from "./course.entity";
import { CourseSection } from "./course-section.entity";
import { CourseLesson, LessonContentType, LessonStatus } from "./course-lesson.entity";

export { User, UserRole, UserStatus };
export { RefreshSession };
export { EmailVerificationToken };
export { PasswordResetToken };

export { Category };
export { Course, CourseDifficulty, CourseStatus };
export { CourseSection };
export { CourseLesson, LessonContentType, LessonStatus };

export const entities: Function[] = [
  User,
  RefreshSession,
  EmailVerificationToken,
  PasswordResetToken,
  Category,
  Course,
  CourseSection,
  CourseLesson,
];
