import { createBrowserRouter } from "react-router-dom";
import { fetchPattern } from "./api";
import { PreviewPage, ProjectPage, StartingPage } from "./pages";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <StartingPage />,
    },
    {
        path: "/patterns/:patternId",
        element: <ProjectPage />,
        loader: ({ params }) => fetchPattern(params.patternId),
    },
    {
        path: "/preview",
        element: <PreviewPage />
    }
]);
