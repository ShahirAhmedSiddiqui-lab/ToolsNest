import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fuzzy search - checks if search term matches the text
export function fuzzyMatch(text: string, searchTerm: string): boolean {
  const normalized = text.toLowerCase();
  const search = searchTerm.toLowerCase();
  
  // Exact or partial match
  if (normalized.includes(search)) {
    return true;
  }
  
  // Check if all characters of search term appear in order
  let searchIndex = 0;
  for (let i = 0; i < normalized.length && searchIndex < search.length; i++) {
    if (normalized[i] === search[searchIndex]) {
      searchIndex++;
    }
  }
  
  return searchIndex === search.length;
}
