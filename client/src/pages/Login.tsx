import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { FiUser, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { validateEmail, validatePassword } from "../utils/validators";
import Spinner from "../components/common/Spinner";
import BackgroundPattern from "../components/auth/BackgroundPattern";
import LoginIllustration from "../components/auth/LoginIllustration";

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}


const Login = () => {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);

  if (authLoading) return <Spinner fullPage />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = (): boolean => {
    const e = {
      email: validateEmail(form.email) || undefined,
      password: validatePassword(form.password) || undefined,
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (name !== "rememberMe")
      setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      toast.error(msg ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white relative overflow-hidden">
      {/* Scattered task-icon watermark */}
      <BackgroundPattern />

      {/* ── Left: Form panel ── */}
      <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-10 sm:px-16 xl:px-24 py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-10 tracking-tight">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
          {/* Email / Username */}
          <div>
            <div
              className={`flex items-center bg-white border rounded-lg h-14 transition-all duration-150 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
            >
              <span className="pl-4 pr-3 text-gray-400 flex-shrink-0">
                <FiUser size={20} />
              </span>
              <input
                name="email"
                type="email"
                placeholder="Enter Username"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className="flex-1 h-full pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 pl-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div
              className={`flex items-center bg-white border rounded-lg h-14 transition-all duration-150 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 ${
                errors.password ? "border-red-400" : "border-gray-300"
              }`}
            >
              <span className="pl-4 pr-3 text-gray-400 flex-shrink-0">
                <FiLock size={20} />
              </span>
              <input
                name="password"
                type="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="flex-1 h-full pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 pl-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-2.5 cursor-pointer w-fit">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={form.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-400 accent-red-400 cursor-pointer"
            />
            <span className="text-sm text-gray-600 select-none">
              Remember Me
            </span>
          </label>

          {/* Login button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-3 rounded-lg text-white font-semibold text-sm transition-all duration-150 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#F87171" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        {/* Signup link */}
        <p className="mt-6 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:underline font-medium"
          >
            Create One
          </Link>
        </p>
      </div>

      {/* ── Right: Illustration ── */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative z-10 pr-8">
        <LoginIllustration />
      </div>
    </div>
  );
};

export default Login;
