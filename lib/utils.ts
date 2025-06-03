import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProxiedImageUrl(firebaseUrl: string): string {
  if (!firebaseUrl || !firebaseUrl.includes('firebasestorage.googleapis.com')) {
    return firebaseUrl
  }

  const encodedUrl = encodeURIComponent(firebaseUrl)
  return `/api/proxy-image?url=${encodedUrl}`
}
