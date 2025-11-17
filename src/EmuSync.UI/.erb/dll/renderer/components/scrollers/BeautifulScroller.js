"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BeautifulScroller;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const simplebar_react_1 = __importDefault(require("simplebar-react"));
require("simplebar-react/dist/simplebar.min.css");
const StyledSimpleBar = (0, material_1.styled)(simplebar_react_1.default) `
  
  .simplebar-scrollbar::before {
    background-color: rgb(160,160,160,.5)
  }

  .simplebar-scrollbar.simplebar-visible::before {
    opacity: 1;
  }

  .simplebar-track.simplebar-vertical {
    width: 10px;
  }

  .simplebar-track.simplebar-horizontal .simplebar-scrollbar {
    height: 6px;
  }

  .simplebar-mask {
    z-index: inherit;
  }
    
  .simplebar-wrapper:hover ~ .simplebar-track > .simplebar-scrollbar:before { opacity: 1 !important; }
`;
function BeautifulScroller({ children, maxHeight, minHeight }) {
    return (0, jsx_runtime_1.jsx)(StyledSimpleBar, { style: { maxHeight, minHeight }, children: children });
}
//# sourceMappingURL=BeautifulScroller.js.map