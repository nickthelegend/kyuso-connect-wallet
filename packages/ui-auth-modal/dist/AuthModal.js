import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
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
    return (_jsxs(Dialog, { open: open, onClose: onClose, className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/40", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { as: motion.div, initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, transition: { duration: 0.2 }, className: "bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center", children: [_jsx(Dialog.Title, { className: "text-lg font-semibold mb-4", children: "Sign in" }), _jsx("div", { className: "space-y-3", children: providers.map(function (p) { return (_jsxs("button", { onClick: function () { return openPopup(p); }, className: "w-full p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium", children: ["Continue with ", p[0].toUpperCase() + p.slice(1)] }, p)); }) }), _jsx("button", { onClick: onClose, className: "mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors", children: "Cancel" })] }) })] }));
}
