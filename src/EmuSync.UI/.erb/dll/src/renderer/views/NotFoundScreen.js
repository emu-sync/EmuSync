"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotFoundScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const routes_1 = require("@/renderer/routes");
const react_router_dom_1 = require("react-router-dom");
function NotFoundScreen() {
    return (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Screen Not Found" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: routes_1.routes.home.href, children: "Go to Home page" })] });
}
//# sourceMappingURL=NotFoundScreen.js.map