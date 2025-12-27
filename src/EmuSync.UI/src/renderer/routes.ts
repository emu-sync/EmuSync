import ComputerIcon from '@mui/icons-material/Computer';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';

import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import DevicesIcon from '@mui/icons-material/Devices';

import { SvgIconComponent } from "@mui/icons-material";
import HistoryIcon from '@mui/icons-material/History';

export interface Route {
    href: string;
    title: string;
    pathMatcher: (path: string) => boolean;
    icon: SvgIconComponent;
}

export interface Routes {
    home: Route;

    localSyncHistory: Route;

    game: Route;
    gameAdd: Route;
    gameEdit: Route;
    
    thisDevice: Route;
    allDevices: Route;
    about: Route;
}

//create a strongly typed object of our site routes so we can reference them throughout the site
//each route will also have a callback function to determine if the user can access it, accepting the user permissions object
export const routes: Routes = {
    home: {
        href: "/",
        title: "Home",
        pathMatcher: exactPathMatch,
        icon: HomeIcon
    },
    localSyncHistory: {
        href: "/local-sync-history",
        title: "Local sync history",
        pathMatcher: exactPathMatch,
        icon: HistoryIcon
    },
    game: {
        href: "/game",
        title: "Games",
        pathMatcher: exactPathMatch,
        icon: VideogameAssetIcon
    },
    gameEdit: {
        href: "/game/edit",
        title: "Edit game",
        pathMatcher: (path: string) => editPath("game", path),
        icon: VideogameAssetIcon
    },
    gameAdd: {
        href: "/game/add",
        title: "Add game",
        pathMatcher: exactPathMatch,
        icon: VideogameAssetIcon
    },
    
    thisDevice: {
        href: "/this-device",
        title: "This device",
        pathMatcher: exactPathMatch,
        icon: ComputerIcon
    },
    
    allDevices: {
        href: "/all-devices",
        title: "All devices",
        pathMatcher: exactPathMatch,
        icon: DevicesIcon
    },
    
    about: {
        href: "/about",
        title: "About",
        pathMatcher: exactPathMatch,
        icon: InfoIcon
    },
};



export const allRoutes: Route[] = Object.values(routes);

//function to determine if the path is a matching route
export function getMatchingRoute(pathName: string) {

    //loop through all routes and find a match on the path name
    for (const key in routes) {

        const routeKey = key as keyof Routes;
        const route = routes[routeKey];

        //use the custom path matcher funtions to determine if we have a match on the route
        const isMatch = route.pathMatcher(pathName);

        if (isMatch) {
            return route;
        }
    }

    return null;
}

function editPath(segment: string, path: string) {

    const regex = "(/" + segment + "/edit)[/]?[0-9]?";
    return new RegExp(regex, "i").test(path)
}

function exactPathMatch(this: Route, path: string) {
    return path?.toLowerCase() === this.href.toLowerCase();
}