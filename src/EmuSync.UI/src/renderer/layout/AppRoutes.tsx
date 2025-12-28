import { routes } from "@/renderer/routes";
import AboutScreen from "@/renderer/views/about/AboutScreen";
import AllDevicesListScreen from "@/renderer/views/all-devices/AllDevicesListScreen";
import GameAddScreen from "@/renderer/views/game/GameAddScreen";
import GameEditScreen from "@/renderer/views/game/GameEditScreen";
import GameListScreen from "@/renderer/views/game/GameListScreen";
import HomeScreen from "@/renderer/views/home/HomeScreen";
import LocalSyncHistoryScreen from "@/renderer/views/local-sync-history/LocalSyncHistoryScreen";
import NotFoundScreen from "@/renderer/views/NotFoundScreen";
import ThisDeviceScreen from "@/renderer/views/this-device/ThisDeviceScreen";
import { Route, Routes } from "react-router-dom";

export default function AppRoutes() {

    return <Routes>
        <Route path={routes.home.href} element={<HomeScreen />} />

        <Route path={routes.localSyncHistory.href} element={<LocalSyncHistoryScreen />} />
        <Route path={routes.game.href} element={<GameListScreen />} />

        <Route path={routes.gameAdd.href} element={<GameAddScreen />} />
        <Route path={routes.gameEdit.href} element={<GameEditScreen />} />

        <Route path={routes.thisDevice.href} element={<ThisDeviceScreen />} />
        <Route path={routes.allDevices.href} element={<AllDevicesListScreen />} />
        <Route path={routes.about.href} element={<AboutScreen />} />
        <Route path="*" element={NotFoundScreen()} />
    </Routes>
}