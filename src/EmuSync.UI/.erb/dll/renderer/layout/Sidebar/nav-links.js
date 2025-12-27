"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navLinks = void 0;
const routes_1 = require("@/renderer/routes");
//permissionCallback = the callback function to determine if the user can see the section
//this will take the permissions object
function getNavLink(route, alternatePathMatchRoutes) {
    //alternatePathMatchRoutes = array of routes that can also match on the path name
    return {
        href: route.href,
        linkText: route.title,
        icon: route.icon,
        isSelected: function (pathname) {
            pathname = pathname?.toLowerCase();
            let selected = route.pathMatcher(pathname);
            //if we matched, just get out
            //otherwise, don't continue if we don't have any alternate paths to check
            if (selected || typeof alternatePathMatchRoutes === "undefined")
                return selected;
            //use our path matcher functions to determine if the nav item should show as selected
            //this keeps all logic in one place (routes.js)
            for (const index in alternatePathMatchRoutes) {
                const alternateRoute = alternatePathMatchRoutes[index];
                selected = alternateRoute.pathMatcher(pathname);
                if (selected)
                    break;
            }
            return selected;
        },
    };
}
;
exports.navLinks = [
    {
        name: "General",
        key: "general",
        links: [
            getNavLink(routes_1.routes.home),
            getNavLink(routes_1.routes.game, [routes_1.routes.gameEdit, routes_1.routes.gameAdd]),
            getNavLink(routes_1.routes.thisDevice),
            getNavLink(routes_1.routes.allDevices),
            getNavLink(routes_1.routes.localSyncHistory),
            getNavLink(routes_1.routes.about),
        ],
    },
];
//# sourceMappingURL=nav-links.js.map