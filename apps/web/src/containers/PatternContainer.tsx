import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    useDisclosure,
} from "@chakra-ui/react";
import {
    BeadeeFrameLabels,
    BeadeeRenderBounds,
    DefaultGridProperties,
    TextState,
    useBeadeeGridStyles,
    useBeadeeGridSelection,
    combineRenderBounds,
    getGridSectionRenderBounds,
    createRenderBounds,
    pointInBounds,
    getStageRelativePosition,
    usePointerDisclosure,
} from "@repo/bead-grid";
import {
    usePatternStore,
    PatternState,
    usePatterHistory,
    getPatternRenderBounds,
    patternSelector,
    dirtyStateSelector,
    getPatternSize,
    Pattern,
    getPatternMetadata,
    PatternMetadataProvider,
    useBeadeePatternHitTest,
} from "@repo/bead-pattern-editor";
import {
    ArrowDownIcon,
    DocumentCodeIcon,
    DocumentImageIcon,
} from "@repo/icons";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import {
    useTools,
    Shortcuts,
    useColorPalette,
    createToolInfo,
} from "../components";
import { downloadUri, toJsonUri } from "../utils";
import { putPattern } from "../api";
import { BeadingGridContainer } from "./BeadingGridContainer";

const hotkeysOptions = { preventDefault: true };

