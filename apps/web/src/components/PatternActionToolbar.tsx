import { Box, Button, ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { Check, Flip, XmarkCircle, Copy } from "iconoir-react";
import { FC, memo } from "react";
import { ToolState } from "./ToolsProvider";

export const PatternActionToolbar: FC<{
    tool: ToolState;
    onMirror?: () => void;
    onDuplicate?: () => void;
    onClear?: () => void;
    onDone?: () => void;
}> = memo(({
    tool,
    onMirror,
    onDuplicate,
    onClear,
    onDone
}) => {
    const isCursorEnabled = tool.name === "cursor" && tool.state.currentAction === "default";
    const isMirroringEnabled = tool.name === "cursor" && tool.state.currentAction === "mirror";
    const isDuplicatingEnabled = tool.name === "cursor" && tool.state.currentAction === "duplicate";

    return (
        <Box
            paddingBottom={4}
            transform={"translate(-50%, -50%)"}
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
                                onClick={onDuplicate}
                            />
                        </Tooltip>
                        <Tooltip label={"Mirror selection"}>
                            <IconButton
                                aria-label={"mirror selection"}
                                icon={<Flip />}
                                color={"white"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{ backgroundColor: "gray.600" }}
                                onClick={onMirror}
                            />
                        </Tooltip>
                        <Tooltip label={"Clear selection"}>
                            <IconButton
                                aria-label={"clear selection"}
                                icon={<XmarkCircle />}
                                color={"red.600"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{ backgroundColor: "gray.600" }}
                                onClick={onClear}
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
                            onClick={onDone}
                        >
                            Done
                        </Button>
                    </ButtonGroup>
                )}
            </Box>
        </Box>
    );
});
