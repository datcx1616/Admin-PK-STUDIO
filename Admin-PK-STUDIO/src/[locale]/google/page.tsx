import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Mail, Lock, Youtube, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { BackgroundLogin } from "@/pages/auth/BackgroundLogin";

// Google Logo SVG Component
const GoogleLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

type LoginState = {
    email: string;
    password: string;
};

type ApiState = {
    status: "idle" | "loading" | "success" | "error";
    message: string | null;
};

export function LoginFormWithGoogle() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [form, setForm] = useState<LoginState>({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showEmailLogin, setShowEmailLogin] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = useState(false);
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

    const handleGoogleLogin = () => {
        setLoadingGoogle(true);
        // Replace with your Google OAuth URL
        window.location.href = `${import.meta.env.VITE_API_URL || 'https://api.pkstudio.tech/api'}/auth/google`;
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
        <div className="relative w-full max-w-[400px]">
            <div className="space-y-5 rounded-3xl border border-gray-200/50 bg-white/98 backdrop-blur-md p-8 shadow-2xl shadow-gray-300/20 relative z-10">
                {/* Header with Icon */}
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-red-500/30">
                        <ArrowRight className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Đăng nhập
                    </h1>
                    <p className="text-sm text-gray-600">
                        Chọn phương thức đăng nhập của bạn
                    </p>
                </div>

                {/* Google Sign-In Button */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loadingGoogle}
                    className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
                >
                    {loadingGoogle ? (
                        <>
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                            <span>Đang kết nối...</span>
                        </>
                    ) : (
                        <>
                            <GoogleLogo />
                            <span>Tiếp tục với Google</span>
                        </>
                    )}
                </button>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-600 font-medium">
                            hoặc đăng nhập bằng email
                        </span>
                    </div>
                </div>

                {/* Toggle Email Login */}
                <button
                    type="button"
                    onClick={() => setShowEmailLogin(!showEmailLogin)}
                    className="w-full text-sm text-gray-700 font-semibold hover:text-gray-900 transition-colors text-center py-2"
                >
                    {showEmailLogin ? '▲ Ẩn form đăng nhập' : '▼ Hiển thị form đăng nhập'}
                </button>

                {/* Email Login Form - Collapsible */}
                {showEmailLogin && (
                    <form onSubmit={handleSubmit} className="space-y-4 animate-slideDown">
                        {/* Demo Accounts */}
                        <details
                            className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-100/50"
                        >
                            <summary className="text-sm font-bold text-red-900 cursor-pointer flex items-center gap-2">
                                <span>🔑</span>
                                <span>Tài khoản Demo</span>
                            </summary>
                            <div className="mt-3 space-y-1.5">
                                <div className="bg-white/70 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-800">
                                    admin@youtube.com • Admin@123
                                </div>
                                <div className="bg-white/70 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-800">
                                    director@youtube.com • Admin@123
                                </div>
                                <div className="bg-white/70 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-800">
                                    manager1.test@youtube.com • Admin@123
                                </div>
                            </div>
                        </details>

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
                )}
            </div>

            {/* Footer Links */}
            <div className="mt-5 space-y-3 text-center relative z-10">
                <p className="text-xs text-gray-600">
                    <span className="text-gray-500">Bằng cách đăng nhập, bạn đồng ý với </span>
                    <a href="#" className="text-red-600 hover:text-red-700 font-semibold hover:underline">
                        Điều khoản dịch vụ
                    </a>
                    <span className="text-gray-500"> và </span>
                    <a href="#" className="text-red-600 hover:text-red-700 font-semibold hover:underline">
                        Chính sách bảo mật
                    </a>
                </p>
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

            {/* Animation Styles */}
            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

export default function LoginPageWithGoogle() {
    return (
        <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-red-50/30 via-pink-50/50 to-rose-100/40 overflow-auto">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
                <BackgroundLogin />
            </div>

            {/* Content */}
            <div className="min-h-screen flex items-center justify-center p-4 py-8 relative z-10">
                <div className="w-full max-w-[440px]">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center gap-4 bg-white/98 backdrop-blur-md px-8 py-4 rounded-3xl shadow-xl shadow-gray-300/20 border border-gray-200/50">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                                <Youtube className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-left">
                                <h1 className="text-2xl font-bold text-gray-900">YT Manager</h1>
                                <p className="text-xs text-gray-500">YouTube Management System</p>
                            </div>
                        </div>
                    </div>

                    {/* Login Form */}
                    <LoginFormWithGoogle />

                    {/* Footer */}
                    <div className="mt-8 text-center text-xs text-gray-500 relative z-10">
                        <p>© 2025 YT Manager. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
