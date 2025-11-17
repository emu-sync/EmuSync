import { navLinks } from "@/renderer/layout/Sidebar/nav-links";
import SidebarGroup from "@/renderer/layout/Sidebar/SidebarGroup";
interface SidebarContentProps {
    mobileDrawerToggle: (forceState?: boolean) => void;
    sidebarMinimised: boolean;
}

export default function SidebarContent({
    mobileDrawerToggle, sidebarMinimised
}: SidebarContentProps) {
   
    return <>

        {
            navLinks.map((group, groupIndex) => {

                return <SidebarGroup
                    key={`nav-group-${groupIndex}`}
                    header={group.name}
                    links={group.links}
                    showText={!sidebarMinimised}
                    onLinkClick={() => mobileDrawerToggle(false)}
                />
            })
        }


    </>
}
