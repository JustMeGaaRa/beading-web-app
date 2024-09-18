import { Box, Button, ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { Check, Flip, XmarkCircle, Copy } from "iconoir-react";
import { FC, useCallback } from "react";
import { useTools } from "../components";

export const PatternActionToolbar: FC<{
    onClear?: () => void;
}> = ({
    onClear
}) => {
    const { tool, setTool } = useTools();

    const handleOnMirrorSelectionClick = useCallback(() => {
        setTool?.({
            name: "cursor",
            state: { currentAction: "mirror" }
        });
    }, [setTool]);

    const handleOnDuplicateSelectionClick = useCallback(() => {
        setTool?.({
            name: "cursor",
            state: { currentAction: "duplicate" }
        });
    }, [setTool]);

    const handleOnClearSelectionClick = useCallback(() => {
        onClear?.();
    }, [onClear]);

    const handleOnDoneClick = useCallback(() => {
        setTool?.({
            name: "pencil",
            state: { currentAction: "default" }
        });
    }, [setTool]);

    const isCursorEnabled = tool.name === "cursor" && tool.state.currentAction === "default";
    const isMirroringEnabled = tool.name === "cursor" && tool.state.currentAction === "mirror";
    const isDuplicatingEnabled = tool.name === "cursor" && tool.state.currentAction === "duplicate";

    return (
        <Box
            paddingBottom={4}
            position={"absolute"}
            transform={"translate(-50%, -100%)"}
        >
            <Box
                backgroundColor={"gray.900"}
                borderRadius={"md"}
            >
                {isCursorEnabled && (
                    <ButtonGroup
                        colorScheme={"gray"}
                        orientation={"horizontal"}
                        size={"md"}
                        variant={"ghost"}
                    >
                        <Tooltip label={"Duplicate selection"}>
                            <IconButton
                                aria-label={"duplicate selection"}
                                icon={<Copy />}
                                color={"white"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{ backgroundColor: "gray.600" }}
                                onClick={handleOnDuplicateSelectionClick}
                            />
                        </Tooltip>
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
                {(isMirroringEnabled || isDuplicatingEnabled) && (
                    <ButtonGroup
                        colorScheme={"gray"}
                        orientation={"horizontal"}
                        size={"sm"}
                        variant={"ghost"}
                    >
                        <Button
                            rightIcon={<Check />}
                            color={"white"}
                            _hover={{ backgroundColor: "gray.700" }}
                            _active={{ backgroundColor: "gray.600" }}
                            onClick={handleOnDoneClick}
                        >
                            Done
                        </Button>
                    </ButtonGroup>
                )}
            </Box>
        </Box>
    );
};
