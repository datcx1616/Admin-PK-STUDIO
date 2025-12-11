import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Mail, Lock, User, Youtube, UserPlus } from "lucide-react";
import { BackgroundLogin } from "@/pages/auth/BackgroundLogin";

type SignupState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ApiState = {
  status: "idle" | "loading" | "success" | "error";
  message: string | null;
};

type RegisteredUser = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export function SignupForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState<SignupState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiState, setApiState] = useState<ApiState>({
    status: "idle",
    message: null,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiState({ status: "loading", message: null });

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setApiState({
        status: "error",
        message: "Mật khẩu không khớp",
      });
      return;
    }

    // Validate password length
    if (form.password.length < 6) {
      setApiState({
        status: "error",
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      });
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const existingUsers: RegisteredUser[] = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
      );
      const emailExists = existingUsers.some(
        (user: RegisteredUser) => user.email === form.email
      );

      if (emailExists) {
        throw new Error("Email đã được đăng ký");
      }

      const token = btoa(
        JSON.stringify({ email: form.email, timestamp: Date.now() })
      );

      const newUser = {
        name: form.name,
        email: form.email,
        role: "user",
      };

      existingUsers.push({ ...newUser, password: form.password });
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(newUser));

      setApiState({
        status: "success",
        message: `Tài khoản đã được tạo cho ${form.email}.`,
      });
      setForm({ name: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      setApiState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi không mong muốn.",
      });
    }
  };

  return (
    <div className="relative w-full max-w-[400px]">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-gray-200/50 bg-white/98 backdrop-blur-md p-5 shadow-2xl shadow-gray-300/20 relative z-10"
      >
        {/* Header with Icon */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-red-500/30">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tạo tài khoản
          </h1>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Họ và tên
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all bg-gray-50/50"
                placeholder="Nguyễn Văn A"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all bg-gray-50/50"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                required
                className="w-full pl-12 pr-12 py-3 text-sm rounded-xl border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all bg-gray-50/50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                minLength={6}
                required
                className="w-full pl-12 pr-12 py-3 text-sm rounded-xl border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all bg-gray-50/50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={apiState.status === "loading"}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
        >
          {apiState.status === "loading" ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang tạo tài khoản...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              <span>Đăng ký</span>
            </>
          )}
        </button>

        {/* Status Message */}
        {apiState.message && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium ${apiState.status === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
              }`}
          >
            {apiState.message}
          </div>
        )}
      </form>

      {/* Footer Links */}
      <div className="mt-5 space-y-3 text-center relative z-10">
        <p className="text-sm font-semibold text-gray-700">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-red-600 hover:text-red-700 hover:underline transition-colors"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-red-50/30 via-pink-50/50 to-rose-100/40 overflow-auto">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <BackgroundLogin />
      </div>

      {/* Content */}
      <div className="min-h-screen flex items-center justify-center p-2 py-4 relative z-10">
        <div className="w-full max-w-[400px]">
          {/* Logo */}

          {/* Signup Form */}
          <SignupForm />

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500 relative z-10">
            <p>© 2025 YT Manager. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
