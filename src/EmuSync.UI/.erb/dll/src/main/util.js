"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveHtmlPath = resolveHtmlPath;
/* eslint import/prefer-default-export: off */
const url_1 = require("url");
const path_1 = __importDefault(require("path"));
function resolveHtmlPath(htmlFileName) {
    if (process.env.NODE_ENV === 'development') {
        const port = process.env.PORT || 1212;
        const url = new url_1.URL(`http://localhost:${port}`);
        url.pathname = htmlFileName;
        return url.href;
    }
    return `file://${path_1.default.resolve(__dirname, '../renderer/', htmlFileName)}`;
}
//# sourceMappingURL=util.js.map