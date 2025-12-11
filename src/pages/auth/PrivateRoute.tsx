
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import React, { useEffect, useState } from "react";
import { FullPageLoader } from "@/components/ui/FullPageLoader";


interface PrivateRouteProps {
    children: ReactNode;
}


export function PrivateRoute({ children }: PrivateRouteProps) {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        // Giả lập gọi API kiểm tra token, có thể thay bằng gọi API thực tế nếu cần
        const checkAuth = async () => {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 400)); // Giả lập delay
            const authToken = localStorage.getItem("authToken");
            setIsAuthenticated(!!authToken);
            setLoading(false);
        };
        checkAuth();
    }, []);

    if (loading) {
        return <FullPageLoader />;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}
