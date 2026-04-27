import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../hooks/useAuth";
import { normalizeError } from "../../utils/normalizeError";
import { sanitizePayload } from "../../utils/sanitizePayload";

export default function InitialProfileSetupPage() {
  const { user } = useAuth();
  console.log("user:",user);
  const { createProfile } = useProfile();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    fullName: "",
    city: "",
    country: "",
    bio: "",
    linkedInUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    console.log(form);
    e.preventDefault();
    setLoading(true);
    setError([]);
    setSuccess("");

    try {
      const payload = sanitizePayload(form);

      const res = await createProfile(payload);
      console.log(res);
      setSuccess(res?.msg || "Profile created successfully");
      setTimeout(() => {
        navigate("/alumni/profile"); // Redirect to main profile after success
      }, 1000);
    } catch (err) {
      // setError(err.response?.data?.msg || "Failed to create profile. Please check your inputs.");
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";
  const inputClass = "w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-gray-600">
          Tell the Westminster community a bit about yourself.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-10 shadow-2xl rounded-2xl border border-gray-100">

          {/* Error */}
          {/* {error.length > 0 && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg space-y-1">
              {error.map((e, i) => (
                <p key={i} className="leading-tight">
                  {e.msg}
                </p>
              ))}
            </div>
          )} */}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                required
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className={inputClass}
                placeholder="e.g. Jane Doe"
              />
            </div>

            {/* Location Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className={inputClass}
                  placeholder="London"
                />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className={inputClass}
                  placeholder="United Kingdom"
                />
              </div>
            </div>

            {/* Bio Field */}
            <div>
              <label className={labelClass}>Professional Bio</label>
              <textarea
                rows="4"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className={inputClass}
                placeholder="Share your journey, skills, or what you're looking for..."
              />
              <p className="mt-1 text-xs text-gray-400 text-right">
                {form.bio.length} characters
              </p>
            </div>

            {/* LinkedIn */}
            <div>
              <label className={labelClass}>LinkedIn URL</label>
              <input
                type="url"
                value={form.linkedInUrl}
                onChange={(e) => setForm({ ...form, linkedInUrl: e.target.value })}
                className={inputClass}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-50"
              >
                {loading ? "Creating Profile..." : "Launch My Profile"}
              </button>
            </div>

            {/* Error */}
            {error.length > 0 && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg space-y-1">
                {error.map((e, i) => (
                  <p key={i} className="leading-tight">
                    {e.msg}
                  </p>
                ))}
              </div>
            )}
            {success && (
              <div className="mb-3 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                {success}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}