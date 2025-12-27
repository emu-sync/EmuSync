"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncTypeOptions = exports.SyncType = exports.gameSyncStatusOptions = exports.GameSyncStatus = exports.OsPlatform = exports.StorageProvider = void 0;
var StorageProvider;
(function (StorageProvider) {
    StorageProvider[StorageProvider["GoogleDrive"] = 1] = "GoogleDrive";
    StorageProvider[StorageProvider["Dropbox"] = 2] = "Dropbox";
    StorageProvider[StorageProvider["OneDrive"] = 3] = "OneDrive";
})(StorageProvider || (exports.StorageProvider = StorageProvider = {}));
var OsPlatform;
(function (OsPlatform) {
    OsPlatform[OsPlatform["Unknown"] = 0] = "Unknown";
    OsPlatform[OsPlatform["Windows"] = 1] = "Windows";
    OsPlatform[OsPlatform["Linux"] = 2] = "Linux";
    OsPlatform[OsPlatform["Mac"] = 3] = "Mac";
})(OsPlatform || (exports.OsPlatform = OsPlatform = {}));
var GameSyncStatus;
(function (GameSyncStatus) {
    GameSyncStatus[GameSyncStatus["Unknown"] = 0] = "Unknown";
    GameSyncStatus[GameSyncStatus["RequiresDownload"] = 1] = "RequiresDownload";
    GameSyncStatus[GameSyncStatus["RequiresUpload"] = 2] = "RequiresUpload";
    GameSyncStatus[GameSyncStatus["InSync"] = 3] = "InSync";
    GameSyncStatus[GameSyncStatus["UnsetDirectory"] = 4] = "UnsetDirectory";
})(GameSyncStatus || (exports.GameSyncStatus = GameSyncStatus = {}));
exports.gameSyncStatusOptions = [
    { value: GameSyncStatus.Unknown, label: "Unknown" },
    { value: GameSyncStatus.RequiresDownload, label: "Requires download" },
    { value: GameSyncStatus.RequiresUpload, label: "Requires upload" },
    { value: GameSyncStatus.InSync, label: "In sync" },
    { value: GameSyncStatus.UnsetDirectory, label: "Unset directory" },
];
var SyncType;
(function (SyncType) {
    SyncType[SyncType["Upload"] = 1] = "Upload";
    SyncType[SyncType["Download"] = 2] = "Download";
})(SyncType || (exports.SyncType = SyncType = {}));
exports.syncTypeOptions = [
    { value: SyncType.Upload, label: "Upload" },
    { value: SyncType.Download, label: "Download" },
];
//# sourceMappingURL=enums.js.map