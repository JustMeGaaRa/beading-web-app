import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

const theme = extendTheme({
    initialColorMode: "light",
    useSystemColorMode: false,
});

root.render(
    <React.StrictMode>
        <ChakraProvider resetCSS theme={theme}>
            <RouterProvider router={routes} />
        </ChakraProvider>
    </React.StrictMode>
);
