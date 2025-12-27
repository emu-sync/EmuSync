"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDropboxAuthUrl = getDropboxAuthUrl;
exports.getGoogleAuthUrl = getGoogleAuthUrl;
exports.getMicrosoftAuthUrl = getMicrosoftAuthUrl;
const api_helper_1 = require("@/renderer/api/api-helper");
const controller = "Auth";
async function getDropboxAuthUrl() {
    const path = `${controller}/Dropbox/AuthUrl`;
    return await (0, api_helper_1.get)({
        path
    });
}
async function getGoogleAuthUrl() {
    const path = `${controller}/Google/AuthUrl`;
    return await (0, api_helper_1.get)({
        path
    });
}
async function getMicrosoftAuthUrl() {
    const path = `${controller}/Microsoft/AuthUrl`;
    return await (0, api_helper_1.get)({
        path
    });
}
//# sourceMappingURL=auth-api.js.map