export const PatternContainer: FC = () => {
    const patternRef = useRef<Konva.Stage>(null);

    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [columnState, setColumnState] = useState<TextState | undefined>();
    const [rowState, setRowState] = useState<TextState | undefined>();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedColor, setSelectedColor } = useColorPalette();
    const { tool, enablePencil } = useTools();
    const { pattern, dispatch } = usePatternStore(patternSelector);
    const { isDirty, resetDirty } = usePatternStore(dirtyStateSelector);
    const {
        selectedCells,
        selectedColumn,
        selectedRow,
        setSelectedColumn,
        setSelectedRow,
    } = useBeadeeGridSelection();
    const { undo, redo } = usePatterHistory();

    const { styles } = useBeadeeGridStyles();
    const { height, width } = getPatternSize(pattern.grids, pattern.options);

    const isHorizontal = pattern.options.orientation === "horizontal";

    const centerPattern = useCallback(
        (pattern: PatternState) => {
            if (patternRef.current && pattern?.grids.length > 0) {
                const patternSize = getPatternRenderBounds(
                    pattern.grids,
                    styles
                );
                const position = {
                    x: window.innerWidth / 2 - patternSize.width / 2,
                    y: window.innerHeight / 2 - patternSize.height / 2,
                };
                patternRef.current.position(position);
                patternRef.current.scale({ x: 1, y: 1 });
            }
        },
        [styles]
    );

    useHotkeys(
        Shortcuts.patternCenter.keyString,
        () => centerPattern(pattern),
        hotkeysOptions,
        [centerPattern, pattern]
    );
    useHotkeys(Shortcuts.patternUndo.keyString, () => undo(), hotkeysOptions, [
        undo,
    ]);
    useHotkeys(Shortcuts.patternRedo.keyString, () => redo(), hotkeysOptions, [
        redo,
    ]);

    // NOTE: disabled linting as this effect should only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => centerPattern(pattern), []);

    useEffect(() => {
        // NOTE: auto save pattern cover every 5 seconds
        const intervalId = setInterval(() => {
            if (isDirty) {
                const coverUrl = patternRef.current?.toDataURL() ?? "";
                putPattern({ ...pattern, coverUrl });
                resetDirty();
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [pattern, isDirty, resetDirty]);

    // SECTION: frame event handlers
    const handleOnFrameColumnClick = useCallback(
        (_event: KonvaEventObject<MouseEvent>, columnState: TextState) => {
            // TODO: calculate the relative index here instead of having one in the event
            setColumnState(columnState);
        },
        []
    );

    const handleOnFrameRowClick = useCallback(
        (_event: KonvaEventObject<MouseEvent>, rowState: TextState) => {
            setRowState(rowState);
        },
        []
    );

    const handleOnFrameContextMenu = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            event.evt.preventDefault();
            const position = event.target.getStage()?.getPointerPosition() ?? {
                x: 0,
                y: 0,
            };
            setMenuPosition(position);
            onOpen();
        },
        [onOpen]
    );

    // SECTION: header menu handlers
    const handleOnPatternSavePngClick = useCallback(() => {
        const imageUri = patternRef.current?.toDataURL() ?? "";
        downloadUri(imageUri, `${pattern.name}.png`);
    }, [pattern.name]);

    const handleOnPatternSaveJsonClick = useCallback(() => {
        const patternUri = toJsonUri(pattern);
        downloadUri(patternUri, `${pattern.name}.json`);
    }, [pattern]);

    // SECTION: context menu handlers
    const handleOnGridAddRowAbove = useCallback(() => {
        if (rowState) {
            dispatch({
                type: "BEADING_GRID_ADD_ROW_BEFORE",
                gridId: isHorizontal ? "all" : rowState.gridId,
                row: rowState.relativeIndex,
            });
        }
    }, [dispatch, isHorizontal, rowState]);

    const handleOnGridAddRowBelow = useCallback(() => {
        if (rowState) {
            dispatch({
                type: "BEADING_GRID_ADD_ROW_AFTER",
                gridId: isHorizontal ? "all" : rowState.gridId,
                row: rowState.relativeIndex,
            });
        }
    }, [rowState, dispatch, isHorizontal]);

    const handleOnGridClearRow = useCallback(() => {
        if (rowState) {
            dispatch({
                type: "BEADING_GRID_CLEAR_ROW",
                gridId: isHorizontal ? "all" : rowState.gridId,
                row: rowState.relativeIndex,
            });
        }
    }, [rowState, dispatch, isHorizontal]);

    const handleOnGridDeleteRow = useCallback(() => {
        if (rowState) {
            dispatch({
                type: "BEADING_GRID_DELETE_ROW",
                gridId: isHorizontal ? "all" : rowState.gridId,
                row: rowState.relativeIndex,
            });
        }
    }, [rowState, dispatch, isHorizontal]);

    const handleOnGridAddColumnLeft = useCallback(() => {
        if (columnState) {
            dispatch({
                type: "BEADING_GRID_ADD_COLUMN_BEFORE",
                gridId: isHorizontal ? columnState.gridId : "all",
                column: columnState.relativeIndex,
            });
        }
    }, [columnState, dispatch, isHorizontal]);

    const handleOnGridAddColumnRight = useCallback(() => {
        if (columnState) {
            dispatch({
                type: "BEADING_GRID_ADD_COLUMN_AFTER",
                gridId: isHorizontal ? columnState.gridId : "all",
                column: columnState.relativeIndex,
            });
        }
    }, [columnState, dispatch, isHorizontal]);

    const handleOnGridClearColumn = useCallback(() => {
        if (columnState) {
            dispatch({
                type: "BEADING_GRID_CLEAR_COLUMN",
                gridId: isHorizontal ? columnState.gridId : "all",
                column: columnState.relativeIndex,
            });
        }
    }, [columnState, dispatch, isHorizontal]);

    const handleOnGridDeleteColumn = useCallback(() => {
        if (columnState) {
            dispatch({
                type: "BEADING_GRID_DELETE_COLUMN",
                gridId: isHorizontal ? columnState.gridId : "all",
                column: columnState.relativeIndex,
            });
        }
    }, [columnState, dispatch, isHorizontal]);

    // SECTION: cursor selection handlers
    const {
        isPointerDown,
        pointerDownPosition,
        pointerCurrentPosition,
        onPointerDown,
        onPointerMove,
        onPointerUp,
    } = usePointerDisclosure();
    const { setSelectedCells } = useBeadeeGridSelection();

    const metadata = useMemo(
        () => getPatternMetadata(pattern.grids, styles),
        [pattern.grids, styles]
    );
    const { getCellAtPosition, getCellsInBounds } = useBeadeePatternHitTest();

    const handleOnPatternContextMenu = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            event.evt.preventDefault();
        },
        []
    );

    // SECTION: pattern event handlers
    const handleOnPatternClick = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            const currentPosition = getStageRelativePosition(
                event.target.getStage()
            );

            // NOTE: clear selection of click outside of bounds
            const patternBounds = getPatternRenderBounds(pattern.grids, styles);
            const clickInBounds = pointInBounds(patternBounds, currentPosition);

            if (!clickInBounds) {
                setSelectedCells({});
            }

            setSelectedColumn(-1);
            setSelectedRow(-1);
        },
        [
            pattern.grids,
            styles,
            setSelectedCells,
            setSelectedColumn,
            setSelectedRow,
        ]
    );

    const handleOnPatternPointerDown = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            const toolInfo = createToolInfo(tool);
            const currentPosition = getStageRelativePosition(
                event.target.getStage()
            );
            onPointerDown(currentPosition);

            const mouseInBounds = pointInBounds(
                metadata.patternBounds,
                currentPosition
            );

            if (mouseInBounds) {
                // NOTE: handle cursor, pencil, eraser and picker only on click
                const currentCell = getCellAtPosition(currentPosition);

                if (toolInfo.isCursorEnabled) {
                    setSelectedCells(currentCell);
                }
                if (toolInfo.isPencilEnabled) {
                    const gridId = Object.keys(currentCell).at(0) ?? "";
                    dispatch({
                        type: "BEADING_GRID_SET_CELL",
                        gridId: gridId,
                        cell: {
                            ...currentCell[gridId][0],
                            color: selectedColor,
                        },
                    });
                }
                if (toolInfo.isEraserEnabled) {
                    const gridId = Object.keys(currentCell).at(0) ?? "";
                    dispatch({
                        type: "BEADING_GRID_SET_CELL",
                        gridId: gridId,
                        cell: { ...currentCell[gridId][0], color: "" },
                    });
                }
                if (toolInfo.isPickerEnabled) {
                    const gridId = Object.keys(currentCell).at(0) ?? "";
                    setSelectedColor(currentCell[gridId][0].color);
                    enablePencil();
                }
            }
        },
        [
            tool,
            onPointerDown,
            metadata.patternBounds,
            getCellAtPosition,
            setSelectedCells,
            dispatch,
            selectedColor,
            setSelectedColor,
            enablePencil,
        ]
    );

    const handleOnPatternPointerUp = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            const currentPosition = getStageRelativePosition(
                event.target.getStage()
            );
            onPointerUp(currentPosition);
        },
        [onPointerUp]
    );

    const handleOnPatternPointerMove = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            if (isPointerDown) {
                const toolInfo = createToolInfo(tool);
                const currentPosition = getStageRelativePosition(
                    event.target.getStage()
                );
                onPointerMove(currentPosition);

                // NOTE: if cursor is enabled, then only area selection is possible on move
                if (toolInfo.isCursorEnabled) {
                    const mouseSelectedBounds = createRenderBounds(
                        pointerDownPosition ?? { x: 0, y: 0 },
                        pointerCurrentPosition ?? { x: 0, y: 0 }
                    );
                    const currentSelectedCells =
                        getCellsInBounds(mouseSelectedBounds);
                    setSelectedCells(currentSelectedCells);
                }

                // NOTE: if cursor is not enabled, then only drawing is possible on move
                if (!toolInfo.isCursorEnabled) {
                    const mouseInBounds = pointInBounds(
                        metadata.patternBounds,
                        currentPosition
                    );

                    if (mouseInBounds) {
                        // NOTE: handle pencil, eraser and picker only on click
                        const currentCell = getCellAtPosition(currentPosition);

                        if (toolInfo.isPencilEnabled) {
                            // TODO: think of a better way to get gridId
                            const gridId = Object.keys(currentCell).at(0) ?? "";
                            dispatch({
                                type: "BEADING_GRID_SET_CELL",
                                gridId: gridId,
                                cell: {
                                    ...currentCell[gridId][0],
                                    color: selectedColor,
                                },
                            });
                        }
                        if (toolInfo.isEraserEnabled) {
                            const gridId = Object.keys(currentCell).at(0) ?? "";
                            dispatch({
                                type: "BEADING_GRID_SET_CELL",
                                gridId: gridId,
                                cell: { ...currentCell[gridId][0], color: "" },
                            });
                        }
                        if (toolInfo.isPickerEnabled) {
                            const gridId = Object.keys(currentCell).at(0) ?? "";
                            setSelectedColor(currentCell[gridId][0].color);
                            enablePencil();
                        }
                    }
                }
            }
        },
        [
            isPointerDown,
            tool,
            onPointerMove,
            pointerDownPosition,
            pointerCurrentPosition,
            getCellsInBounds,
            setSelectedCells,
            metadata.patternBounds,
            getCellAtPosition,
            dispatch,
            selectedColor,
            setSelectedColor,
            enablePencil,
        ]
    );

    const toolInfo = createToolInfo(tool);
    const sectionsCompoundBounds = useMemo(
        () =>
            combineRenderBounds(
                pattern.grids
                    .filter((grid) => selectedCells[grid.gridId]?.length > 0)
                    .map((grid) =>
                        getGridSectionRenderBounds(
                            selectedCells[grid.gridId],
                            grid.offset,
                            grid.options,
                            styles
                        )
                    )
            ),
        [pattern.grids, selectedCells, styles]
    );
    const sectionsCompoundBoundsVisible =
        toolInfo.isCursorEnabled &&
        !isPointerDown &&
        sectionsCompoundBounds.height > 0 &&
        sectionsCompoundBounds.width > 0;

    const pointerSelectedBounds = createRenderBounds(
        pointerDownPosition ?? { x: 0, y: 0 },
        pointerCurrentPosition ?? { x: 0, y: 0 }
    );
    const pointerSelectedBoundsVisible =
        toolInfo.isCursorEnabled &&
        isPointerDown &&
        !!pointerCurrentPosition &&
        !!pointerDownPosition;

    return (
        <Box cursor={toolInfo.cursor} height={"100%"} width={"100%"}>
            <PatternMetadataProvider metadata={metadata}>
                <Pattern
                    ref={patternRef}
                    pattern={pattern}
                    isDraggable={toolInfo.isMovementEnabled}
                    height={window.innerHeight}
                    width={window.innerWidth}
                    onClick={handleOnPatternClick}
                    onContextMenu={handleOnPatternContextMenu}
                    onPointerDown={handleOnPatternPointerDown}
                    onPointerUp={handleOnPatternPointerUp}
                    onPointerMove={handleOnPatternPointerMove}
                >
                    {pattern.grids.map((grid) => (
                        <BeadingGridContainer
                            key={grid.name}
                            grid={grid}
                            metadata={metadata.gridsMetadata.get(grid.gridId)}
                            patternRef={patternRef}
                            isLayoutHorizontal={isHorizontal}
                            isPointerDown={isPointerDown}
                            pointerPosition={pointerCurrentPosition}
                        />
                    ))}

                    {/* NOTE: Renders the frame around all section frames */}
                    <BeadeeRenderBounds
                        backgroundColor={"transparent"}
                        {...sectionsCompoundBounds}
                        isVisible={sectionsCompoundBoundsVisible}
                    />

                    {/* NOTE: Renders the selected area from the user mouse input */}
                    <BeadeeRenderBounds
                        {...pointerSelectedBounds}
                        isVisible={pointerSelectedBoundsVisible}
                    />

                    <BeadeeFrameLabels
                        height={height}
                        width={width}
                        options={
                            pattern.grids.at(0)?.options ??
                            DefaultGridProperties
                        }
                        isVisible={pattern.grids.length > 0}
                        onColumnClick={handleOnFrameColumnClick}
                        onRowClick={handleOnFrameRowClick}
                        onContextMenu={handleOnFrameContextMenu}
                    />
                </Pattern>
            </PatternMetadataProvider>

            <Menu isOpen={isOpen} closeOnBlur closeOnSelect onClose={onClose}>
                <MenuButton
                    left={menuPosition.x}
                    position={"absolute"}
                    top={menuPosition.y}
                    visibility={"hidden"}
                />
                {selectedRow >= 0 && (
                    <MenuList>
                        <MenuItem onClick={handleOnGridAddRowAbove}>
                            Add row above
                        </MenuItem>
                        <MenuItem onClick={handleOnGridAddRowBelow}>
                            Add row below
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem onClick={handleOnGridClearRow}>
                            Clear row
                        </MenuItem>
                        <MenuItem
                            color={"red.600"}
                            onClick={handleOnGridDeleteRow}
                        >
                            Delete row
                        </MenuItem>
                    </MenuList>
                )}
                {selectedColumn >= 0 && (
                    <MenuList>
                        <MenuItem onClick={handleOnGridAddColumnLeft}>
                            Add column before
                        </MenuItem>
                        <MenuItem onClick={handleOnGridAddColumnRight}>
                            Add column after
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem onClick={handleOnGridClearColumn}>
                            Clear column
                        </MenuItem>
                        <MenuItem
                            color={"red.600"}
                            onClick={handleOnGridDeleteColumn}
                        >
                            Delete column
                        </MenuItem>
                    </MenuList>
                )}
            </Menu>
            {patternRef.current &&
                createPortal(
                    <Menu>
                        <MenuButton
                            as={Button}
                            colorScheme={"gray"}
                            rightIcon={<ArrowDownIcon />}
                            size={"sm"}
                            variant={"solid"}
                            backgroundColor={"gray.900"}
                            color={"white"}
                            _hover={{ backgroundColor: "gray.700" }}
                            _active={{ backgroundColor: "gray.600" }}
                        >
                            Save As
                        </MenuButton>
                        <MenuList zIndex={1000}>
                            <MenuItem
                                icon={<DocumentImageIcon />}
                                onClick={handleOnPatternSavePngClick}
                            >
                                Image (.png)
                            </MenuItem>
                            <MenuItem
                                icon={<DocumentCodeIcon />}
                                onClick={handleOnPatternSaveJsonClick}
                            >
                                Pattern (.json)
                            </MenuItem>
                        </MenuList>
                    </Menu>,
                    document.getElementById(
                        "header-actions-group"
                    ) as HTMLElement
                )}
        </Box>
    );
};
