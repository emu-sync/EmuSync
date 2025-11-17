"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.osPlatforms = void 0;
const enums_1 = require("@/renderer/types/enums");
const microsoft_logo_png_1 = __importDefault(require("@assets/images/microsoft-logo.png"));
const apple_logo_png_1 = __importDefault(require("@assets/images/apple-logo.png"));
const linux_logo_png_1 = __importDefault(require("@assets/images/linux-logo.png"));
exports.osPlatforms = {
    [enums_1.OsPlatform.Unknown]: {
        name: "Unknown platform",
        image: null
    },
    [enums_1.OsPlatform.Windows]: {
        name: "Windows",
        image: microsoft_logo_png_1.default
    },
    [enums_1.OsPlatform.Linux]: {
        name: "Linux",
        image: linux_logo_png_1.default
    },
    [enums_1.OsPlatform.Mac]: {
        name: "Apple",
        image: apple_logo_png_1.default
    }
};
//# sourceMappingURL=os-platforms.js.map