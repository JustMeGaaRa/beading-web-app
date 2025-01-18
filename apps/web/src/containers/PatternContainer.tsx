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
    BeadingGridProvider,
    useGridStyles,
    TextState,
    useGridSelection,
    BeadingFrame,
    DefaultGridProperties,
    BeadingGridSelectionFrame,
    useGridSelectionFrame,
    BeadingGridSelectionProvider,
} from "@repo/bead-grid";
import {
    usePatternStore,
    PatternState,
    usePatterHistory,
    getPatternRenderSize,
    patternSelector,
    dirtyStateSelector,
    getPatternSize,
} from "@repo/bead-pattern-editor";
import {
    ArrowDownIcon,
    DocumentCodeIcon,
    DocumentImageIcon,
} from "@repo/icons";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { Stage } from "react-konva";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useTools, Shortcuts } from "../components";
import {
    downloadUri,
    getContentScale,
    toJsonUri,
    SCALE_MAXIMUM,
} from "../utils";
import Tools from "../utils/tools";
import { putPattern } from "../api";
import { BeadingGridContainer } from "./BeadingGridContainer";

const hotkeysOptions = { preventDefault: true };

export const PatternContainer: FC = () => {
    const stageRef = useRef<Konva.Stage>(null);
    const lastTouchDistanceRef = useRef(0);

    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [columnState, setColumnState] = useState<TextState | undefined>();
    const [rowState, setRowState] = useState<TextState | undefined>();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { tool } = useTools();
    const { pattern, dispatch } = usePatternStore(patternSelector);
    const { isDirty, resetDirty } = usePatternStore(dirtyStateSelector);
    const { selectedColumn, selectedRow, setSelectedColumn, setSelectedRow } =
        useGridSelection();
    const { undo, redo } = usePatterHistory();

    const { styles } = useGridStyles();
    const { height, width } = getPatternSize(pattern.grids, pattern.options);

    const isHorizontal = pattern.options.orientation === "horizontal";

    const centerStage = useCallback(
        (pattern: PatternState) => {
            if (stageRef.current && pattern?.grids.length > 0) {
                const patternSize = getPatternRenderSize(
                    pattern.grids,
                    styles,
                    pattern.options
                );
                const position = {
                    x: window.innerWidth / 2 - patternSize.width / 2,
                    y: window.innerHeight / 2 - patternSize.height / 2,
                };
                stageRef.current.position(position);
                stageRef.current.scale({ x: 1, y: 1 });
            }
        },
        [styles]
    );

    useHotkeys(
        Shortcuts.patternCenter.keyString,
        () => centerStage(pattern),
        hotkeysOptions,
        [centerStage, pattern]
    );
    useHotkeys(Shortcuts.patternUndo.keyString, () => undo(), hotkeysOptions, [
        undo,
    ]);
    useHotkeys(Shortcuts.patternRedo.keyString, () => redo(), hotkeysOptions, [
        redo,
    ]);

    useEffect(() => centerStage(pattern), [centerStage]);

    useEffect(() => {
        // NOTE: auto save pattern cover every 5 seconds
        const intervalId = setInterval(() => {
            if (isDirty) {
                const imageUri = stageRef.current?.toDataURL() ?? "";
                putPattern({ ...pattern, coverUrl: imageUri });
                resetDirty();
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [pattern, isDirty, resetDirty]);

    // SECTION: stage event handlers
    const handleOnStageWheel = useCallback(
        (event: Konva.KonvaEventObject<WheelEvent>) => {
            event.evt.preventDefault();

            const stage = event.target.getStage();
            if (!stage) return;

            const currentScale = stage.scaleX();
            const pointerPosition = stage.getPointerPosition();
            const stagePosition = stage.position();

            if (!pointerPosition) return;

            const stageSize = stage.getSize();
            const patternSize = getPatternRenderSize(
                pattern.grids,
                styles,
                pattern.options
            );
            const minScale = getContentScale(stageSize, patternSize);
            const maxScale = SCALE_MAXIMUM;

            const direction = event.evt.deltaY > 0 ? -1 : 1;
            const scaleBy = 1.2;
            let newScale =
                direction > 0 ? currentScale * scaleBy : currentScale / scaleBy;

            const mousePointTo = {
                x: (pointerPosition.x - stagePosition.x) / currentScale,
                y: (pointerPosition.y - stagePosition.y) / currentScale,
            };

            if (direction > 0) {
                // Zoom In: Keep the point under cursor stationary
                newScale = Math.min(maxScale, newScale);
            } else {
                // Zoom Out: Keep the point under cursor stationary
                newScale = Math.max(minScale, newScale);
            }

            const newPos = {
                x: pointerPosition.x - mousePointTo.x * newScale,
                y: pointerPosition.y - mousePointTo.y * newScale,
            };

            stage.scale({ x: newScale, y: newScale });
            stage.position(newPos);

            stage.batchDraw();
        },
        [pattern.grids, pattern.options, styles]
    );

    const handleOnStageTouchMove = useCallback(
        (event: Konva.KonvaEventObject<TouchEvent>) => {
            event.evt.preventDefault();

            // NOTE: only allow to zoom in move mode to avoid tools conflict
            if (!Tools.isNone(tool)) return;

            // NOTE: pinch gesture requires two fingers, otherwise it might be other gesture
            if (event.evt.touches.length !== 2) return;

            const [touchPoint1, touchPoint2] = event.evt.touches as unknown as [
                Touch,
                Touch,
            ];
            const currentTouchDistance = Math.hypot(
                touchPoint2.clientX - touchPoint1.clientX,
                touchPoint2.clientY - touchPoint1.clientY
            );

            if (lastTouchDistanceRef.current === 0) {
                lastTouchDistanceRef.current = currentTouchDistance;
                return;
            }

            const stage = event.target.getStage();
            if (!stage) return;

            const pointerPosition = {
                x: (touchPoint1.clientX + touchPoint2.clientX) / 2,
                y: (touchPoint1.clientY + touchPoint2.clientY) / 2,
            };

            const stageSize = stage.getSize();
            const stagePosition = stage.position();
            const patternSize = getPatternRenderSize(
                pattern.grids,
                styles,
                pattern.options
            );
            const minScale = getContentScale(stageSize, patternSize);
            const maxScale = SCALE_MAXIMUM;
            const oldScale = stage.scaleX();

            let newScale =
                oldScale *
                (currentTouchDistance / lastTouchDistanceRef.current);

            newScale = Math.max(minScale, Math.min(maxScale, newScale));

            const mousePointTo = {
                x: (pointerPosition.x - stagePosition.x) / oldScale,
                y: (pointerPosition.y - stagePosition.y) / oldScale,
            };

            const newPos = {
                x: pointerPosition.x - mousePointTo.x * newScale,
                y: pointerPosition.y - mousePointTo.y * newScale,
            };

            stage.scale({ x: newScale, y: newScale });
            stage.position(newPos);
            stage.batchDraw();

            lastTouchDistanceRef.current = currentTouchDistance;
        },
        [tool, pattern.grids, pattern.options, styles]
    );

    const handleOnStageTouchEnd = useCallback(() => {
        lastTouchDistanceRef.current = 0;
    }, []);

    const handleOnStageClick = useCallback(() => {
        // NOTE: clear all active selections when clicked on stage empty space
        setSelectedColumn(-1);
        setSelectedRow(-1);
        // resetGridsSelection();
    }, [setSelectedColumn, setSelectedRow]);

    const handleOnStageContextMenu = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            event.evt.preventDefault();
        },
        []
    );

    // SECTION: pattern event handlers
    const handleOnPatternColumnClick = useCallback(
        (_event: KonvaEventObject<MouseEvent>, columnState: TextState) => {
            setColumnState(columnState);
        },
        []
    );

    const handleOnPatternRowClick = useCallback(
        (_event: KonvaEventObject<MouseEvent>, rowState: TextState) => {
            setRowState(rowState);
        },
        []
    );

    const handleOnPatternContextMenu = useCallback(
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
        const imageUri = stageRef.current?.toDataURL() ?? "";
        downloadUri(imageUri, `${pattern.name}.png`);
    }, [pattern]);

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
                row: rowState.gridIndex,
            });
        }
    }, [dispatch, isHorizontal, rowState]);

    const handleOnGridAddRowBelow = useCallback(() => {
        if (rowState) {
            dispatch({
                type: "BEADING_GRID_ADD_ROW_AFTER",
                gridId: isHorizontal ? "all" : rowState.gridId,
                row: rowState.gridIndex,
            });
        }
    }, [rowState, dispatch, isHorizontal]);

    const handleOnGridClearRow = useCallback(() => {
        if (rowState) {
            dispatch({
                type: "BEADING_GRID_CLEAR_ROW",
                gridId: isHorizontal ? "all" : rowState.gridId,
                row: rowState.gridIndex,
            });
        }
    }, [rowState, dispatch, isHorizontal]);

    const handleOnGridDeleteRow = useCallback(() => {
        if (rowState) {
            dispatch({
                type: "BEADING_GRID_DELETE_ROW",
                gridId: isHorizontal ? "all" : rowState.gridId,
                row: rowState.gridIndex,
            });
        }
    }, [rowState, dispatch, isHorizontal]);

    const handleOnGridAddColumnLeft = useCallback(() => {
        if (columnState) {
            dispatch({
                type: "BEADING_GRID_ADD_COLUMN_BEFORE",
                gridId: isHorizontal ? columnState.gridId : "all",
                column: columnState.gridIndex,
            });
        }
    }, [columnState, dispatch, isHorizontal]);

    const handleOnGridAddColumnRight = useCallback(() => {
        if (columnState) {
            dispatch({
                type: "BEADING_GRID_ADD_COLUMN_AFTER",
                gridId: isHorizontal ? columnState.gridId : "all",
                column: columnState.gridIndex,
            });
        }
    }, [columnState, dispatch, isHorizontal]);

    const handleOnGridClearColumn = useCallback(() => {
        if (columnState) {
            dispatch({
                type: "BEADING_GRID_CLEAR_COLUMN",
                gridId: isHorizontal ? columnState.gridId : "all",
                column: columnState.gridIndex,
            });
        }
    }, [columnState, dispatch, isHorizontal]);

    const handleOnGridDeleteColumn = useCallback(() => {
        if (columnState) {
            dispatch({
                type: "BEADING_GRID_DELETE_COLUMN",
                gridId: isHorizontal ? columnState.gridId : "all",
                column: columnState.gridIndex,
            });
        }
    }, [columnState, dispatch, isHorizontal]);

    // SECTION: cursor selection handlers
    const { setMouseCurrentPosition, setMouseDownPosition } =
        useGridSelectionFrame();
    const [isMouseDown, setIsMouseDown] = useState(false);

    const handleOnPointerDown = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            const stage = event.target.getStage();
            const currentPosition = stage?.getRelativePointerPosition() ?? {
                x: 0,
                y: 0,
            };

            setIsMouseDown(true);
            setMouseDownPosition(currentPosition);
            setMouseCurrentPosition(currentPosition);
        },
        [setMouseCurrentPosition, setMouseDownPosition]
    );

    const handleOnPointerUp = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            const stage = event.target.getStage();
            const currentPosition = stage?.getRelativePointerPosition() ?? {
                x: 0,
                y: 0,
            };

            setIsMouseDown(false);
            setMouseDownPosition(undefined);
            setMouseCurrentPosition(currentPosition);
        },
        [setMouseDownPosition, setMouseCurrentPosition]
    );

    const handleOnPointerMove = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            if (isMouseDown) {
                const stage = event.target.getStage();
                const position = stage?.getRelativePointerPosition() ?? {
                    x: 0,
                    y: 0,
                };
                setMouseCurrentPosition(position);
            }
        },
        [isMouseDown, setMouseCurrentPosition]
    );

    return (
        <Box cursor={Tools.getCursor(tool)} height={"100%"} width={"100%"}>
            <Stage
                ref={stageRef}
                draggable={Tools.isMovement(tool)}
                height={window.innerHeight}
                width={window.innerWidth}
                onClick={handleOnStageClick}
                onContextMenu={handleOnStageContextMenu}
                onTouchMove={handleOnStageTouchMove}
                onTouchEnd={handleOnStageTouchEnd}
                onPointerDown={handleOnPointerDown}
                onPointerUp={handleOnPointerUp}
                onPointerMove={handleOnPointerMove}
                onWheel={handleOnStageWheel}
            >
                {pattern.grids.map((grid) => (
                    <BeadingGridSelectionProvider key={grid.name}>
                        <BeadingGridProvider>
                            <BeadingGridContainer
                                grid={grid}
                                isLayoutHorizontal={isHorizontal}
                            />
                        </BeadingGridProvider>
                    </BeadingGridSelectionProvider>
                ))}

                <BeadingGridSelectionFrame isVisible={Tools.isCursor(tool)} />
                <BeadingFrame
                    height={height}
                    width={width}
                    options={
                        pattern.grids.at(0)?.options ?? DefaultGridProperties
                    }
                    isVisible={pattern.grids.length > 0}
                    onColumnClick={handleOnPatternColumnClick}
                    onRowClick={handleOnPatternRowClick}
                    onContextMenu={handleOnPatternContextMenu}
                />
            </Stage>

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
            {stageRef.current &&
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
