"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
const electron_1 = require("electron");
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
    openDirectory: (path) => electron_1.ipcRenderer.invoke('dialog:openDirectory', path),
    openExternalLink: (link) => electron_1.ipcRenderer.invoke('shell:openExternal', link),
    apiUrl: process.env.API_URL ?? "http://localhost:5353",
    releaseVersion: process.env.RELEASE_VERSION ?? "",
    isWindows: process.platform === 'win32',
    isLinux: process.platform === 'linux',
    isMac: process.platform === 'darwin'
};
electron_1.contextBridge.exposeInMainWorld('electron', electronHandler);
//# sourceMappingURL=preload.js.map