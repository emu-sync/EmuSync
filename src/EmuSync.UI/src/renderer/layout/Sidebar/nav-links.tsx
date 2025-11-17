import { Route, routes } from "@/renderer/routes";
import { SvgIconComponent } from "@mui/icons-material";

export interface NavLink {
    href: string;
    linkText: string;
    icon: SvgIconComponent;
    isSelected: (pathname: string) => boolean;
}

//permissionCallback = the callback function to determine if the user can see the section
//this will take the permissions object


function getNavLink(route: Route,  alternatePathMatchRoutes?: Route[]): NavLink {

    //alternatePathMatchRoutes = array of routes that can also match on the path name

    return {
        href: route.href,
        linkText: route.title,
        icon: route.icon,
        isSelected: function (pathname: string) {

            pathname = pathname?.toLowerCase();
            let selected = route.pathMatcher(pathname);

            //if we matched, just get out
            //otherwise, don't continue if we don't have any alternate paths to check
            if (selected || typeof alternatePathMatchRoutes === "undefined") return selected;

            //use our path matcher functions to determine if the nav item should show as selected
            //this keeps all logic in one place (routes.js)
            for (const index in alternatePathMatchRoutes) {
                const alternateRoute = alternatePathMatchRoutes[index];
                selected = alternateRoute.pathMatcher(pathname);
                if (selected) break;
            }

            return selected;
        },
    };
};

export const navLinks = [
    {
        name: "General",
        key: "general",
        links: [
            getNavLink(routes.home),
            getNavLink(routes.game, [routes.gameEdit, routes.gameAdd]),
            getNavLink(routes.thisDevice),
            getNavLink(routes.allDevices),
            getNavLink(routes.about),
        ],
    },
];