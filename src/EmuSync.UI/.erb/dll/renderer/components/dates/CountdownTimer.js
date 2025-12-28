"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CountdownTimer;
const jsx_runtime_1 = require("react/jsx-runtime");
const Pre_1 = require("@/renderer/components/Pre");
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
const material_1 = require("@mui/material");
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = require("react");
function CountdownTimer({ seconds, reset }) {
    const [timeLeft, setTimeLeft] = (0, react_1.useState)(seconds);
    (0, react_1.useEffect)(() => {
        setTimeLeft(seconds);
    }, [seconds]);
    (0, react_1.useEffect)(() => {
        if (timeLeft <= 0)
            return;
        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);
    (0, react_1.useEffect)(() => {
        if (timeLeft > 0)
            return;
        const interval = setInterval(() => {
            reset();
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);
    if (timeLeft <= 0) {
        return (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { gap: 1, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "AutoSync check in progress..." }), (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 16 })] });
    }
    const dur = dayjs_1.default.duration(timeLeft, "seconds");
    const mins = dur.minutes();
    const secs = dur.seconds();
    const formatted = mins > 0
        ? secs > 0
            ? `${mins}m ${secs}s`
            : `${mins}m`
        : `${secs}s`;
    return (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["Next AutoSync check will occur in approx: ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: formatted })] });
}
//# sourceMappingURL=CountdownTimer.js.map