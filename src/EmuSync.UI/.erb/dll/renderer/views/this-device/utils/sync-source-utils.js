"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSyncSource = exports.storageProviderMap = void 0;
exports.transformSyncSource = transformSyncSource;
const enums_1 = require("@/renderer/types/enums");
const dropbox_logo_png_1 = __importDefault(require("@assets/images/dropbox-logo.png"));
const google_drive_icon_webp_1 = __importDefault(require("@assets/images/google-drive-icon.webp"));
exports.storageProviderMap = {
    [enums_1.StorageProvider.GoogleDrive]: {
        name: "Google drive",
        image: google_drive_icon_webp_1.default
    },
    [enums_1.StorageProvider.Dropbox]: {
        name: "Dropbox",
        image: dropbox_logo_png_1.default
    },
};
exports.defaultSyncSource = {
    name: ""
};
function transformSyncSource(syncSource) {
    return {
        name: syncSource.name
    };
}
//# sourceMappingURL=sync-source-utils.js.map