import { create } from "zustand";
import Router from "next/router";
import { User } from "@/app/interface/auth";

interface AuthState {
    user: User | null;
    saveSession: (newUser: User) => void;
    removeSession: () => void;
    isAuthenticated: () => boolean;
    isPermitedRoute: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user:
        typeof window !== "undefined" && localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user") || "{}")
            : null,

    saveSession: (newUser: User) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("token", newUser.token || "");
            localStorage.setItem("user", JSON.stringify(newUser));
        }
        set({ user: newUser });
    },
    removeSession: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        set({ user: null });
        setTimeout(() => {
            Router.push("/auth/sign-in");
        }, 25);
    },

    isAuthenticated: () => {
        return get().user != null;
    },

    isPermitedRoute: (permission: string) => {
        const user = get().user;
        if (user && user.role?.name !== "Super-Admin") {
            const permissions = user.permissions;
            if (permissions?.includes(permission) || permission === "all") {
                return true;
            }
            return false;
        }
        return false;
    },
}));
