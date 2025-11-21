import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

interface FromNowProps {
    displayAsFromNow: true;
    format?: null;
}

interface FormattedProps {
    displayAsFromNow?: false;
    format: string;
}

type DisplayDateProps = (FromNowProps | FormattedProps) & {
    date?: Date | null;
}

export default function DisplayDate({
    date, displayAsFromNow, format
}: DisplayDateProps) {

    const [tick, setTick] = useState(0); // Used to trigger re-renders

    useEffect(() => {
        if (displayAsFromNow) {
            const interval = setInterval(() => {
                setTick(t => t + 1); // Trigger re-render
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [displayAsFromNow]);

    const dayJsDate = useMemo(() => {

        return dayjs.utc(date).local();

    }, [date, tick]);

    if (!date) {
        return <>
            Unknown date
        </>;
    }

    if (displayAsFromNow) {
        return <>
            {
                dayJsDate.fromNow()
            }
        </>

    }

    return <>
        {
            dayJsDate.format(format)
        }
    </>
}