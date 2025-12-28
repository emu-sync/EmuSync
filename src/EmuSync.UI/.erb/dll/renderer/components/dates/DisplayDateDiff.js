"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DisplayDateDiff;
const jsx_runtime_1 = require("react/jsx-runtime");
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = require("react");
function DisplayDateDiff({ date, comparisonDate }) {
    const [tick, setTick] = (0, react_1.useState)(0); // Used to trigger re-renders
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1); // Trigger re-render
        }, 10000);
        return () => clearInterval(interval);
    }, []);
    const dayJsDate = (0, react_1.useMemo)(() => {
        if (!date)
            return null;
        return dayjs_1.default.utc(date);
    }, [date, tick]);
    const dayJsComparison = (0, react_1.useMemo)(() => {
        return comparisonDate ? dayjs_1.default.utc(comparisonDate) : dayjs_1.default.utc();
    }, [comparisonDate, tick]);
    const humanDiff = (0, react_1.useMemo)(() => {
        if (!dayJsDate)
            return null;
        let diffSeconds = Math.abs(dayJsComparison.diff(dayJsDate, "second"));
        if (diffSeconds < 60) {
            return `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""}`;
        }
        let diffMinutes = Math.floor(diffSeconds / 60);
        if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""}`;
        }
        let diffHours = Math.floor(diffMinutes / 60);
        let remainingMinutes = diffMinutes % 60;
        if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? "s" : ""}` +
                (remainingMinutes > 0 ? `, ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}` : "");
        }
        let diffDays = Math.floor(diffHours / 24);
        let remainingHours = diffHours % 24;
        return `${diffDays} day${diffDays !== 1 ? "s" : ""}` +
            (remainingHours > 0 ? `, ${remainingHours} hour${remainingHours !== 1 ? "s" : ""}` : "");
    }, [dayJsDate, dayJsComparison]);
    if (date && comparisonDate) {
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: humanDiff });
    }
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
}
//# sourceMappingURL=DisplayDateDiff.js.map