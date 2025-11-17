"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localSyncSourceAtom = exports.defaultSyncSource = void 0;
const jotai_1 = require("jotai");
exports.defaultSyncSource = {
    id: "",
    name: "",
    storageProviderId: null,
    platformId: 0
};
exports.localSyncSourceAtom = (0, jotai_1.atom)(exports.defaultSyncSource);
//# sourceMappingURL=local-sync-source.js.map