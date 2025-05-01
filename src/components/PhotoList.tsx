import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function PhotoList() {
  const photos = useQuery(api.photos.list) ?? [];
  return (
    <div className="flex flex-col gap-4">
      {photos.map((photo) => (
        <div key={photo._id} className="flex flex-col items-center border rounded p-2">
          <img
            src={photo.url ?? undefined}
            alt="Uploaded"
            className="max-h-32 rounded shadow border mb-2"
            style={{ objectFit: "contain" }}
          />
          <div>
            {photo.status === "pending" && (
              <span className="text-yellow-600">Analyzing photo...</span>
            )}
            {photo.status === "done" && (
              <span className="text-green-700 font-medium">{photo.description}</span>
            )}
            {photo.status === "error" && (
              <span className="text-red-600">Error: {photo.error}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
