import { Pre } from "@/renderer/components/Pre";
import dayjs from "dayjs";

interface TimeAgoProps {
  secondsAgo: number;
}

export default function TimeAgo({ 
    secondsAgo 
}: TimeAgoProps) {
  const pastTime = dayjs.utc().add(secondsAgo, "second"); // negative seconds in the past
  return <Pre>{pastTime.fromNow()}</Pre>;
}
