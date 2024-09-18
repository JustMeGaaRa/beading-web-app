import { useToken } from "@chakra-ui/react";
import { FC } from "react";
import { PatternSelectionProvider } from "../components";
import {
    ColorPaletteProvider,
    Content,
    Page,
    ToolsProvider,
} from "../components";
import {
    PatternContainer,
    ProjectHeader,
    ProjectHelpPanel,
    ProjectPropertiesPanel,
    ProjectToolsPanel,
} from "../containers";

export const ProjectPage: FC = () => {
    const colors = useToken("colors", [
        "gray.900",
        "gray.700",
        "gray.500",
        "gray.300",
        "gray.100",
        "red.900",
        "red.700",
        "red.500",
        "red.300",
        "red.100",
        "orange.900",
        "orange.700",
        "orange.500",
        "orange.300",
        "orange.100",
        "yellow.900",
        "yellow.700",
        "yellow.500",
        "yellow.300",
        "yellow.100",
        "green.900",
        "green.700",
        "green.500",
        "green.300",
        "green.100",
        "teal.900",
        "teal.700",
        "teal.500",
        "teal.300",
        "teal.100",
        "blue.900",
        "blue.700",
        "blue.500",
        "blue.300",
        "blue.100",
        "cyan.900",
        "cyan.700",
        "cyan.500",
        "cyan.300",
        "cyan.100",
        "purple.900",
        "purple.700",
        "purple.500",
        "purple.300",
        "purple.100",
        "pink.900",
        "pink.700",
        "pink.500",
        "pink.300",
        "pink.100",
    ]);

    return (
        <PatternSelectionProvider>
            <ToolsProvider>
                <ColorPaletteProvider colors={colors}>
                    <Page>
                        <ProjectHeader />
                        <Content>
                            <ProjectToolsPanel />
                            <ProjectHelpPanel />
                            <ProjectPropertiesPanel />
                            <PatternContainer />
                        </Content>
                    </Page>
                </ColorPaletteProvider>
            </ToolsProvider>
        </PatternSelectionProvider>
    );
};
