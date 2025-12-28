"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MarkdownRenderer;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_remark_1 = require("react-remark");
require("./MarkdownRenderer.css");
function MarkdownRenderer({ markdown }) {
    const [currentMarkdown, setCurrentMarkdown] = (0, react_remark_1.useRemark)();
    (0, react_1.useEffect)(() => {
        setCurrentMarkdown(markdown);
    }, [markdown]);
    return (0, jsx_runtime_1.jsx)("div", { className: "custom-markdown", children: currentMarkdown });
}
//# sourceMappingURL=MarkdownRenderer.js.map