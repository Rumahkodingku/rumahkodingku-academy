import { User, UserRole, UserStatus } from "./user.entity";
import { RefreshSession } from "./refresh-session.entity";
import { EmailVerificationToken } from "./email-verification-token.entity";
import { PasswordResetToken } from "./password-reset-token.entity";

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

export { User, UserRole, UserStatus };
export { RefreshSession };
export { EmailVerificationToken };
export { PasswordResetToken };

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

export const entities: Function[] = [
  User,
  RefreshSession,
  EmailVerificationToken,
  PasswordResetToken,
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
];
