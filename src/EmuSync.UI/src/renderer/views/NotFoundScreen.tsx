import { routes } from "@/renderer/routes";
import { Link } from 'react-router-dom';

export default function NotFoundScreen() {
    return <div>
        <h1>Screen Not Found</h1>
        <Link to={routes.home.href}>Go to Home page</Link>
    </div>
}
