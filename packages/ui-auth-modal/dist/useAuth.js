import { useAuthContext } from "./AuthProvider";
export var useAuth = function () {
    var ctx = useAuthContext();
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
