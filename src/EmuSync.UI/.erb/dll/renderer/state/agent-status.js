"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentStatusAtom = void 0;
const jotai_1 = require("jotai");
const defaultAgentStatus = {
    isRunning: false,
    hasChecked: false
};
exports.agentStatusAtom = (0, jotai_1.atom)(defaultAgentStatus);
//# sourceMappingURL=agent-status.js.map