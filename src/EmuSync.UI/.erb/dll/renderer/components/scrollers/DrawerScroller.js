"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DrawerScroller;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const simplebar_react_1 = __importDefault(require("simplebar-react"));
require("simplebar-react/dist/simplebar.min.css");
const StyledSimpleBar = (0, material_1.styled)(simplebar_react_1.default) `
  flex-grow: 1;
  max-height: 100%;
  overflow: auto;

  /* Customize the scrollbar */
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
function DrawerScroller({ children }) {
    return (0, jsx_runtime_1.jsx)(StyledSimpleBar, { children: children });
}
//# sourceMappingURL=DrawerScroller.js.map