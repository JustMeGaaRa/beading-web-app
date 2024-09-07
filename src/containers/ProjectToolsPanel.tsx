import { Box, ButtonGroup, IconButton, StackDivider, VStack } from "@chakra-ui/react";
import {
    ColorPicker,
    CursorPointer,
    EditPencil,
    Erase,
    Redo,
    Undo,
} from "iconoir-react";
import { FC, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { usePatterHistory, usePattern, useTools } from "../components";
import { ColorPalettePopover } from "./ColorPalettePopover";

export const ProjectToolsPanel: FC = () => {
    const { selectedTool, setSelectedTool } = useTools();
    const { getSummary } = usePattern();
    const { undo, redo } = usePatterHistory();

    useHotkeys("ctrl+1", () => setSelectedTool("cursor"), { preventDefault: true }, [setSelectedTool]);
    useHotkeys("ctrl+2", () => setSelectedTool("pencil"), { preventDefault: true }, [setSelectedTool]);
    useHotkeys("ctrl+3", () => setSelectedTool("eraser"), { preventDefault: true }, [setSelectedTool]);
    useHotkeys("ctrl+4", () => setSelectedTool("picker"), { preventDefault: true }, [setSelectedTool]);

    const handleOnUndoClick = useCallback(() => undo(), [undo]);

    const handleOnRedoClick = useCallback(() => redo(), [redo]);

    return (
        <Box
            padding={3}
            position={"absolute"}
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
                position={"relative"}
            >
                <ButtonGroup
                    colorScheme={"gray"}
                    orientation={"vertical"}
                    spacing={1}
                    size={"sm"}
                    variant={"ghost"}
                >
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
                {getSummary().beads.length > 0 && (
                    <VStack position={"relative"} gap={1} marginY={2}>
                        {getSummary().beads.map((bead, index) => (
                            <ColorPalettePopover key={index} {...bead} />
                        ))}
                    </VStack>
                )}
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
