import React from "react";
import { Spinner } from "@/components/ui/spinner";

export function FullPageLoader() {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 9999,
                pointerEvents: "none"
            }}
            className="bg-gradient-to-br from-[#f7f7fa] to-[#e3e6f3] flex items-center justify-center"
        >
            <div className="flex flex-col items-center gap-6 animate-fade-in">
                {/* Logo hoặc icon */}
                <div className="rounded-full bg-white/80 shadow-lg p-6 mb-2">
                    <img
                        src="/logo192.png"
                        alt="Logo"
                        className="w-16 h-16 object-contain drop-shadow-md"
                        style={{ filter: "drop-shadow(0 2px 8px #e11d48aa)" }}
                        onError={e => (e.currentTarget.style.display = 'none')}
                    />
                </div>
                {/* Spinner */}
                <Spinner className="size-16 text-red-500 drop-shadow-lg !stroke-[1.5]" />
                {/* Text động */}
                <div className="text-lg font-semibold text-slate-700 tracking-wide animate-pulse">
                    Đang tải dữ liệu, vui lòng chờ...
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
            `}</style>
        </div>
    );
}
