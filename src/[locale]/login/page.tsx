import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { BackgroundLogin } from "@/pages/auth/BackgroundLogin";

type LoginState = {
  email: string;
  password: string;
};

type ApiState = {
  status: "idle" | "loading" | "success" | "error";
  message: string | null;
};

export function LoginForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState<LoginState>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [apiState, setApiState] = useState<ApiState>({
    status: "idle",
    message: null,
  });

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'editor') {
          navigate("/channels/my", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiState({ status: "loading", message: null });

    try {
      const response = await apiClient.login(form.email, form.password);

      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setApiState({
        status: "success",
        message: t("auth.welcomeBack", { name: response.user.name }) || `Chào mừng trở lại, ${response.user.name}!`,
      });

      setTimeout(() => {
        if (response.user.role === 'editor') {
          navigate("/channels/my");
        } else {
          navigate("/dashboard");
        }
      }, 500);
    } catch (error) {
      setApiState({
        status: "error",
        message:
          error instanceof Error ? error.message : t("auth.unexpectedError") || "Đã xảy ra lỗi không mong muốn.",
      });
    }
  };

  return (
    <div className="relative w-full max-w-[500px]">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-gray-200/50 bg-white/98 backdrop-blur-md p-8 shadow-2xl shadow-gray-300/20 relative z-10"
      >
        {/* Header with Icon */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-red-500/30">
            <ArrowRight className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đăng nhập
          </h1>
        </div>
        {/* Form Fields */}
        <div className="space-y-4">
          {/* Email Field */}
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

          {/* Password Field */}
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
              <span>Đang đăng nhập...</span>
            </>
          ) : (
            <>
              <ArrowRight className="w-5 h-5" />
              <span>Đăng nhập</span>
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
          Chưa có tài khoản?{" "}
          <Link
            to="/signup"
            className="text-red-600 hover:text-red-700 hover:underline transition-colors"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-red-50/30 via-pink-50/50 to-rose-100/40 overflow-auto">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <BackgroundLogin />
      </div>

      {/* Content */}
      <div className="min-h-screen flex items-center justify-center p-4 py-8 relative z-10">
        <div className="w-full max-w-[440px]">
          {/* Logo - EXACTLY like the image */}

          {/* Login Form */}
          <LoginForm />

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500 relative z-10">
            <p>© 2025 YT Manager. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
