import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { apiClient } from "@/lib/api-client";

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
                // Redirect based on role
                if (user.role === 'editor') {
                    navigate("/channels/my", { replace: true });
                } else {
                    navigate("/dashboard", { replace: true });
                }
            } catch (error) {
                // If parsing fails, redirect to dashboard
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
                message: t("auth.welcomeBack", { name: response.user.name }) || `Welcome back, ${response.user.name}!`,
            });

            setTimeout(() => {
                // Redirect based on user role
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
                    error instanceof Error ? error.message : t("auth.unexpectedError") || "Unexpected error occurred.",
            });
        }
    };

    return (
        <div className="w-full max-w-md">
            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50"
            >
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto w-14 h-14 bg-gradient-to-br from-red-500 to-red-600  rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
                        <LogIn className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">
                        {t("auth.login") || "Welcome Back"}
                    </h1>
                    <p className="text-xs text-slate-500">
                        {t("auth.loginDescription") || "Sign in to your account"}
                    </p>
                </div>


                <details className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                    <summary className="text-xs font-semibold text-blue-900 cursor-pointer">🔑 Demo Accounts</summary>
                    <div className="mt-2 space-y-0.5 text-xs text-blue-700">
                        <div className="bg-white/60 px-2 py-0.5 rounded text-[10px]">admin@youtube.com • Admin@123</div>
                        <div className="bg-white/60 px-2 py-0.5 rounded text-[10px]">director@youtube.com • Admin@123</div>
                        <div className="bg-white/60 px-2 py-0.5 rounded text-[10px]">manager1.test@youtube.com • Admin@123</div>
                    </div>
                </details>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            {t("auth.email") || "Email"}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            {t("auth.password") || "Password"}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-10 py-2 text-sm rounded-lg border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={apiState.status === "loading"}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600  hover:red-blue-600 hover:to-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                    {apiState.status === "loading" ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{t("auth.loggingIn") || "Logging in..."}</span>
                        </>
                    ) : (
                        <>
                            <LogIn className="w-4 h-4" />
                            <span>{t("auth.login") || "Log in"}</span>
                        </>
                    )}
                </button>

                {apiState.message && (
                    <div
                        className={`rounded-lg px-3 py-2 text-xs font-medium ${apiState.status === "success"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                    >
                        {apiState.message}
                    </div>
                )}
            </form>
        </div>
    );
}
