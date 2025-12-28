"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestReleaseVersion = getLatestReleaseVersion;
async function getLatestReleaseVersion() {
    const url = "https://api.github.com/repos/emu-sync/EmuSync/releases/latest";
    const response = await fetch(url);
    if (!response.ok) {
        return "";
    }
    const json = await response.json();
    return json.tag_name.replace("v", "");
}
//# sourceMappingURL=release-version-api.js.map