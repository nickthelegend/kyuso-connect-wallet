import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "./useAuth";
export function AuthModal(_a) {
    var open = _a.open, onClose = _a.onClose, _b = _a.providers, providers = _b === void 0 ? ["google", "github"] : _b;
    var setSession = useAuth().setSession;
    function openPopup(provider) {
        var popup = window.open("/api/auth/signin/".concat(provider, "?callbackUrl=").concat(encodeURIComponent("/auth/popup-callback")), "oauth", "width=500,height=700");
        function onMessage(e) {
            if (!e.data || e.data.type !== "OAUTH_SESSION")
                return;
            setSession(e.data.session);
            window.removeEventListener("message", onMessage);
            if (popup)
                popup.close();
            onClose();
        }
        window.addEventListener("message", onMessage);
    }
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "fixed inset-0 bg-black/40", onClick: onClose }), _jsxs("div", { className: "relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Sign in" }), providers.map(function (p) { return (_jsxs("button", { onClick: function () { return openPopup(p); }, className: "w-full mb-3 p-2 rounded-lg border hover:bg-gray-50", children: ["Continue with ", p[0].toUpperCase() + p.slice(1)] }, p)); }), _jsx("button", { onClick: onClose, className: "mt-2 text-sm text-gray-500 hover:text-gray-700", children: "Cancel" })] })] }));
}
