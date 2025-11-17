"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColourSchemeSelector;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const react_1 = require("react");
function ColourSchemeSelector() {
    const { mode, setMode } = (0, material_1.useColorScheme)();
    const handleChange = (0, react_1.useCallback)((event) => {
        const newMode = event.target.value;
        setMode(newMode);
    }, []);
    return (0, jsx_runtime_1.jsxs)(material_1.FormControl, { size: "small", sx: {
            width: "100%"
        }, children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { children: "Theme" }), (0, jsx_runtime_1.jsxs)(material_1.Select, { value: mode ?? "system", label: "Theme", onChange: handleChange, MenuProps: { disableScrollLock: true }, children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: "light", children: "Light" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: "dark", children: "Dark" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: "system", children: "System" })] })] });
}
//# sourceMappingURL=ColourSchemeSelector.js.map