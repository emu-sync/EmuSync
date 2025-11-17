"use strict";
/* eslint global-require: off, no-console: off, promise/always-return: off */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const electron_updater_1 = require("electron-updater");
const electron_log_1 = __importDefault(require("electron-log"));
const menu_1 = __importDefault(require("./menu"));
const util_1 = require("./util");
class AppUpdater {
    constructor() {
        electron_log_1.default.transports.file.level = 'info';
        electron_updater_1.autoUpdater.logger = electron_log_1.default;
        electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
    }
}
let mainWindow = null;
if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
}
const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
if (isDebug) {
    require('electron-debug').default();
}
//IPC handler for directory picking
electron_1.ipcMain.handle('dialog:openDirectory', async () => {
    const { dialog } = await import('electron');
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    });
    return result.canceled ? null : result.filePaths[0];
});
electron_1.ipcMain.handle('shell:openExternal', async (e, link) => {
    electron_1.shell.openExternal(link);
});
const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];
    return installer
        .default(extensions.map((name) => installer[name]), forceDownload)
        .catch(console.log);
};
const createWindow = async () => {
    if (isDebug) {
        await installExtensions();
    }
    const RESOURCES_PATH = electron_1.app.isPackaged
        ? path_1.default.join(process.resourcesPath, 'assets')
        : path_1.default.join(__dirname, '../../assets');
    const getAssetPath = (...paths) => {
        return path_1.default.join(RESOURCES_PATH, ...paths);
    };
    mainWindow = new electron_1.BrowserWindow({
        show: false,
        width: 1000,
        height: 720,
        minWidth: 635,
        minHeight: 635,
        icon: getAssetPath('icon.png'),
        webPreferences: {
            preload: electron_1.app.isPackaged
                ? path_1.default.join(__dirname, 'preload.js')
                : path_1.default.join(__dirname, '../../.erb/dll/preload.js'),
        },
    });
    if (!isDebug) {
        mainWindow.setMenu(null);
    }
    mainWindow.loadURL((0, util_1.resolveHtmlPath)('index.html'));
    mainWindow.on('ready-to-show', () => {
        if (!mainWindow) {
            throw new Error('"mainWindow" is not defined');
        }
        if (process.env.START_MINIMIZED) {
            mainWindow.minimize();
        }
        else {
            mainWindow.show();
        }
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    if (!isDebug) {
        mainWindow.setMenu(null);
    }
    else {
        const menuBuilder = new menu_1.default(mainWindow);
        menuBuilder.buildMenu();
    }
    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater();
};
/**
 * Add event listeners...
 */
electron_1.app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app
    .whenReady()
    .then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null)
            createWindow();
    });
})
    .catch(console.log);
//# sourceMappingURL=main.js.map