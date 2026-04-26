import { useState } from "react";
import { Upload, Trash2 } from "lucide-react";

export default function ProfileImageModal({ profile, onSubmit, onClose }) {
  const [preview, setPreview] = useState(profile.profileImage);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSubmit({ profileImage: file });
  };

  const handleRemove = () => {
    setPreview(null);
    setFile(null);
    onSubmit({ removeProfileImage: true });
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-lg font-semibold">Profile photo</h2>
        <p className="text-sm text-gray-500">
          Add or update your profile picture
        </p>
      </div>

      {/* IMAGE PREVIEW */}
      <div className="flex justify-center">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-44 h-44 rounded-full object-cover border shadow-sm"
          />
        ) : (
          <div className="w-44 h-44 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            No Photo
          </div>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col items-center gap-3">

        {/* Upload */}
        <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition">
          <Upload size={16} />
          Change photo
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Remove */}
        {preview && (
          <button
            onClick={handleRemove}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm"
          >
            <Trash2 size={16} />
            Remove photo
          </button>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
      </div>

    </div>
  );
}