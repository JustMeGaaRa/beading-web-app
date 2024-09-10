import { useToast, useToken } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { useParams } from "react-router";
import { PatternSelectionProvider, PatternState } from "../components";
import {
    ColorPaletteProvider,
    Content,
    Page,
    ToolsProvider,
    usePattern,
    usePatternCollection,
} from "../components";
import {
    BeadingPattern,
    ProjectHeader,
    ProjectPropertiesPanel,
    ProjectToolsPanel,
} from "../containers";
import { deepClone } from "../utils";

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
    const toast = useToast();
    const { patternId } = useParams();
    const { patterns } = usePatternCollection();
    const { setPattern } = usePattern();

    useEffect(() => {
        const pattern = patterns.find((pattern) => pattern.patternId === patternId);

        if (pattern) {
            setPattern(deepClone<PatternState>(pattern));
        }
        else {
            toast({
                title: "Pattern not found",
                description: "The pattern you are looking for does not exist.",
                status: "error",
                duration: 10000,
                position: "bottom-right",
                variant: "subtle",
                isClosable: true,
            });
        }
    }, [patternId]);

    return (
        <PatternSelectionProvider>
            <ToolsProvider>
                <ColorPaletteProvider colors={colors}>
                    <Page>
                        <ProjectHeader />
                        <Content>
                            <ProjectToolsPanel />
                            <ProjectPropertiesPanel />
                            <BeadingPattern />
                        </Content>
                    </Page>
                </ColorPaletteProvider>
            </ToolsProvider>
        </PatternSelectionProvider>
    );
};
