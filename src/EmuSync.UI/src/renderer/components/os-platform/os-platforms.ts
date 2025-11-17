import { OsPlatform } from "@/renderer/types/enums";


import microsoftLogo from "@assets/images/microsoft-logo.png";
import appleLogo from "@assets/images/apple-logo.png";
import linuxLogo from "@assets/images/linux-logo.png";

export const osPlatforms = {
    [OsPlatform.Unknown]: {
        name: "Unknown platform",
        image: null
    },
    [OsPlatform.Windows]: {
        name: "Windows",
        image: microsoftLogo
    },
    [OsPlatform.Linux]: {
        name: "Linux",
        image: linuxLogo
    },
    [OsPlatform.Mac]: {
        name: "Apple",
        image: appleLogo
    }
}