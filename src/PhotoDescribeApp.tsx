import React, { useRef, useState, useEffect } from "react";
import SpinnerButton from "./components/SpinnerButton";
import PixelateOverlay from "./components/PixelateOverlay";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { getSessionId } from "./lib/sessionUtils";

type PhotoStatus = "idle" | "pending" | "done" | "error";

const initialState = {
  selectedFile: null as File | null,
  previewUrl: "",
  latestPhotoId: null as Id<"photos"> | null,
  photoStatus: "idle" as PhotoStatus,
  error: "",
  showWhy: false,
  showHow: false,
};

function PhotoDescribeApp() {
  const [selectedFile, setSelectedFile] = useState<File | null>(initialState.selectedFile);
  const [previewUrl, setPreviewUrl] = useState(initialState.previewUrl);
  const [latestPhotoId, setLatestPhotoId] = useState<Id<"photos"> | null>(initialState.latestPhotoId);
  const [photoStatus, setPhotoStatus] = useState<PhotoStatus>(initialState.photoStatus);
  const [error, setError] = useState(initialState.error);
  const [spinning, setSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showWhy, setShowWhy] = useState(initialState.showWhy);
  const [showHow, setShowHow] = useState(initialState.showHow);
  const [sessionId, setSessionId] = useState<string>("");

  // Get session ID on component mount
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convex hooks
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const savePhoto = useMutation(api.photos.savePhoto);
  const photo = useQuery(
    api.photos.get,
    latestPhotoId && sessionId ? { photoId: latestPhotoId, sessionId } : "skip"
  );

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPhotoStatus("idle");
      setError("");
      setShowResult(false);
      setShowWhy(false);
      setShowHow(false);
      setLatestPhotoId(null);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPhotoStatus("idle");
      setError("");
      setShowResult(false);
      setShowWhy(false);
      setShowHow(false);
      setLatestPhotoId(null);
    }
  };

  // Handle spinner button click
  const handleSpinAndSubmit = async () => {
    if (!selectedFile || !sessionId) return;
    setError("");
    setPhotoStatus("idle");
    setShowResult(false);
    setShowWhy(false);
    setShowHow(false);

    try {
      // Step 1: Get upload URL
      const postUrl = await generateUploadUrl();
      // Step 2: Upload file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      const json = await result.json();
      if (!result.ok) {
        throw new Error(`Upload failed: ${JSON.stringify(json)}`);
      }
      const { storageId } = json;
      // Step 3: Save photo metadata and schedule LLM
      const photoId = await savePhoto({ storageId, sessionId });
      setLatestPhotoId(photoId);
      setPhotoStatus("pending");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setPhotoStatus("error");
    }
  };

  // Watch for photo status updates
  React.useEffect(() => {
    if (!photo) return;
    if (photo.status === "pending") {
      setPhotoStatus("pending");
      setShowResult(false);
    } else if (photo.status === "done") {
      setPhotoStatus("done");
      setShowResult(true);
    } else if (photo.status === "error") {
      setPhotoStatus("error");
      setShowResult(true);
      setError(photo.error || "Something went wrong.");
    }
  }, [photo]);

  // Reset all state
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setLatestPhotoId(null);
    setPhotoStatus("idle");
    setError("");
    setShowResult(false);
    setShowWhy(false);
    setShowHow(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Output field logic
  let outputContent: React.ReactNode = null;
  if (photoStatus === "pending") {
    outputContent = (
      <div className="text-yellow-400 font-semibold text-center py-4">
        Analyzing photo...
      </div>
    );
  } else if (photoStatus === "error" && error) {
    outputContent = (
      <div className="text-red-500 font-semibold text-center py-4">
        Error: {error}
      </div>
    );
  } else if (photoStatus === "done" && !showWhy) {
    outputContent = (
      <button
        className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition marcellus-regular"
        onClick={() => setShowWhy(true)}
      >
        WHY IS IT WOKE?
      </button>
    );
  } else if (photoStatus === "done" && showWhy && !showHow) {
    outputContent = (
      <div className="flex flex-col items-center">
        <div className="text-white text-center py-4 font-semibold">
          It's actually not MY job to "do the work" for you
        </div>
        <button
          className="mt-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition marcellus-regular"
          onClick={() => setShowHow(true)}
        >
          HOW DO I "DO THE WORK?"
        </button>
      </div>
    );
  } else if (photoStatus === "done" && showWhy && showHow) {
    outputContent = (
      <div className="flex flex-col items-center">
        <div className="text-white text-center py-4 font-semibold">
          {photo?.description
            ? photo.description
            : "No description available."}
        </div>
        <button
          className="mt-2 bg-blue-700 text-white font-bold py-2 px-4 rounded transition marcellus-regular"
          disabled
        >
          HOW DO I "DO THE WORK?"
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-2">
      {/* Image upload area */}
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

      {/* Spinner/Submit button */}
      <div className="w-full mb-6">
        <SpinnerButton
          spinning={spinning}
          setSpinning={setSpinning}
          onFinalTrue={async () => {
            await handleSpinAndSubmit();
          }}
          disabled={!selectedFile || photoStatus === "pending"}
          showResult={photoStatus === "done"}
        />
      </div>

      {/* Output/result field */}
      <div className="w-full min-h-[56px] flex flex-col items-center justify-center">
        {outputContent}
      </div>

      {/* Reset button */}
      {photoStatus === "done" || photoStatus === "error" ? (
        <button
        className="mt-4 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded transition marcellus-regular"
        onClick={handleReset}
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}

export default PhotoDescribeApp;
