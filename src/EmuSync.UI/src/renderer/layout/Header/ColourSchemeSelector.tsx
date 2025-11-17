"use client";

import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, useColorScheme } from '@mui/material';

import { useCallback } from "react";

type Mode = 'light' | 'dark' | 'system';

export default function ColourSchemeSelector() {

    const { mode, setMode } = useColorScheme();

    const handleChange = useCallback((event: SelectChangeEvent) => {

        const newMode = event.target.value as Mode;
        setMode(newMode);

    }, []);

    return <FormControl
        size="small"
        sx={{
            width: "100%"
        }}
    >
        <InputLabel>Theme</InputLabel>
        <Select
            value={mode ?? "system"}
            label="Theme"
            onChange={handleChange}
            MenuProps={{ disableScrollLock: true }}
        >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="system">System</MenuItem>
        </Select>
    </FormControl>
}