"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRoutes = exports.routes = void 0;
exports.getMatchingRoute = getMatchingRoute;
const Computer_1 = __importDefault(require("@mui/icons-material/Computer"));
const Home_1 = __importDefault(require("@mui/icons-material/Home"));
const Info_1 = __importDefault(require("@mui/icons-material/Info"));
const VideogameAsset_1 = __importDefault(require("@mui/icons-material/VideogameAsset"));
const Devices_1 = __importDefault(require("@mui/icons-material/Devices"));
const History_1 = __importDefault(require("@mui/icons-material/History"));
//create a strongly typed object of our site routes so we can reference them throughout the site
//each route will also have a callback function to determine if the user can access it, accepting the user permissions object
exports.routes = {
    home: {
        href: "/",
        title: "Home",
        pathMatcher: exactPathMatch,
        icon: Home_1.default
    },
    localSyncHistory: {
        href: "/local-sync-history",
        title: "Local sync history",
        pathMatcher: exactPathMatch,
        icon: History_1.default
    },
    game: {
        href: "/game",
        title: "Games",
        pathMatcher: exactPathMatch,
        icon: VideogameAsset_1.default
    },
    gameEdit: {
        href: "/game/edit",
        title: "Edit game",
        pathMatcher: (path) => editPath("game", path),
        icon: VideogameAsset_1.default
    },
    gameAdd: {
        href: "/game/add",
        title: "Add game",
        pathMatcher: exactPathMatch,
        icon: VideogameAsset_1.default
    },
    thisDevice: {
        href: "/this-device",
        title: "This device",
        pathMatcher: exactPathMatch,
        icon: Computer_1.default
    },
    allDevices: {
        href: "/all-devices",
        title: "All devices",
        pathMatcher: exactPathMatch,
        icon: Devices_1.default
    },
    about: {
        href: "/about",
        title: "About",
        pathMatcher: exactPathMatch,
        icon: Info_1.default
    },
};
exports.allRoutes = Object.values(exports.routes);
//function to determine if the path is a matching route
function getMatchingRoute(pathName) {
    //loop through all routes and find a match on the path name
    for (const key in exports.routes) {
        const routeKey = key;
        const route = exports.routes[routeKey];
        //use the custom path matcher funtions to determine if we have a match on the route
        const isMatch = route.pathMatcher(pathName);
        if (isMatch) {
            return route;
        }
    }
    return null;
}
function editPath(segment, path) {
    const regex = "(/" + segment + "/edit)[/]?[0-9]?";
    return new RegExp(regex, "i").test(path);
}
function exactPathMatch(path) {
    return path?.toLowerCase() === this.href.toLowerCase();
}
//# sourceMappingURL=routes.js.map