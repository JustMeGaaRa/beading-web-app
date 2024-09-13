import { Box, Button, ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { Check, Flip, XmarkCircle } from "iconoir-react";
import { FC, useCallback } from "react";
import { usePattern, usePatternSelection, useTools } from "../components";

export const PatternActionToolbar: FC<{
    left?: number;
    top?: number;
    isVisible?: boolean;
}> = ({
    left = 0,
    top = 0,
}) => {
    const { clearGridCells } = usePattern();
    const { selectedCells } = usePatternSelection();
    const { tool, setTool } = useTools();

    const handleOnMirrorSelectionClick = useCallback(() => {
        setTool?.({
            name: "cursor",
            state: { currentAction: "mirror" }
        });
    }, [setTool]);

    const handleOnClearSelectionClick = useCallback(() => {
        clearGridCells("default", []);
    }, [clearGridCells]);

    const handleOnDoneClick = useCallback(() => {
        setTool?.({
            name: "pencil",
            state: { currentAction: "default" }
        });
    }, [setTool]);

    return (
        <Box
            left={left}
            top={top}
            paddingBottom={4}
            position={"absolute"}
            transform={"translate(-50%, -100%)"}
        >
            <Box
                backgroundColor={"gray.900"}
                borderRadius={"md"}
            >
                {tool.name === "cursor" && tool.state.currentAction === "default" && (
                    <ButtonGroup
                        colorScheme={"gray"}
                        orientation={"horizontal"}
                        size={"sm"}
                        variant={"ghost"}
                    >
                        <Tooltip label={"Mirror selection"}>
                            <IconButton
                                aria-label={"mirror selection"}
                                icon={<Flip />}
                                color={"white"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{ backgroundColor: "gray.600" }}
                                onClick={handleOnMirrorSelectionClick}
                            />
                        </Tooltip>
                        <Tooltip label={"Clear selection"}>
                            <IconButton
                                aria-label={"clear selection"}
                                icon={<XmarkCircle />}
                                color={"red.600"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{ backgroundColor: "gray.600" }}
                                onClick={handleOnClearSelectionClick}
                            />
                        </Tooltip>
                    </ButtonGroup>
                )}
                <ButtonGroup
                    colorScheme={"gray"}
                    orientation={"horizontal"}
                    size={"sm"}
                    variant={"ghost"}
                >
                    {tool.name === "cursor" && tool.state.currentAction === "mirror" && (
                        <Button
                            rightIcon={<Check />}
                            color={"white"}
                            _hover={{ backgroundColor: "gray.700" }}
                            _active={{ backgroundColor: "gray.600" }}
                            onClick={handleOnDoneClick}
                        >
                            Done
                        </Button>
                    )}
                </ButtonGroup>
            </Box>
        </Box>
    );
};
