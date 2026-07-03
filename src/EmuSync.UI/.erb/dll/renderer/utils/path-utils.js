"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalisePathDelims = normalisePathDelims;
function normalisePathDelims(path, isWindows) {
    return isWindows
        ? path.replace(/\//g, "\\") //normalise → Windows
        : path.replace(/\\/g, "/"); //normalise → mac + linux
}
//# sourceMappingURL=path-utils.js.map