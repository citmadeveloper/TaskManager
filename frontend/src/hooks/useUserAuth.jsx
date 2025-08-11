import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const useUserAuth = () => {
    const { user, loading, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        const token = localStorage.getItem("token");

        if (!token && !user) {
            clearUser();
            navigate("/login", { replace: true });
            return;
        }

        if (token && !user) {
            return;
        }

    }, [user, loading, clearUser, navigate]);
};
