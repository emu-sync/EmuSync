"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNews = useNews;
const cache_keys_1 = require("@/renderer/api/cache-keys");
const react_query_1 = require("@tanstack/react-query");
const newsUrl = "https://raw.githubusercontent.com/emu-sync/EmuSync/refs/heads/main/NEWS.md";
function useNews() {
    return (0, react_query_1.useQuery)({
        queryKey: [cache_keys_1.cacheKeys.news],
        queryFn: async () => {
            const res = await fetch(newsUrl);
            return await res.text();
        },
    });
}
//# sourceMappingURL=use-news.js.map