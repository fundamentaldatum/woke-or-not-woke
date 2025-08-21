import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function LandingPhotoDescribe() {
  const [selected, setSelected] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [latestPhotoId, setLatestPhotoId] = useState<Id<"photos"> | null>(null);
  const [uploading, setUploading] = useState(false);

  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const savePhoto = useMutation(api.photos.savePhoto);

  // Get the latest photo info (with description) if uploaded
  const photo = useQuery(
    api.photos.get,
    latestPhotoId ? { photoId: latestPhotoId } : "skip"
  );

  const fileInput = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setSelected(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selected.type },
        body: selected,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      const { storageId } = json;
      const photoId: Id<"photos"> = await savePhoto({ storageId });
      setLatestPhotoId(photoId);
      setSelected(null);
      setPreviewUrl(null);
      if (fileInput.current) fileInput.current.value = "";
    } catch (err) {
      alert("Upload failed: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      <h1 className="text-4xl font-bold text-center mt-8 mb-2">Photo Describe AI</h1>
      <form onSubmit={handleUpload} className="flex flex-col items-center gap-4 w-full">
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          onChange={handleFileChange}
          disabled={uploading}
          className="w-full"
        />
        {previewUrl && (
          <div className="w-full flex flex-col items-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-64 rounded shadow border"
              style={{ objectFit: "contain" }}
            />
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={!selected || uploading}
        >
          {uploading ? "Uploading..." : "Upload Photo"}
        </button>
      </form>
      <div className="w-full min-h-24 flex flex-col items-center justify-center border rounded p-4 bg-slate-50">
        {!latestPhotoId && (
          <span className="text-slate-400 text-center">
            Upload a photo to see its AI-generated description.
          </span>
        )}
        {photo && (
          <>
            <img
              src={photo.url ?? undefined}
              alt="Uploaded"
              className="max-h-48 rounded shadow border mb-2"
              style={{ objectFit: "contain" }}
            />
            {photo.status === "pending" && (
              <span className="text-yellow-600">Analyzing photo...</span>
            )}
            {photo.status === "done" && (
              <span className="text-green-700 font-medium">{photo.description}</span>
            )}
            {photo.status === "error" && (
              <span className="text-red-600">Error: {photo.error}</span>
            )}
          </>
        )}
      </div>
      <div className="text-xs text-slate-400 text-center">
        Placeholder: AI photo description coming soon!
      </div>
    </div>
  );
}
