import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface PrivateRouteProps {
    children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
