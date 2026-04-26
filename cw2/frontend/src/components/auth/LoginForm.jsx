import { useState } from "react";
// import * as authService from "../../api/authService";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { normalizeError } from "../../utils/normalizeError";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError([]);
    setLoading(true);
    setSuccess("");

    try {
      const res = await loginUser(form);
      // setUser(res?.data);
      setSuccess(res?.msg);
      console.log(res?.msg);
      console.log(res?.user);
      setForm({
        email: "",
        password: "",
      });
      setTimeout(() => {
        if (res?.user?.role === "alumni") {
          if (!res?.profile) navigate("/create-profile");
          else navigate("/profile");
        } else if (res?.user?.role === "dashboard") {
          navigate("/dashboard");
        } else if (res?.user?.role === "ar_app") {
          navigate("/ar");
        }
      }, 1000);
    } catch (err) {
      // setError("Invalid email or password");
      setError(normalizeError(err))
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        required
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

      {/* Button */}
      <button
        disabled={loading}
        className="w-full mb-3 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Login"}
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