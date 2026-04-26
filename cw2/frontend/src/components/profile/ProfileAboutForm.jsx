import { useState } from "react";

export default function ProfileAboutForm({ profile, onSubmit }) {
  const [bio, setBio] = useState(profile?.bio || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    // We send an object with the bio key so handleUpdate can merge it
    onSubmit({ bio });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div>
        <p className="text-sm text-gray-500 mb-4">
          You can write about your years of experience, industry, or skills. People also talk about their achievements or previous job experiences.
        </p>
        <label className="block text-sm text-gray-500 mb-1 font-medium">
          About
        </label>
        <textarea
          rows="8"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Talk about your professional journey..."
          className="w-full border border-gray-400 rounded-md p-3 text-sm focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition-all resize-none"
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-1.5 rounded-full font-semibold transition shadow-sm"
        >
          Save
        </button>
      </div>
    </form>
  );
}