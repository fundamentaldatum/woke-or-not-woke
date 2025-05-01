/**
 * Hook for managing photo upload functionality
 */

import { useState, useRef, useCallback } from 'react';
import { PhotoState } from '../types';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

/**
 * Hook to manage photo upload state and functionality
 * @param sessionId The current user session ID
 * @returns Object containing state and handlers for photo upload
 */
export function usePhotoUpload(sessionId: string) {
  const [state, setState] = useState<PhotoState>({
    selectedFile: null,
    previewUrl: "",
    latestPhotoId: null,
    photoStatus: "idle",
    error: "",
    showWhy: false,
    showHow: false,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const savePhoto = useMutation(api.photos.savePhoto);

  /**
   * Update state partially
   * Memoized to prevent infinite re-renders
   */
  const updateState = useCallback((newState: Partial<PhotoState>) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);

  /**
   * Handle file selection from input
   * Memoized to prevent unnecessary re-renders
   */
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      updateState({
        selectedFile: file,
        previewUrl: URL.createObjectURL(file),
        photoStatus: "idle",
        error: "",
        latestPhotoId: null,
        showWhy: false,
        showHow: false,
      });
    }
  }, [updateState]);

  /**
   * Handle file drop from drag and drop
   * Memoized to prevent unnecessary re-renders
   */
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      updateState({
        selectedFile: file,
        previewUrl: URL.createObjectURL(file),
        photoStatus: "idle",
        error: "",
        latestPhotoId: null,
        showWhy: false,
        showHow: false,
      });
    }
  }, [updateState]);

  /**
   * Handle photo submission for analysis
   * Memoized to prevent unnecessary re-renders
   */
  const handleSubmit = useCallback(async () => {
    if (!state.selectedFile || !sessionId) return;
    
    updateState({
      error: "",
      photoStatus: "idle",
      showWhy: false,
      showHow: false,
    });

    try {
      // Step 1: Get upload URL
      const postUrl = await generateUploadUrl();
      
      // Step 2: Upload file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": state.selectedFile.type },
        body: state.selectedFile,
      });
      
      const json = await result.json();
      if (!result.ok) {
        throw new Error(`Upload failed: ${JSON.stringify(json)}`);
      }
      
      // Step 3: Save photo metadata and schedule LLM
      const { storageId } = json;
      const photoId = await savePhoto({ storageId, sessionId });
      
      updateState({
        latestPhotoId: photoId,
        photoStatus: "pending",
      });
    } catch (err: any) {
      updateState({
        error: err.message || "Something went wrong.",
        photoStatus: "error",
      });
    }
  }, [state.selectedFile, sessionId, updateState, generateUploadUrl, savePhoto]);

  /**
   * Reset all state
   * Memoized to prevent unnecessary re-renders
   */
  const handleReset = useCallback(() => {
    updateState({
      selectedFile: null,
      previewUrl: "",
      latestPhotoId: null,
      photoStatus: "idle",
      error: "",
      showWhy: false,
      showHow: false,
    });
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [updateState, fileInputRef]);

  return {
    state,
    fileInputRef,
    updateState,
    handleFileChange,
    handleDrop,
    handleSubmit,
    handleReset,
  };
}
