import {
    ButtonGroup,
    IconButton,
    StackDivider,
    Tooltip,
    VStack,
} from "@chakra-ui/react";
import {
    getPatternSummary,
    usePatterHistory,
    usePatternStore,
} from "@beadee/pattern-editor";
import {
    EraserIcon,
    NavigationIcon,
    PencilIcon,
    ReverseLeftIcon,
    ReverseRightIcon,
    ThermometerIcon,
} from "@beadee/icons";
import { FC, useCallback, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Shortcuts, Toolbar, useTools } from "../components";
import { ColorPalettePopover } from "./ColorPalettePopover";

const hotkeysOptions = { preventDefault: true };

export const ProjectToolsContainer: FC = () => {
    const { tool, toggleTool } = useTools();
    const { pastStates, futureStates, undo, redo } = usePatterHistory();
    const pattern = usePatternStore((state) => state.pattern);

    const onSetCursorTool = useCallback(
        () =>
            toggleTool({ name: "cursor", state: { currentAction: "default" } }),
        [toggleTool]
    );
    const onSetPencilTool = useCallback(
        () =>
            toggleTool({ name: "pencil", state: { currentAction: "default" } }),
        [toggleTool]
    );
    const onSetEraserTool = useCallback(
        () =>
            toggleTool({ name: "eraser", state: { currentAction: "default" } }),
        [toggleTool]
    );
    const onSetPickerTool = useCallback(
        () =>
            toggleTool({ name: "picker", state: { currentAction: "default" } }),
        [toggleTool]
    );

    useHotkeys(
        Shortcuts.toolCursor.keyString,
        onSetCursorTool,
        hotkeysOptions,
        [onSetCursorTool]
    );
    useHotkeys(
        Shortcuts.toolPencil.keyString,
        onSetPencilTool,
        hotkeysOptions,
        [onSetPencilTool]
    );
    useHotkeys(
        Shortcuts.toolEraser.keyString,
        onSetEraserTool,
        hotkeysOptions,
        [onSetEraserTool]
    );
    useHotkeys(
        Shortcuts.toolPicker.keyString,
        onSetPickerTool,
        hotkeysOptions,
        [onSetPickerTool]
    );

    const summary = useMemo(
        () => getPatternSummary(pattern.grids, pattern.options),
        [pattern]
    );

    const handleOnUndoClick = useCallback(() => undo(), [undo]);
    const handleOnRedoClick = useCallback(() => redo(), [redo]);

    return (
        <Toolbar placement={"left"}>
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
                    <Tooltip label={"Cursor"} placement={"right"}>
                        <IconButton
                            aria-label={"cursor"}
                            icon={<NavigationIcon size={20} />}
                            isActive={tool.name === "cursor"}
                            onClick={onSetCursorTool}
                        />
                    </Tooltip>
                    <Tooltip label={"Pencil"} placement={"right"}>
                        <IconButton
                            aria-label={"pencil"}
                            icon={<PencilIcon size={20} />}
                            isActive={tool.name === "pencil"}
                            onClick={onSetPencilTool}
                        />
                    </Tooltip>
                    <Tooltip label={"Eraser"} placement={"right"}>
                        <IconButton
                            aria-label={"eraser"}
                            icon={<EraserIcon size={20} />}
                            isActive={tool.name === "eraser"}
                            onClick={onSetEraserTool}
                        />
                    </Tooltip>
                    <Tooltip label={"Color Picker"} placement={"right"}>
                        <IconButton
                            aria-label={"picker"}
                            icon={<ThermometerIcon size={20} />}
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
                            icon={<ReverseLeftIcon size={20} />}
                            isDisabled={pastStates.length === 0}
                            onClick={handleOnUndoClick}
                        />
                    </Tooltip>
                    <Tooltip label={"Redo"} placement={"right"}>
                        <IconButton
                            aria-label={"redo"}
                            icon={<ReverseRightIcon size={20} />}
                            isDisabled={futureStates.length === 0}
                            onClick={handleOnRedoClick}
                        />
                    </Tooltip>
                </ButtonGroup>
            </VStack>
        </Toolbar>
    );
};
