import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
var AuthContext = createContext(null);
export function AuthProvider(_a) {
    var children = _a.children;
    var _b = useState(null), session = _b[0], setSession = _b[1];
    return (_jsx(AuthContext.Provider, { value: { session: session, setSession: setSession }, children: children }));
}
export var useAuthContext = function () { return useContext(AuthContext); };
