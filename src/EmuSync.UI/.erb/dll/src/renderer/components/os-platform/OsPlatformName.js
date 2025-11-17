"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OsPlatformName;
const jsx_runtime_1 = require("react/jsx-runtime");
const os_platforms_1 = require("@/renderer/components/os-platform/os-platforms");
const material_1 = require("@mui/material");
const react_1 = require("react");
function OsPlatformName({ osPlatform }) {
    const platformDetails = (0, react_1.useMemo)(() => {
        if (!osPlatform)
            return null;
        return os_platforms_1.osPlatforms[osPlatform];
    }, [osPlatform]);
    return (0, jsx_runtime_1.jsx)(material_1.Typography, { children: platformDetails?.name ?? "Unknown" });
}
//# sourceMappingURL=OsPlatformName.js.map