import { Link } from "react-router-dom";
import { SignupForm } from "@/pages/auth/SignupForm";
import { useTranslation } from "react-i18next";
import { Youtube } from "lucide-react";

export default function SignupPage() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 overflow-auto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>


      <div className="min-h-screen flex items-center justify-center p-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-slate-900">YT Manager</h1>
                <p className="text-xs text-slate-500">YouTube Management System</p>
              </div>
            </div>
          </div>

          <SignupForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {t("auth.hasAccount") || "Already have an account?"}{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors hover:underline"
              >
                {t("auth.login") || "Log in"}
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            <p>© 2025 YT Manager. All rights reserved.</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
