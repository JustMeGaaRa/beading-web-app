import {
    Box,
    ButtonGroup,
    Icon,
    IconButton,
    StackDivider,
    Tooltip,
    VStack
} from "@chakra-ui/react";
import { DragHandGesture } from "iconoir-react";
import { FC, useCallback, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
    getPatternSummary,
    Shortcuts,
    usePatterHistory,
    usePatternStore,
    useTools
} from "../components";
import {
    ColorPickerIcon,
    EraserIcon,
    NavigationIcon,
    PencilIcon,
    ReverseLeftIcon,
    ReverseRightIcon
} from "../components/icons";
import { ColorPalettePopover } from "./ColorPalettePopover";

const hotkeysOptions = { preventDefault: true };

export const ProjectToolsContainer: FC = () => {
    const { tool, setTool } = useTools();
    const { pastStates, futureStates, undo, redo } = usePatterHistory();
    const pattern = usePatternStore(state => state.pattern);

    const onSetMoveTool = useCallback(() => setTool({ name: "move", state: { currentAction: "default" } }), [setTool]);
    const onSetCursorTool = useCallback(() => setTool({ name: "cursor", state: { currentAction: "default" } }), [setTool]);
    const onSetPencilTool = useCallback(() => setTool({ name: "pencil", state: { currentAction: "default" } }), [setTool]);
    const onSetFillTool = useCallback(() => setTool({ name: "fill", state: { currentAction: "default" } }), [setTool]);
    const onSetEraserTool = useCallback(() => setTool({ name: "eraser", state: { currentAction: "default" } }), [setTool]);
    const onSetPickerTool = useCallback(() => setTool({ name: "picker", state: { currentAction: "default" } }), [setTool]);

    useHotkeys(Shortcuts.toolCursor.keyString, onSetCursorTool, hotkeysOptions, [onSetCursorTool]);
    useHotkeys(Shortcuts.toolPencil.keyString, onSetPencilTool, hotkeysOptions, [onSetPencilTool]);
    useHotkeys(Shortcuts.toolEraser.keyString, onSetEraserTool, hotkeysOptions, [onSetEraserTool]);
    useHotkeys(Shortcuts.toolPicker.keyString, onSetPickerTool, hotkeysOptions, [onSetPickerTool]);

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
                    color={"white"}
                    orientation={"vertical"}
                    spacing={1}
                    size={"md"}
                    variant={"ghost"}
                >
                    <Tooltip label={"Move"} placement={"right"}>
                        <IconButton
                            aria-label={"move"}
                            icon={<Icon as={DragHandGesture} boxSize={5} />}
                            isActive={tool.name === "move"}
                            onClick={onSetMoveTool}
                        />
                    </Tooltip>
                    <Tooltip label={"Cursor"} placement={"right"}>
                        <IconButton
                            aria-label={"cursor"}
                            icon={<NavigationIcon boxSize={5} />}
                            isActive={tool.name === "cursor"}
                            onClick={onSetCursorTool}
                        />
                    </Tooltip>
                    <Tooltip label={"Pencil"} placement={"right"}>
                        <IconButton
                            aria-label={"pencil"}
                            icon={<PencilIcon boxSize={5} />}
                            isActive={tool.name === "pencil"}
                            onClick={onSetPencilTool}
                        />
                    </Tooltip>
                    {/* <Tooltip label={"Fill"} placement={"right"}>
                        <IconButton
                            aria-label={"fill"}
                            icon={<FillColor />}
                            isActive={tool.name === "fill"}
                            isDisabled
                            onClick={onSetFillTool}
                        />
                    </Tooltip> */}
                    <Tooltip label={"Eraser"} placement={"right"}>
                        <IconButton
                            aria-label={"eraser"}
                            icon={<EraserIcon boxSize={5} />}
                            isActive={tool.name === "eraser"}
                            onClick={onSetEraserTool}
                        />
                    </Tooltip>
                    <Tooltip label={"Color Picker"} placement={"right"}>
                        <IconButton
                            aria-label={"picker"}
                            icon={<ColorPickerIcon boxSize={5} />}
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
                            icon={<ReverseLeftIcon boxSize={5} />}
                            isDisabled={pastStates.length === 0}
                            onClick={handleOnUndoClick}
                        />
                    </Tooltip>
                    <Tooltip label={"Redo"} placement={"right"}>
                        <IconButton
                            aria-label={"redo"}
                            icon={<ReverseRightIcon boxSize={5} />}
                            isDisabled={futureStates.length === 0}
                            onClick={handleOnRedoClick}
                        />
                    </Tooltip>
                </ButtonGroup>
            </VStack>
        </Box>
    );
};
