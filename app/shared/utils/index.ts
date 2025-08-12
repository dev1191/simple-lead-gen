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
