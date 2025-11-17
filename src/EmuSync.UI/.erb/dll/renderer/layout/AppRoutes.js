"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppRoutes;
const jsx_runtime_1 = require("react/jsx-runtime");
const routes_1 = require("@/renderer/routes");
const AboutScreen_1 = __importDefault(require("@/renderer/views/about/AboutScreen"));
const AllDevicesListScreen_1 = __importDefault(require("@/renderer/views/all-devices/AllDevicesListScreen"));
const GameAddScreen_1 = __importDefault(require("@/renderer/views/game/GameAddScreen"));
const GameEditScreen_1 = __importDefault(require("@/renderer/views/game/GameEditScreen"));
const GameListScreen_1 = __importDefault(require("@/renderer/views/game/GameListScreen"));
const HomeScreen_1 = __importDefault(require("@/renderer/views/home/HomeScreen"));
const NotFoundScreen_1 = __importDefault(require("@/renderer/views/NotFoundScreen"));
const ThisDeviceScreen_1 = __importDefault(require("@/renderer/views/this-device/ThisDeviceScreen"));
const react_router_dom_1 = require("react-router-dom");
function AppRoutes() {
    return (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: routes_1.routes.home.href, element: (0, jsx_runtime_1.jsx)(HomeScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: routes_1.routes.game.href, element: (0, jsx_runtime_1.jsx)(GameListScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: routes_1.routes.gameAdd.href, element: (0, jsx_runtime_1.jsx)(GameAddScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: routes_1.routes.gameEdit.href, element: (0, jsx_runtime_1.jsx)(GameEditScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: routes_1.routes.thisDevice.href, element: (0, jsx_runtime_1.jsx)(ThisDeviceScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: routes_1.routes.allDevices.href, element: (0, jsx_runtime_1.jsx)(AllDevicesListScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: routes_1.routes.about.href, element: (0, jsx_runtime_1.jsx)(AboutScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "*", element: (0, NotFoundScreen_1.default)() })] });
}
//# sourceMappingURL=AppRoutes.js.map