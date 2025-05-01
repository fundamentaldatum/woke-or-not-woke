import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function PhotoUpload() {
  const [selected, setSelected] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const savePhoto = useMutation(api.photos.savePhoto);

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
      await savePhoto({ storageId });
      setSelected(null);
      if (fileInput.current) fileInput.current.value = "";
    } catch (err) {
      alert("Upload failed: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleUpload} className="flex flex-col gap-4">
      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        onChange={e => setSelected(e.target.files?.[0] ?? null)}
        disabled={uploading}
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!selected || uploading}
      >
        {uploading ? "Uploading..." : "Upload Photo"}
      </button>
    </form>
  );
}
