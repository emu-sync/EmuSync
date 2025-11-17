//create a strongly typed object of any constants / shared values
//don't risk put secrets in here or they could be exposed front-end


//define the interface for SiteSettings
interface SiteSettings {
    layoutProperties: {
        sidebarTransitionTime: string;
        sidebarMinimisedWidth: string;
        sidebarWidth: string;
        headerHeight: number;
        mainPadding: string;
    };
}

export const siteSettings: SiteSettings = {
    layoutProperties: {
        sidebarTransitionTime: ".1s",
        sidebarMinimisedWidth: "70px",
        sidebarWidth: "240px",
        headerHeight: 55,
        mainPadding: "14px",
    },
};