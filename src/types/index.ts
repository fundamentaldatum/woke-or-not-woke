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
  showMadLib: boolean;
}

export interface SpinnerButtonProps {
  spinning: boolean;
  setSpinning: (b: boolean) => void;
  onFinalTrue: () => Promise<void>;
  disabled?: boolean;
  showResult: boolean;
  onAnimationComplete: () => void;
  wokeColor: string;
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
  wokeColor: string;
}

export interface PhotoResultProps {
  photoStatus: PhotoStatus;
  error: string;
  showWhy: boolean;
  showHow: boolean;
  description: string | undefined;
  setShowWhy: (show: boolean) => void;
  setShowHow: (show: boolean) => void;
  setShowMadLib: (show: boolean) => void;
  isResultVisible: boolean;
  madLibData: any;
  showMadLib: boolean;
  onFlowComplete: () => void; // Add this line
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

export interface MadLibData {
  mormonMusic: { [key: string]: string };
  mormonFilms: { [key: string]: string };
  mormonTVShows: { [key: string]: string };
  mormonFiction: { [key: string]: string };
  mormonNonFiction: { [key: string]: string };
  mormonPodcasts: { [key: string]: string };
  mormonArchitecture: { [key: string]: string };
  mormonVisualArt: { [key: string]: string };
}