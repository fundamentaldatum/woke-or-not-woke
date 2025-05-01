import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a checkered black and white image for testing purposes
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param squareSize Size of each square in the checkered pattern (default: 40)
 * @returns Promise that resolves to a File object containing the checkered test image
 */
export function createBlankWhiteImage(width = 400, height = 400, squareSize = 40): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Fill with white background first
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      
      // Draw checkered pattern
      ctx.fillStyle = '#000000';
      for (let y = 0; y < height; y += squareSize) {
        for (let x = 0; x < width; x += squareSize) {
          // Only fill alternate squares to create checkered pattern
          if ((Math.floor(x / squareSize) + Math.floor(y / squareSize)) % 2 === 0) {
            ctx.fillRect(x, y, squareSize, squareSize);
          }
        }
      }
      
      // Convert to blob and then to File
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'checkered-test-image.png', { type: 'image/png' });
          resolve(file);
        }
      }, 'image/png');
    }
  });
}
