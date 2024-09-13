import {
    Box,
    ButtonGroup,
    IconButton,
    StackDivider,
    Tooltip,
    VStack
} from "@chakra-ui/react";
import {
    ColorPicker,
    CursorPointer,
    EditPencil,
    Erase,
    FillColor,
    Redo,
    Undo,
} from "iconoir-react";
import { FC, useCallback, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
    getPatternSummary,
    Shortcuts,
    usePatterHistory, 
    usePattern,
    useTools
} from "../components";
import { ColorPalettePopover } from "./ColorPalettePopover";

export const ProjectToolsPanel: FC = () => {
    const { tool, setTool } = useTools();
    const { pattern } = usePattern();
    const { undo, redo } = usePatterHistory();

    const onSetCursorTool = useCallback(() => setTool({ name: "cursor", state: { currentAction: "default" } }), [setTool]);
    const onSetPencilTool = useCallback(() => setTool({ name: "pencil", state: { currentAction: "default" } }), [setTool]);
    const onSetFillTool = useCallback(() => setTool({ name: "fill", state: { currentAction: "default" } }), [setTool]);
    const onSetEraserTool = useCallback(() => setTool({ name: "eraser", state: { currentAction: "default" } }), [setTool]);
    const onSetPickerTool = useCallback(() => setTool({ name: "picker", state: { currentAction: "default" } }), [setTool]);

    useHotkeys(Shortcuts.toolCursor.keyString, onSetCursorTool, { preventDefault: true }, [onSetCursorTool]);
    useHotkeys(Shortcuts.toolPencil.keyString, onSetPencilTool, { preventDefault: true }, [onSetPencilTool]);
    useHotkeys(Shortcuts.toolEraser.keyString, onSetEraserTool, { preventDefault: true }, [onSetEraserTool]);
    useHotkeys(Shortcuts.toolPicker.keyString, onSetPickerTool, { preventDefault: true }, [onSetPickerTool]);

    const summary = useMemo(() => getPatternSummary(pattern), [pattern]);
    
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
                borderRadius={"lg"}
                divider={<StackDivider borderColor={"blackAlpha.300"} />}
                padding={1}
                pointerEvents={"auto"}
            >
                <ButtonGroup
                    colorScheme={"gray"}
                    orientation={"vertical"}
                    spacing={1}
                    size={"md"}
                    variant={"ghost"}
                >
                    <Tooltip label={"Cursor"} placement={"right"}>
                        <IconButton
                            aria-label={"cursor"}
                            icon={<CursorPointer />}
                            isActive={tool.name === "cursor"}
                            onClick={onSetCursorTool}
                        />
                    </Tooltip>
                    <Tooltip label={"Pencil"} placement={"right"}>
                        <IconButton
                            aria-label={"pencil"}
                            icon={<EditPencil />}
                            isActive={tool.name === "pencil"}
                            onClick={onSetPencilTool}
                        />
                    </Tooltip>
                    <Tooltip label={"Fill"} placement={"right"}>
                        <IconButton
                            aria-label={"fill"}
                            icon={<FillColor />}
                            isActive={tool.name === "fill"}
                            isDisabled
                            onClick={onSetFillTool}
                        />
                    </Tooltip>
                    <Tooltip label={"Eraser"} placement={"right"}>
                        <IconButton
                            aria-label={"eraser"}
                            icon={<Erase />}
                            isActive={tool.name === "eraser"}
                            onClick={onSetEraserTool}
                        />
                    </Tooltip>
                    <Tooltip label={"Color Picker"} placement={"right"}>
                        <IconButton
                            aria-label={"picker"}
                            icon={<ColorPicker />}
                            isActive={tool.name === "picker"}
                            onClick={onSetPickerTool}
                        />
                    </Tooltip>
                </ButtonGroup>
                {summary && summary.beads.length > 0 && (
                    <VStack position={"relative"} gap={1} marginY={2}>
                        {summary.beads.map((bead, index) => (
                            <ColorPalettePopover key={index} {...bead} />
                        ))}
                    </VStack>
                )}
                <ButtonGroup
                    colorScheme={"gray"}
                    orientation={"vertical"}
                    spacing={1}
                    size={"md"}
                    variant={"ghost"}
                >
                    <Tooltip label={"Undo"} placement={"right"}>
                        <IconButton
                            aria-label={"undo"}
                            icon={<Undo />}
                            onClick={handleOnUndoClick}
                        />
                    </Tooltip>
                    <Tooltip label={"Redo"} placement={"right"}>
                        <IconButton
                            aria-label={"redo"}
                            icon={<Redo />}
                            onClick={handleOnRedoClick}
                        />
                    </Tooltip>
                </ButtonGroup>
            </VStack>
        </Box>
    );
};
