import { cacheKeys } from "@/renderer/api/cache-keys";
import { useQuery } from "@tanstack/react-query";

export interface ChangeLogEntry {
    version: string;
    markdown: string;
}

const newsUrl = "https://raw.githubusercontent.com/emu-sync/EmuSync/refs/heads/main/NEWS.md";

export function useNews() {
    return useQuery({
        queryKey: [cacheKeys.news],
        queryFn: async () => {
            const res = await fetch(newsUrl);
            return await res.text();
        },
    });
}
