import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

interface DisplayDateProps {
    date?: Date | null;
    comparisonDate?: Date | null;
}

export default function DisplayDateDiff({
    date, comparisonDate
}: DisplayDateProps) {

    const [tick, setTick] = useState(0); // Used to trigger re-renders

    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1); // Trigger re-render
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const dayJsDate = useMemo(() => {
        if (!date) return null;
        return dayjs.utc(date);
    }, [date, tick]);

    const dayJsComparison = useMemo(() => {
        return comparisonDate ? dayjs.utc(comparisonDate) : dayjs.utc();
    }, [comparisonDate, tick]);


    const humanDiff = useMemo(() => {
        if (!dayJsDate) return null;

        let diffSeconds = Math.abs(dayJsComparison.diff(dayJsDate, "second"));

        if (diffSeconds < 60) {
            return `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""}`;
        }

        let diffMinutes = Math.floor(diffSeconds / 60);
        if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""}`;
        }

        let diffHours = Math.floor(diffMinutes / 60);
        let remainingMinutes = diffMinutes % 60;
        if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? "s" : ""}` +
                (remainingMinutes > 0 ? `, ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}` : "");
        }

        let diffDays = Math.floor(diffHours / 24);
        let remainingHours = diffHours % 24;
        return `${diffDays} day${diffDays !== 1 ? "s" : ""}` +
            (remainingHours > 0 ? `, ${remainingHours} hour${remainingHours !== 1 ? "s" : ""}` : "");

    }, [dayJsDate, dayJsComparison]);

    if (date && comparisonDate) {
        return <>{humanDiff}</>
    }

    return <></>
}