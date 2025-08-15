

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
  z.union([
    z.string().refine(
      (val) => {
        try {
          const url = new URL(val);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      },
      { message: "Must be a valid URL" }
    ),
    z.instanceof(File).refine(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              const aspectRatio = img.width / img.height;
              resolve(Math.abs(aspectRatio - widthRatio / heightRatio) < 0.01);
            };
            img.src = reader.result as string;
          };
          reader.readAsDataURL(file);
        }),
      { message: `Invalid aspect ratio ${widthRatio}:${heightRatio}` }
    ),
  ]);
