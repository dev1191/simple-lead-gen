

import { z } from "zod";


export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces and non-alphanumeric chars (except hyphen) with hyphen
    .replace(/[\s\W]+/g, "-")
    // Replace multiple hyphens with a single hyphen
    .replace(/-+/g, "-")
    // Remove starting and ending hyphens
    .replace(/^-+|-+$/g, "");
}



export const fileWithAspectRatio = (widthRatio: number, heightRatio: number) =>
  z.any().superRefine(async (val, ctx) => {
    // Case 1: if it's a string -> must be valid URL
    if (typeof val === "string") {
      try {
        const url = new URL(val);
        if (!(url.protocol === "http:" || url.protocol === "https:")) {
          ctx.addIssue({
            code: "custom",
            message: "Must be a valid URL",
          });
        }
      } catch {
        ctx.addIssue({
          code: "custom",
          message: "Must be a valid URL",
        });
      }
      return;
    }

    // Case 2: if it's a File -> check aspect ratio
    if (val instanceof File) {
      const aspectOk = await new Promise<boolean>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const aspectRatio = img.width / img.height;
            const expected = widthRatio / heightRatio;
            resolve(Math.abs(aspectRatio - expected) < 0.01); // 1% tolerance
          };
          img.onerror = () => resolve(false);
          img.src = reader.result as string;
        };
        reader.readAsDataURL(val);
      });

      if (!aspectOk) {
        ctx.addIssue({
          code: "custom",
          message: `Invalid aspect ratio: must be ${widthRatio}:${heightRatio}`,
        });
      }
      return;
    }

    // Case 3: neither File nor string
    ctx.addIssue({
      code: "custom",
      message: "Must be a URL or an uploaded image",
    });
  });


export const formatDescription = (desc: string, limit: number) => {
  // Convert to UCWords
  const ucwords = desc.replace(/\b\w/g, c => c.toUpperCase());

  // Limit string length
  if (ucwords.length > limit) {
    return ucwords.slice(0, limit).trim() + "...";
  }

  return ucwords;
}