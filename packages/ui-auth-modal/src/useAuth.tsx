import { useAuthContext } from "./AuthProvider";

export const useAuth = () => {
  const ctx = useAuthContext();
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};