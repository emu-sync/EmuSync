"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("@testing-library/jest-dom");
const react_1 = require("@testing-library/react");
const App_1 = __importDefault(require("../renderer/App"));
describe('App', () => {
    it('should render', () => {
        expect((0, react_1.render)((0, jsx_runtime_1.jsx)(App_1.default, {}))).toBeTruthy();
    });
});
//# sourceMappingURL=App.test.js.map