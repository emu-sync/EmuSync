"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DisplayDate;
const jsx_runtime_1 = require("react/jsx-runtime");
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = require("react");
function DisplayDate({ date, displayAsFromNow, format }) {
    const [tick, setTick] = (0, react_1.useState)(0); // Used to trigger re-renders
    (0, react_1.useEffect)(() => {
        if (displayAsFromNow) {
            const interval = setInterval(() => {
                setTick(t => t + 1); // Trigger re-render
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [displayAsFromNow]);
    const dayJsDate = (0, react_1.useMemo)(() => {
        return (0, dayjs_1.default)(date);
    }, [date, tick]);
    if (!date) {
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "Unknown date" });
    }
    if (displayAsFromNow) {
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: dayJsDate.fromNow() });
    }
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: dayJsDate.format(format) });
}
//# sourceMappingURL=DisplayDate.js.map