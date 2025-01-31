import {
    Box,
    Button,
    ButtonGroup,
    IconButton,
    Tooltip,
} from "@chakra-ui/react";
import { FC } from "react";
import { createToolInfo, ToolState } from "./tools";
import {
    CheckmarkIcon,
    ClipboardAddIcon,
    ClipboardIcon,
    CopyIcon,
    CutTweezersIcon,
    FlipHorizontalIcon,
    FlipVerticalIcon,
    RemoveCircleIcon,
    VerticalMirrorIcon,
} from "@beadee/icons";
import { BeadeeGridSectionToolbar } from "@beadee/grid-editor";

export const BeadeeGridSectionActionsToolbar: FC<{
    isVisible?: boolean;
    tool: ToolState;
    onCopy?: () => void;
    onCut?: () => void;
    onPaste?: () => void;
    onFlipHorizontal?: () => void;
    onFlipVertical?: () => void;
    onMirror?: () => void;
    onDuplicate?: () => void;
    onClear?: () => void;
    onDone?: () => void;
}> = ({
    isVisible = true,
    tool,
    onCopy,
    onCut,
    onPaste,
    onFlipHorizontal,
    onFlipVertical,
    onMirror,
    onDuplicate,
    onClear,
    onDone,
}) => {
    const toolInfo = createToolInfo(tool);

    return (
        <BeadeeGridSectionToolbar
            isVisible={isVisible}
            placement={"top-center"}
        >
            <Box transform={"translate(-50%, -100%)"}>
                {toolInfo.isCursorEnabled && (
                    <ButtonGroup
                        backgroundColor={"gray.900"}
                        borderRadius={"md"}
                        colorScheme={"gray"}
                        marginBottom={4}
                        orientation={"horizontal"}
                        pointerEvents={"all"}
                        isAttached
                        size={"md"}
                        variant={"ghost"}
                    >
                        <Tooltip label={"Copy selection"}>
                            <IconButton
                                aria-label={"copy selection"}
                                icon={<ClipboardIcon />}
                                color={"white"}
                                display={onCopy ? "inline-flex" : "none"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{
                                    backgroundColor: "gray.600",
                                }}
                                onClick={onCopy}
                            />
                        </Tooltip>
                        <Tooltip label={"Cut selection"}>
                            <IconButton
                                aria-label={"cut selection"}
                                icon={<CutTweezersIcon />}
                                color={"white"}
                                display={onCut ? "inline-flex" : "none"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{
                                    backgroundColor: "gray.600",
                                }}
                                onClick={onCut}
                            />
                        </Tooltip>
                        <Tooltip label={"Paste selection"}>
                            <IconButton
                                aria-label={"paste selection"}
                                icon={<ClipboardAddIcon />}
                                color={"white"}
                                display={onPaste ? "inline-flex" : "none"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{
                                    backgroundColor: "gray.600",
                                }}
                                onClick={onPaste}
                            />
                        </Tooltip>
                        <Tooltip label={"Flip selection vertical"}>
                            <IconButton
                                aria-label={"flip selection vertical"}
                                icon={<FlipVerticalIcon />}
                                color={"white"}
                                display={
                                    onFlipVertical ? "inline-flex" : "none"
                                }
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{
                                    backgroundColor: "gray.600",
                                }}
                                onClick={onFlipVertical}
                            />
                        </Tooltip>
                        <Tooltip label={"Flip selection horizontal"}>
                            <IconButton
                                aria-label={"flip selection horizontal"}
                                icon={<FlipHorizontalIcon />}
                                color={"white"}
                                display={
                                    onFlipHorizontal ? "inline-flex" : "none"
                                }
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{
                                    backgroundColor: "gray.600",
                                }}
                                onClick={onFlipHorizontal}
                            />
                        </Tooltip>
                        <Tooltip label={"Mirror selection"}>
                            <IconButton
                                aria-label={"mirror selection"}
                                icon={<VerticalMirrorIcon />}
                                color={"white"}
                                display={onMirror ? "inline-flex" : "none"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{
                                    backgroundColor: "gray.600",
                                }}
                                onClick={onMirror}
                            />
                        </Tooltip>
                        <Tooltip label={"Duplicate selection"}>
                            <IconButton
                                aria-label={"duplicate selection"}
                                icon={<CopyIcon />}
                                color={"white"}
                                display={onDuplicate ? "inline-flex" : "none"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{
                                    backgroundColor: "gray.600",
                                }}
                                onClick={onDuplicate}
                            />
                        </Tooltip>
                        <Tooltip label={"Clear selection"}>
                            <IconButton
                                aria-label={"clear selection"}
                                icon={<RemoveCircleIcon />}
                                color={"red.600"}
                                display={onClear ? "inline-flex" : "none"}
                                _hover={{ backgroundColor: "gray.700" }}
                                _active={{
                                    backgroundColor: "gray.600",
                                }}
                                onClick={onClear}
                            />
                        </Tooltip>
                    </ButtonGroup>
                )}
                {(toolInfo.isMirrorEnabled || toolInfo.isDuplicateEnabled) && (
                    <ButtonGroup
                        colorScheme={"gray"}
                        orientation={"horizontal"}
                        size={"sm"}
                        variant={"ghost"}
                    >
                        <Button
                            rightIcon={<CheckmarkIcon />}
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
        </BeadeeGridSectionToolbar>
    );
};
