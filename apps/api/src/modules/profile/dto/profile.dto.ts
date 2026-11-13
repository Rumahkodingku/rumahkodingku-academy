import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const httpUrlSchema = z
  .string()
  .trim()
  .max(512)
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "URL must use http or https");

const nullableHttpUrlSchema = httpUrlSchema
  .nullable()
  .optional()
  .transform((value) => (value === "" ? null : value));

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(30)
  .regex(/^[a-z0-9_]+$/, "Username may contain lowercase letters, numbers, and underscores")
  .nullable()
  .optional();

const timezoneSchema = z
  .string()
  .trim()
  .max(64)
  .refine((value) => {
    try {
      new Intl.DateTimeFormat(undefined, { timeZone: value });
      return true;
    } catch {
      return false;
    }
  }, "Invalid IANA timezone")
  .nullable()
  .optional();

const countryCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .length(2)
  .regex(/^[A-Z]{2}$/, "Country code must be ISO 3166-1 alpha-2")
  .nullable()
  .optional();

export const updateProfileSchema = z
  .object({
    displayName: z.string().trim().min(1).max(100).optional(),
    fullName: z.string().trim().max(255).nullable().optional(),
    username: usernameSchema,
    bio: z.string().trim().max(500).nullable().optional(),
    headline: z.string().trim().max(120).nullable().optional(),
    phone: z.string().trim().max(32).nullable().optional(),
    countryCode: countryCodeSchema,
    city: z.string().trim().max(100).nullable().optional(),
    timezone: timezoneSchema,
    locale: z.enum(["id", "en"]).optional(),
    websiteUrl: nullableHttpUrlSchema,
    githubUrl: nullableHttpUrlSchema,
    linkedinUrl: nullableHttpUrlSchema,
    xUrl: nullableHttpUrlSchema,
    instagramUrl: nullableHttpUrlSchema,
    emailNotifications: z.boolean().optional(),
    inAppNotifications: z.boolean().optional(),
  })
  .strict();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export class UpdateProfileDto extends createZodDto(updateProfileSchema) {}
