import { List, ListItem } from "@mui/material";
import React from "react";


interface ReadmeListProps {
    list: string[] | React.ReactNode[];
    listStyle: "disc" | "decimal";
}

export default function ReadmeList({
    list, listStyle
}: ReadmeListProps) {

    return <List
        dense
        disablePadding
        sx={{
            listStyleType: listStyle,
            paddingInlineStart: 2.5
        }}
    >
        {
            list.map((listItem, index) => {
                return <ListItem
                    key={index}
                    sx={{ display: "list-item" }}
                >
                    {listItem}
                </ListItem >
            })
        }
    </List>
}