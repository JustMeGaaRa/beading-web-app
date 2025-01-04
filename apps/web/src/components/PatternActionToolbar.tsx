import {
    Box,
    Button,
    ButtonGroup,
    IconButton,
    Tooltip,
} from "@chakra-ui/react";
import { Check } from "iconoir-react";
import { FC, memo } from "react";
import { ToolState } from "./ToolsProvider";
import {
    ClipboardAddIcon,
    ClipboardIcon,
    CopyIcon,
    FlipVerticalIcon,
    RemoveCircleIcon,
    VerticalMirrorIcon,
} from "@repo/icons";

export const PatternActionToolbar: FC<{
    tool: ToolState;
    onMirror?: () => void;
    onDuplicate?: () => void;
    onClear?: () => void;
    onDone?: () => void;
}> = memo(({ tool, onMirror, onDuplicate, onClear, onDone }) => {
    const isCursorEnabled =
        tool.name === "cursor" && tool.state.currentAction === "default";
    const isMirroringEnabled =
        tool.name === "cursor" && tool.state.currentAction === "mirror";
    const isDuplicatingEnabled =
        tool.name === "cursor" && tool.state.currentAction === "duplicate";

    return (
        <Box paddingBottom={4} transform={"translate(-50%, -100%)"}>
            <Box backgroundColor={"gray.900"} borderRadius={"md"}>
                {isCursorEnabled && (
                    <ButtonGroup
                        colorScheme={"gray"}
                        orientation={"horizontal"}
                        isAttached
                        size={"md"}
                        variant={"ghost"}
                    >
                        <Tooltip label={"Copy selection"}>
                            <IconButton
                                aria-label={"copy selection"}
                                icon={<ClipboardIcon />}
                                color={"white"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{ backgroundColor: "gray.600" }}
                            />
                        </Tooltip>
                        <Tooltip label={"Paste selection"}>
                            <IconButton
                                aria-label={"paste selection"}
                                icon={<ClipboardAddIcon />}
                                color={"white"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{ backgroundColor: "gray.600" }}
                            />
                        </Tooltip>
                        <Tooltip label={"Flip selection"}>
                            <IconButton
                                aria-label={"flip selection"}
                                icon={<FlipVerticalIcon />}
                                color={"white"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{ backgroundColor: "gray.600" }}
                            />
                        </Tooltip>
                        <Tooltip label={"Mirror selection"}>
                            <IconButton
                                aria-label={"mirror selection"}
                                icon={<VerticalMirrorIcon />}
                                color={"white"}
                                display={"none"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{ backgroundColor: "gray.600" }}
                                onClick={onMirror}
                            />
                        </Tooltip>
                        <Tooltip label={"Duplicate selection"}>
                            <IconButton
                                aria-label={"duplicate selection"}
                                icon={<CopyIcon />}
                                color={"white"}
                                display={"none"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{ backgroundColor: "gray.600" }}
                                onClick={onDuplicate}
                            />
                        </Tooltip>
                        <Tooltip label={"Clear selection"}>
                            <IconButton
                                aria-label={"clear selection"}
                                icon={<RemoveCircleIcon />}
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
