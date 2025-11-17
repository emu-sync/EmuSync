"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OsPlatformLogo;
const jsx_runtime_1 = require("react/jsx-runtime");
const os_platforms_1 = require("@/renderer/components/os-platform/os-platforms");
const system_1 = require("@mui/system");
const react_1 = require("react");
function OsPlatformLogo({ osPlatform }) {
    const platformDetails = (0, react_1.useMemo)(() => {
        if (!osPlatform)
            return null;
        return os_platforms_1.osPlatforms[osPlatform];
    }, [osPlatform]);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: platformDetails?.image &&
            (0, jsx_runtime_1.jsx)(system_1.Box, { sx: {
                    height: 35,
                    width: 35,
                    background: "white",
                    borderRadius: 50,
                    padding: "0.45rem"
                }, children: (0, jsx_runtime_1.jsx)("img", { src: platformDetails.image, alt: "Platform logo", style: {
                        height: "100%",
                        width: "auto",
                    } }) }) });
}
//# sourceMappingURL=OsPlatformLogo.js.map