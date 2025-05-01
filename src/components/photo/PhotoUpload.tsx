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
}) => {
  return (
    <div
      className="w-full flex flex-col items-center mb-6"
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
    >
      <label
        htmlFor="photo-upload"
        className={`block w-full cursor-pointer border-2 border-dashed border-gray-400 rounded-lg p-4 text-center bg-[#222b3a] hover:bg-[#26304a] transition mb-2`}
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
            Drag & drop or click to upload a photo
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
