import { describe, expect, it } from "vitest";

import {
  MAX_AVATAR_BYTES,
  validateAvatarFile,
} from "../../../../src/features/auth/avatar-validation";

function file(type: string, size = 1024): File {
  return new File([new Uint8Array(size)], "avatar", { type });
}

describe("validateAvatarFile", () => {
  it("accepts supported image types", () => {
    for (const type of ["image/jpeg", "image/png", "image/webp"]) {
      expect(validateAvatarFile(file(type))).toBeNull();
    }
  });

  it("rejects unsupported image types", () => {
    expect(validateAvatarFile(file("image/gif"))).toBe("profile.avatar.invalidType");
  });

  it("rejects files above the size limit", () => {
    expect(validateAvatarFile(file("image/png", MAX_AVATAR_BYTES + 1))).toBe(
      "profile.avatar.tooLarge",
    );
    expect(validateAvatarFile(file("image/png", MAX_AVATAR_BYTES))).toBeNull();
  });
});
