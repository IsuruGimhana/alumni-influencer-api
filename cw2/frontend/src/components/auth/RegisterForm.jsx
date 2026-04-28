import { useState } from "react";
import * as authService from "../../api/authService";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { normalizeError } from "../../utils/normalizeError";

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "alumni",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState([]);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError([]);
    setSuccess("");

    setLoading(true);

    try {
      const res = await authService.register(form);
      // console.log(res?.data?.msg);
      setSuccess(res?.data?.msg);

      setForm({
        email: "",
        password: "",
        role: "alumni",
      });
    } catch (err) {
      setError(normalizeError(err));
      console.log(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      {/* Email */}
      <input
        type="email"
        required
        placeholder="University Email"
        value={form.email}
        className="w-full mb-3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      {/* Password */}
      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
          value={form.password}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Role */}
      <div className="relative mb-4">
        <select
          className="w-full p-2 border rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="alumni">Alumni</option>
          <option value="developer">Developer</option>
          <option value="dashboard">Dashboard Admin</option>
        </select>
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          <ChevronDown size={18} />
        </div>
      </div>

      {/* Button */}
      <button
        disabled={loading}
        className="w-full mb-3 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>

      {/* Error */}
      {/* {error.length > 0 && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
          <ul className="list-disc pl-5 space-y-1">
            {error.map((e, i) => (
              <li key={i}>{e.msg}</li>
            ))}
          </ul>
        </div>
      )} */}
      {error.length > 0 && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg space-y-1">
          {error.map((e, i) => (
            <p key={i} className="leading-tight">
              {e.msg}
            </p>
          ))}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-3 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
          {success}
        </div>
      )}
    </form>
  );
}