"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TimeAgo;
const jsx_runtime_1 = require("react/jsx-runtime");
const Pre_1 = require("@/renderer/components/Pre");
const dayjs_1 = __importDefault(require("dayjs"));
function TimeAgo({ secondsAgo }) {
    const pastTime = dayjs_1.default.utc().add(secondsAgo, "second"); // negative seconds in the past
    return (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: pastTime.fromNow() });
}
//# sourceMappingURL=TimeAgo.js.map