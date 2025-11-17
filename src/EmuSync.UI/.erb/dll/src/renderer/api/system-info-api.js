"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgentSystemInfo = getAgentSystemInfo;
exports.checkApiIsRunning = checkApiIsRunning;
const api_helper_1 = require("@/renderer/api/api-helper");
const controller = "System";
async function getAgentSystemInfo() {
    const path = `${controller}/Info`;
    return await (0, api_helper_1.get)({
        path
    });
}
async function checkApiIsRunning() {
    const path = `${controller}/HealthCheck`;
    await (0, api_helper_1.postWithNoResponse)({
        path
    });
    return true;
}
//# sourceMappingURL=system-info-api.js.map