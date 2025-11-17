import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type SignupState = {
    name: string;
    email: string;
    password: string;
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
    });
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

        try {

            await new Promise((resolve) => setTimeout(resolve, 1000));

            const existingUsers: RegisteredUser[] = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
            const emailExists = existingUsers.some((user: RegisteredUser) => user.email === form.email);

            if (emailExists) {
                throw new Error(t("auth.emailExists") || "Email already registered");
            }


            const token = btoa(JSON.stringify({ email: form.email, timestamp: Date.now() }));

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
                message: t("auth.accountCreated", { email: form.email }) || `Account created for ${form.email}.`,
            });
            setForm({ name: "", email: "", password: "" });

            setTimeout(() => {
                navigate("/dashboard");
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
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        >
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    {t("auth.createAccount") || "Create account"}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    {t("auth.signupDescription") || "This demo saves users in localStorage only."}
                </p>
            </div>
            <div className="space-y-4">
                <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">
                        {t("auth.fullName") || "Full name"}
                    </span>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20"
                        placeholder="Taylor Swift"
                    />
                </label>
                <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">
                        {t("auth.email") || "Email"}
                    </span>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20"
                        placeholder="you@example.com"
                    />
                </label>
                <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">
                        {t("auth.password") || "Password"}
                    </span>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        minLength={6}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20"
                        placeholder={t("auth.passwordPlaceholder") || "At least 6 characters"}
                    />
                </label>
            </div>

            <button
                type="submit"
                disabled={apiState.status === "loading"}
                className="w-full rounded-lg bg-[#0EA5E9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0284C7] disabled:bg-[#0EA5E9]/60"
            >
                {apiState.status === "loading"
                    ? (t("auth.creatingAccount") || "Creating account...")
                    : (t("auth.signup") || "Sign up")}
            </button>

            {apiState.message && (
                <div
                    className={`rounded-lg px-4 py-3 text-sm ${apiState.status === "success"
                        ? "bg-green-50 text-green-700"
                        : "bg-rose-50 text-rose-600"
                        }`}
                >
                    {apiState.message}
                </div>
            )}
        </form>
    );
}
