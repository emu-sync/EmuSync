import { useLocation } from "react-router-dom";

export default function useIdParam() {
    const location = useLocation();

    const query = new URLSearchParams(location.search);
    const id = query.get("id"); // string | null

    return id!;
}