import { createRoot } from 'react-dom/client';

import AppProviders from "@/renderer/layout/AppProviders";
import AppRoutes from "@/renderer/layout/AppRoutes";
import AppLayout from "@/renderer/layout/AppLayout";
import { HashRouter } from "react-router-dom";
import GlobalStateAndEvents from "@/renderer/layout/GlobalStateAndEvents";

export default function App() {
    return <AppProviders>
        <GlobalStateAndEvents />
        <HashRouter>
            <AppLayout>
                <AppRoutes />
            </AppLayout>
        </HashRouter>
    </AppProviders>
}


const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);