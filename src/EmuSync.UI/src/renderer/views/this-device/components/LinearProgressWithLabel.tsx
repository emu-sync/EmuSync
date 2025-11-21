import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";

export default function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return <HorizontalStack>
        <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
            <Typography
                variant="body2"
                sx={{ color: 'text.secondary' }}
            >
                {`${props.value}%`}
            </Typography>
        </Box>
    </HorizontalStack>
}
