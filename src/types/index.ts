/**
 * Application type definitions
 */

import { Id } from "../../convex/_generated/dataModel";

export type PhotoStatus = "idle" | "pending" | "done" | "error";

export interface PhotoState {
  selectedFile: File | null;
  previewUrl: string;
  latestPhotoId: Id<"photos"> | null;
  photoStatus: PhotoStatus;
  error: string;
  showWhy: boolean;
  showHow: boolean;
}

export interface SpinnerButtonProps {
  spinning: boolean;
  setSpinning: (b: boolean) => void;
  onFinalTrue: () => Promise<void>;
  disabled?: boolean;
  showResult: boolean;
  onAnimationComplete: () => void; // Add this line
}

export interface PixelateOverlayProps {
  src: string;
  active: boolean;
  pixelSize?: number;
  className?: string;
}

export interface PhotoUploadProps {
  previewUrl: string;
  photoStatus: PhotoStatus;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export interface PhotoResultProps {
  photoStatus: PhotoStatus;
  error: string;
  showWhy: boolean;
  showHow: boolean;
  description: string | undefined;
  setShowWhy: (show: boolean) => void;
  setShowHow: (show: boolean) => void;
  isResultVisible: boolean; // Add this line
}

export interface TypewriterTextProps {
  text: string;
  className?: string;
  typingSpeed?: number;
  startDelay?: number;
  onComplete?: () => void;
  reset?: boolean;
  showCursor?: boolean;
}