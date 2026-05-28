import { useState, ChangeEvent } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validateName } from '../utils/validators';
import BackgroundPattern from '../components/auth/BackgroundPattern';
import SignupIllustration from '../components/auth/SignupIllustration';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  termsAccepted: boolean;
}

const Signup = () => {
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupForm>({
    name: '',
    email: '',
    password: '',
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; terms?: string }>({});
  const [loading, setLoading] = useState(false);

  if (authLoading) return <Spinner fullPage />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = (): boolean => {
    const e: typeof errors = {
      name: validateName(form.name) || undefined,
      email: validateEmail(form.email) || undefined,
      password: validatePassword(form.password) || undefined,
      terms: !form.termsAccepted ? 'You must accept the terms' : undefined,
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (name !== 'termsAccepted') {
      setErrors((err) => ({ ...err, [name]: undefined }));
    } else {
      setErrors((err) => ({ ...err, terms: undefined }));
    }
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(msg ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white relative overflow-hidden">
      {/* Scattered task-icon watermark */}
      <BackgroundPattern patternId="taskIconsSignup" />

      {/* ── Left: Illustration ── */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative z-10 pl-8">
        <SignupIllustration />
      </div>

      {/* ── Right: Form panel ── */}
      <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-10 sm:px-16 xl:px-24 py-16">
        {/* Title */}
        <h1 className="text-5xl font-bold text-gray-900 mb-10 tracking-tight">
          Sign Up{' '}
          <span className="font-normal text-gray-500 text-4xl">in </span>
          <span style={{ color: '#F87171' }}>TaskFlow</span>
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
          {/* Full Name */}
          <div>
            <div
              className={`flex items-center bg-white border rounded-lg h-14 transition-all duration-150 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              }`}
            >
              <span className="pl-4 pr-3 text-gray-400 flex-shrink-0">
                <FiUser size={20} />
              </span>
              <input
                name="name"
                type="text"
                placeholder="Enter Full Name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                className="flex-1 h-full pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1 pl-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <div
              className={`flex items-center bg-white border rounded-lg h-14 transition-all duration-150 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 ${
                errors.email ? 'border-red-400' : 'border-gray-300'
              }`}
            >
              <span className="pl-4 pr-3 text-gray-400 flex-shrink-0">
                <FiMail size={20} />
              </span>
              <input
                name="email"
                type="email"
                placeholder="Enter Email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className="flex-1 h-full pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1 pl-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div
              className={`flex items-center bg-white border rounded-lg h-14 transition-all duration-150 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 ${
                errors.password ? 'border-red-400' : 'border-gray-300'
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
                autoComplete="new-password"
                className="flex-1 h-full pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1 pl-1">{errors.password}</p>}
          </div>

          {/* I agree to all terms */}
          <div>
            <label className="flex items-center gap-2.5 cursor-pointer w-fit">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                checked={form.termsAccepted}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-400 accent-red-400 cursor-pointer"
              />
              <span className="text-sm text-gray-600 select-none">I agree to all terms</span>
            </label>
            {errors.terms && <p className="text-xs text-red-500 mt-1 pl-1">{errors.terms}</p>}
          </div>

          {/* Register button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-3 rounded-lg text-white font-semibold text-sm transition-all duration-150 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#F87171' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading...
                </span>
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>

        {/* Sign in link */}
        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
