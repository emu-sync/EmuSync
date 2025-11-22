import { Pre } from "@/renderer/components/Pre";
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";
import { CircularProgress, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
    seconds: number;
    reset: () => void
}

export default function CountdownTimer({ 
    seconds, reset
}: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
        setTimeLeft(seconds);
    }, [seconds]);

    useEffect(() => {

        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    useEffect(() => {

        if (timeLeft > 0) return;

        const interval = setInterval(() => {
            reset();
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    if (timeLeft <= 0) {
        return <HorizontalStack gap={1}>
            <Typography>
                AutoSync check in progress...
            </Typography>
            <CircularProgress size={16} />
        </HorizontalStack>
    }

    const dur = dayjs.duration(timeLeft, "seconds");
    const mins = dur.minutes();
    const secs = dur.seconds();

    const formatted =
        mins > 0
            ? secs > 0
                ? `${mins}m ${secs}s`
                : `${mins}m`
            : `${secs}s`;

    return <Typography>
        Next AutoSync check will occur in approx: <Pre>{formatted}</Pre>
    </Typography>;
}
