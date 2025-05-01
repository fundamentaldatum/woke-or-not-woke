import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a blank white image for testing purposes
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @returns Promise that resolves to a File object containing the blank white image
 */
export function createBlankWhiteImage(width = 400, height = 400): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Fill with white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      
      // Convert to blob and then to File
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'blank-test-image.png', { type: 'image/png' });
          resolve(file);
        }
      }, 'image/png');
    }
  });
}
