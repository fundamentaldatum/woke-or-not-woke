import React from 'react';
import { PhotoUploadProps } from '../../types';
import { PixelateOverlay } from '../ui';

/**
 * Component for uploading photos with drag-and-drop or file selection
 */
export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  previewUrl,
  photoStatus,
  handleDrop,
  handleFileChange,
  fileInputRef,
  wokeColor,
}) => {
  // Define default and final border styles
  const defaultBorderColor = '#6b7280'; // gray-500
  const isDone = photoStatus === 'done';
  
  const finalBorderColor = isDone ? wokeColor : defaultBorderColor;
  const finalBorderStyle = isDone ? 'solid' : 'dashed';
  const finalBorderWidth = isDone ? '4px' : '2px';

  // Apply styles dynamically
  const labelStyle: React.CSSProperties = {
    borderColor: finalBorderColor,
    borderStyle: finalBorderStyle,
    borderWidth: finalBorderWidth,
    transition: 'border-color 0.5s ease-in-out, border-style 0.5s ease-in-out, border-width 0.5s ease-in-out',
  };

  return (
    <div
      className="w-full flex flex-col items-center mb-6"
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
    >
      <label
        htmlFor="photo-upload"
        className={`block w-full cursor-pointer rounded-lg p-4 text-center bg-[#222b3a] hover:bg-[#26304a] mb-2`}
        style={labelStyle}
      >
        {previewUrl ? (
          <div className="relative w-full flex flex-col items-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="rounded-lg max-h-64 object-contain mx-auto"
              style={{ maxWidth: "100%" }}
            />
            {/* Pixelation overlay while analyzing */}
            <PixelateOverlay
              src={previewUrl}
              active={photoStatus === "pending"}
            />
          </div>
        ) : (
          <span className="text-gray-300">
            What does <b>"WOKE"</b> mean?
            <br />
            <br /> 
            Is your image <i>woke</i>?
            <br />
            <br />
            Tap to upload a photo.
            <br />
            <br />
            Our <b><i>in-house</i></b> AI algorithm will analyze your image's woke-ness and return a definitive answer.
          </span>
        )}
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={photoStatus === "pending"}
        />
      </label>
    </div>
  );
};

export default PhotoUpload;