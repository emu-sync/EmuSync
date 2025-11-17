"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = require("react-dom/client");
const AppProviders_1 = __importDefault(require("@/renderer/layout/AppProviders"));
const AppRoutes_1 = __importDefault(require("@/renderer/layout/AppRoutes"));
const AppLayout_1 = __importDefault(require("@/renderer/layout/AppLayout"));
const react_router_dom_1 = require("react-router-dom");
const GlobalStateAndEvents_1 = __importDefault(require("@/renderer/layout/GlobalStateAndEvents"));
function App() {
    return (0, jsx_runtime_1.jsxs)(AppProviders_1.default, { children: [(0, jsx_runtime_1.jsx)(GlobalStateAndEvents_1.default, {}), (0, jsx_runtime_1.jsx)(react_router_dom_1.HashRouter, { children: (0, jsx_runtime_1.jsx)(AppLayout_1.default, { children: (0, jsx_runtime_1.jsx)(AppRoutes_1.default, {}) }) })] });
}
const container = document.getElementById('root');
const root = (0, client_1.createRoot)(container);
root.render((0, jsx_runtime_1.jsx)(App, {}));
//# sourceMappingURL=index.js.map