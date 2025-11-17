import { Box, Button, Collapse, Divider, List, Typography } from "@mui/material";

import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";
import { NavLink } from "@/renderer/layout/Sidebar/nav-links";
import NavItem from "@/renderer/layout/Sidebar/NavItem";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLocation } from "react-router-dom";

interface SidebarGroupProps {
    header: string;
    links: NavLink[];
    showText: boolean;
    onLinkClick: () => void;
}

export default function SidebarGroup({
    header, links, showText,
    onLinkClick
}: SidebarGroupProps) {

    const location = useLocation();
    const pathname = location.pathname;
    const expanded = true;

    // const subHeader = <Box
    //     sx={{
    //         px: 3
    //     }}
    // >

    //     {
    //         !showText ?
    //             <Divider
    //                 sx={{
    //                     height: 18,
    //                     mb: 2,
    //                     borderColor: "primary.main",
    //                     opacity: expanded ? 1 : 0
    //                 }}
    //             />
    //             :
    //             <Button
    //                 sx={{
    //                     height: 30,
    //                     width: "113%",
    //                     ml: "-12.5px!important",
    //                 }}

    //                 color="secondary"
    //                 title={expanded ? "Collapse section" : "Expand section"}
    //             >
    //                 <HorizontalStack justifyContent="space-between" sx={{ mr: "-5px!important" }}>
    //                     <Typography color="primary.main" fontSize=".85rem">
    //                         {header}
    //                     </Typography>
    //                     {
    //                         expanded ?
    //                             <ExpandLessIcon color="action" />
    //                             :
    //                             <ExpandMoreIcon color="action" />
    //                     }
    //                 </HorizontalStack>
    //             </Button>
    //     }
    // </Box>

    return <List
        sx={{
            mb: 1,
            py: 0,
            zIndex: 0,
            display: "flex",
            flexDirection: "column",
            gap: 1
        }}
        // subheader={
        //     subHeader
        // }
    >
            {
                links.map((link, linkIndex) => {

                    //determine if it's selected by reusing the pathMatcher function on the route object
                    const selected = link.isSelected(pathname);

                    return <NavItem
                        key={`nav-item-${linkIndex}`}
                        href={link.href}
                        linkText={link.linkText}
                        showText={showText}
                        icon={<link.icon />}
                        onClick={onLinkClick}
                        selected={selected}
                    />
                })
            }
    </List>
}
