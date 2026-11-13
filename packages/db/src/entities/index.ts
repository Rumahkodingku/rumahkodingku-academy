import { User, UserStatus } from "./user.entity";
import { UserProfile } from "./user-profile.entity";
import { RefreshSession } from "./refresh-session.entity";
import { RefreshTokenFamily } from "./refresh-token-family.entity";
import { EmailVerificationToken } from "./email-verification-token.entity";
import { PasswordResetToken } from "./password-reset-token.entity";
import { Role } from "./role.entity";
import { Permission } from "./permission.entity";
import { RoleHasPermission } from "./role-has-permission.entity";
import { ModelHasRole } from "./model-has-role.entity";
import { ModelHasPermission } from "./model-has-permission.entity";

import { Category } from "./category.entity";
import { Course, CourseDifficulty, CourseStatus } from "./course.entity";
import { CourseSection } from "./course-section.entity";
import { CourseLesson, LessonContentType, LessonStatus } from "./course-lesson.entity";

import { Order, OrderStatus } from "./order.entity";
import { OrderItem } from "./order-item.entity";
import { Payment, PaymentStatus } from "./payment.entity";
import { PaymentWebhookEvent, WebhookProcessingState } from "./payment-webhook-event.entity";
import { RefundRequest, RefundStatus } from "./refund-request.entity";
import { Coupon, CouponType } from "./coupon.entity";
import { CouponRedemption } from "./coupon-redemption.entity";

import { Enrollment, EnrollmentSource, EnrollmentStatus } from "./enrollment.entity";
import { LessonProgress, LessonProgressStatus } from "./lesson-progress.entity";
import { Quiz, QuizStatus, AnswerRevealTiming } from "./quiz.entity";
import { QuizQuestion, QuizQuestionType } from "./quiz-question.entity";
import { QuizOption } from "./quiz-option.entity";
import { QuizAttempt, QuizAttemptStatus } from "./quiz-attempt.entity";
import { QuizAnswer } from "./quiz-answer.entity";

import { Roadmap, RoadmapStatus } from "./roadmap.entity";
import { RoadmapCourse } from "./roadmap-course.entity";

import { FinalProject } from "./final-project.entity";
import { ProjectRubricCriterion } from "./project-rubric-criterion.entity";
import { ProjectSubmission, ProjectSubmissionStatus } from "./project-submission.entity";
import { SubmissionFile } from "./submission-file.entity";
import { SubmissionScore } from "./submission-score.entity";
import { Certificate, CertificateStatus } from "./certificate.entity";

import { ModerationState } from "./moderation-state";
import { DiscussionTopic } from "./discussion-topic.entity";
import { DiscussionReply } from "./discussion-reply.entity";
import { LessonQuestion } from "./lesson-question.entity";
import { LessonAnswer } from "./lesson-answer.entity";
import { ContentReport, ContentReportStatus } from "./content-report.entity";
import { CourseReview, ReviewStatus } from "./course-review.entity";
import { Wishlist } from "./wishlist.entity";
import { Notification } from "./notification.entity";
import { NotificationOutbox, OutboxStatus } from "./notification-outbox.entity";
import { OutboxEvent, OutboxEventStatus } from "./outbox-event.entity";
import { Announcement, AnnouncementAudience, AnnouncementStatus } from "./announcement.entity";
import { PlatformSetting } from "./platform-setting.entity";
import { AuditLog } from "./audit-log.entity";

export { User, UserStatus };
export { UserProfile };
export { RefreshSession };
export { RefreshTokenFamily };
export { EmailVerificationToken };
export { PasswordResetToken };
export { Role };
export { Permission };
export { RoleHasPermission };
export { ModelHasRole };
export { ModelHasPermission };

export { Category };
export { Course, CourseDifficulty, CourseStatus };
export { CourseSection };
export { CourseLesson, LessonContentType, LessonStatus };

export { Order, OrderStatus };
export { OrderItem };
export { Payment, PaymentStatus };
export { PaymentWebhookEvent, WebhookProcessingState };
export { RefundRequest, RefundStatus };
export { Coupon, CouponType };
export { CouponRedemption };

export { Enrollment, EnrollmentSource, EnrollmentStatus };
export { LessonProgress, LessonProgressStatus };
export { Quiz, QuizStatus, AnswerRevealTiming };
export { QuizQuestion, QuizQuestionType };
export { QuizOption };
export { QuizAttempt, QuizAttemptStatus };
export { QuizAnswer };

export { Roadmap, RoadmapStatus };
export { RoadmapCourse };

export { FinalProject };
export { ProjectRubricCriterion };
export { ProjectSubmission, ProjectSubmissionStatus };
export { SubmissionFile };
export { SubmissionScore };
export { Certificate, CertificateStatus };

export { ModerationState };
export { DiscussionTopic };
export { DiscussionReply };
export { LessonQuestion };
export { LessonAnswer };
export { ContentReport, ContentReportStatus };
export { CourseReview, ReviewStatus };
export { Wishlist };
export { Notification };
export { NotificationOutbox, OutboxStatus };
export { OutboxEvent, OutboxEventStatus };
export { Announcement, AnnouncementAudience, AnnouncementStatus };
export { PlatformSetting };
export { AuditLog };

export const entities: Function[] = [
  User,
  UserProfile,
  RefreshSession,
  RefreshTokenFamily,
  EmailVerificationToken,
  PasswordResetToken,
  Role,
  Permission,
  RoleHasPermission,
  ModelHasRole,
  ModelHasPermission,
  Category,
  Course,
  CourseSection,
  CourseLesson,
  Order,
  OrderItem,
  Payment,
  PaymentWebhookEvent,
  RefundRequest,
  Coupon,
  CouponRedemption,
  Enrollment,
  LessonProgress,
  Quiz,
  QuizQuestion,
  QuizOption,
  QuizAttempt,
  QuizAnswer,
  Roadmap,
  RoadmapCourse,
  FinalProject,
  ProjectRubricCriterion,
  ProjectSubmission,
  SubmissionFile,
  SubmissionScore,
  Certificate,
  DiscussionTopic,
  DiscussionReply,
  LessonQuestion,
  LessonAnswer,
  ContentReport,
  CourseReview,
  Wishlist,
  Notification,
  NotificationOutbox,
  OutboxEvent,
  Announcement,
  PlatformSetting,
  AuditLog,
];
