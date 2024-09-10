import { Box, ButtonGroup, IconButton, StackDivider, VStack } from "@chakra-ui/react";
import {
    ColorPicker,
    CursorPointer,
    DragHandGesture,
    EditPencil,
    Erase,
    Redo,
    Undo,
} from "iconoir-react";
import { FC, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { getSummary, PatternSummary, usePatterHistory, usePattern, useTools } from "../components";
import { ColorPalettePopover } from "./ColorPalettePopover";

export const ProjectToolsPanel: FC = () => {
    const { selectedTool, setSelectedTool } = useTools();
    const { pattern } = usePattern();
    const { undo, redo } = usePatterHistory();

    useHotkeys("ctrl+1", () => setSelectedTool("drag"), { preventDefault: true }, [setSelectedTool]);
    useHotkeys("ctrl+2", () => setSelectedTool("cursor"), { preventDefault: true }, [setSelectedTool]);
    useHotkeys("ctrl+3", () => setSelectedTool("pencil"), { preventDefault: true }, [setSelectedTool]);
    useHotkeys("ctrl+4", () => setSelectedTool("eraser"), { preventDefault: true }, [setSelectedTool]);
    useHotkeys("ctrl+5", () => setSelectedTool("picker"), { preventDefault: true }, [setSelectedTool]);

    const handleOnUndoClick = useCallback(() => undo(), [undo]);

    const handleOnRedoClick = useCallback(() => redo(), [redo]);

    return (
        <Box
            padding={3}
            position={"absolute"}
            pointerEvents={"none"}
            left={0}
            top={"50%"}
            transform={"translate(0, -50%)"}
            zIndex={1}
        >
            <VStack
                backgroundColor={"white"}
                borderRadius={"md"}
                divider={<StackDivider borderColor={"blackAlpha.300"} />}
                padding={1}
                pointerEvents={"auto"}
            >
                <ButtonGroup
                    colorScheme={"gray"}
                    orientation={"vertical"}
                    spacing={1}
                    size={"sm"}
                    variant={"ghost"}
                >
                    <IconButton
                        aria-label={"drag"}
                        icon={<DragHandGesture />}
                        isActive={selectedTool === "drag"}
                        title={"Drag"}
                        onClick={() => setSelectedTool("drag")}
                    />
                    <IconButton
                        aria-label={"cursor"}
                        icon={<CursorPointer />}
                        isActive={selectedTool === "cursor"}
                        title={"Cursor"}
                        onClick={() => setSelectedTool("cursor")}
                    />
                    <IconButton
                        aria-label={"pencil"}
                        icon={<EditPencil />}
                        isActive={selectedTool === "pencil"}
                        title={"Pencil"}
                        onClick={() => setSelectedTool("pencil")}
                    />
                    <IconButton
                        aria-label={"eraser"}
                        icon={<Erase />}
                        isActive={selectedTool === "eraser"}
                        title={"Eraser"}
                        onClick={() => setSelectedTool("eraser")}
                    />
                    <IconButton
                        aria-label={"picker"}
                        icon={<ColorPicker />}
                        isActive={selectedTool === "picker"}
                        title={"Color Picker"}
                        onClick={() => setSelectedTool("picker")}
                    />
                </ButtonGroup>
                <BeadColorStack summary={getSummary(pattern)} />
                <ButtonGroup
                    colorScheme={"gray"}
                    orientation={"vertical"}
                    spacing={1}
                    size={"sm"}
                    variant={"ghost"}
                >
                    <IconButton
                        aria-label={"undo"}
                        icon={<Undo />}
                        title={"Undo"}
                        onClick={handleOnUndoClick}
                    />
                    <IconButton
                        aria-label={"redo"}
                        icon={<Redo />}
                        title={"Redo"}
                        onClick={handleOnRedoClick}
                    />
                </ButtonGroup>
            </VStack>
        </Box>
    );
};

export const BeadColorStack: FC<{
    summary: PatternSummary;
}> = ({
    summary
}) => {
    if (!summary || summary.beads.length === 0) return null;

    return (
        <VStack position={"relative"} gap={1} marginY={2}>
            {summary.beads.map((bead, index) => (
                <ColorPalettePopover key={index} {...bead} />
            ))}
        </VStack>
    );
};
