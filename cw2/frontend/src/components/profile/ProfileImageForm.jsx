import { useState } from "react";
import { Camera } from "lucide-react";

export default function ProfileImageForm({ profile, onSubmit }) {
  const [imagePreview, setImagePreview] = useState(profile.profileImage);
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setImagePreview(URL.createObjectURL(selected));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ profileImage: file });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* IMAGE PREVIEW WITH ICON OVERLAY */}
      <div className="flex justify-center">
        <div className="relative group">

          <img
            src={imagePreview}
            alt="Preview"
            className="w-40 h-40 rounded-full object-cover border shadow-sm"
          />

          {/* ICON OVERLAY */}
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
            <Camera className="text-white" size={28} />

            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>

        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
      </div>

    </form>
  );
}