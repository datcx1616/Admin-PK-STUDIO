import React from "react";
import { useNavigate } from "react-router-dom";

interface EditorViewProps {
    data: any;
}

export function EditorView({ data }: EditorViewProps) {
    const navigate = useNavigate();

    React.useEffect(() => {
        navigate("/channels/my", { replace: true });
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Redirecting to My Channels...</p>
        </div>
    );
}
