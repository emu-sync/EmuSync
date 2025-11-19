import { cacheKeys } from "@/renderer/api/cache-keys";
import { useQuery } from "@tanstack/react-query";

export interface ChangeLogEntry {
    version: string;
    markdown: string;
}

const changeLogUrl = "https://raw.githubusercontent.com/emu-sync/EmuSync/refs/heads/main/CHANGELOG.md";

function parseChangeLog(text: string): ChangeLogEntry[] {
    const lines = text.split("\n");
    const result: ChangeLogEntry[] = [];

    let currentVersion = "";
    let buffer: string[] = [];

    for (const line of lines) {
        const match = line.match(/^#\s*v([\d.]+)\s*$/);
        if (match) {
            if (currentVersion) {
                result.push({
                    version: currentVersion,
                    markdown: buffer.join("\n").trim(),
                });
            }
            currentVersion = `v${match[1]}`;
            buffer = [];
        } else {
            buffer.push(line);
        }
    }

    if (currentVersion) {
        result.push({
            version: currentVersion,
            markdown: buffer.join("\n").trim(),
        });
    }

    return result;
}

export function useChangeLog() {
    return useQuery({
        queryKey: [cacheKeys.changeLog],
        queryFn: async () => {
            const res = await fetch(changeLogUrl);
            const text = await res.text();
            return parseChangeLog(text);
        },
    });
}
