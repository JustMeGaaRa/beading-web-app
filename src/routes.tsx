import { createBrowserRouter } from "react-router-dom";
import { ProjectPage } from "./pages";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <ProjectPage />,
  },
]);
