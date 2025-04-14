import { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: ReactNode }) => {
    const {isAuthenticated} = useAuth();
    return isAuthenticated ? <Navigate to="/login" /> : children;
};

export default PublicRoute;