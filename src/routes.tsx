import { createBrowserRouter } from "react-router-dom";
import { StartingPage } from "./containers";
import { ProjectPage } from "./pages";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <StartingPage />,
    },
    {
        path: "/patterns/:patternId",
        element: <ProjectPage />,
    },
]);
