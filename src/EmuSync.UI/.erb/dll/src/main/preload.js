"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
const electron_1 = require("electron");
const package_json_1 = require("../../package.json");
const electronHandler = {
    ipcRenderer: {
        sendMessage(channel, ...args) {
            electron_1.ipcRenderer.send(channel, ...args);
        },
        on(channel, func) {
            const subscription = (_event, ...args) => func(...args);
            electron_1.ipcRenderer.on(channel, subscription);
            return () => {
                electron_1.ipcRenderer.removeListener(channel, subscription);
            };
        },
        once(channel, func) {
            electron_1.ipcRenderer.once(channel, (_event, ...args) => func(...args));
        },
    },
    openDirectory: () => electron_1.ipcRenderer.invoke('dialog:openDirectory'),
    openExternalLink: (link) => electron_1.ipcRenderer.invoke('shell:openExternal', link),
    uiVersion: package_json_1.version,
    apiUrl: process.env.API_URL ?? "http://localhost:5353"
};
electron_1.contextBridge.exposeInMainWorld('electron', electronHandler);
//# sourceMappingURL=preload.js.map