// src/components/hooks/useUserId.tsx
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const useUserId = (): string | null => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User logged in:", user);
                localStorage.setItem("userId", user.uid);
                navigate("/");
            } else if (localStorage.getItem("userId")) {
                console.log("User previously logged in and stored in local storage.");
                navigate("/");
            } else {
                console.log("User not logged in, redirecting to login page.");
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    return localStorage.getItem("userId");
}

export default useUserId;
