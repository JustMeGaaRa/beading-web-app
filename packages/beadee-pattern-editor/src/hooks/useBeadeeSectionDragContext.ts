import {
    BeadingGrid,
    BeadingGridOffset,
    createSectionDragContext,
    useBeadeeGridSelection,
} from "@beadee/grid-editor";
import { patternSelector, usePatternStore } from "../store";
import { useCallback, useRef } from "react";

export const useBeadeeSectionDragContext = (originalGrid: BeadingGrid) => {
    const { dispatch } = usePatternStore(patternSelector);
    const { selectedCells, setSelectedCells } = useBeadeeGridSelection();
    const dragContextRef =
        useRef<ReturnType<typeof createSectionDragContext>>();

    const startDragging = useCallback(() => {
        dragContextRef.current = createSectionDragContext(
            originalGrid,
            selectedCells[originalGrid.gridId] || []
        );
        const [grid, section] = dragContextRef.current.start();

        dispatch({ type: "PATTERN_UPDATE_GRID", grid });
        setSelectedCells((state) => ({
            ...state,
            [grid.gridId]: section.cells,
        }));
    }, [originalGrid, selectedCells, dispatch, setSelectedCells]);

    const endDragging = useCallback(
        (cancel: boolean = false) => {
            if (dragContextRef.current) {
                const [grid, section] = cancel
                    ? dragContextRef.current.cancel()
                    : dragContextRef.current.accept();
                dragContextRef.current = undefined;

                dispatch({ type: "PATTERN_UPDATE_GRID", grid });
                setSelectedCells((state) => ({
                    ...state,
                    [grid.gridId]: section.cells,
                }));
            }
        },
        [dispatch, setSelectedCells]
    );

    const updateDragging = useCallback(
        (offset: BeadingGridOffset) => {
            if (dragContextRef.current) {
                const section = dragContextRef.current.move(offset);

                setSelectedCells((state) => ({
                    ...state,
                    [originalGrid.gridId]: section.cells,
                }));
            }
        },
        [originalGrid.gridId, setSelectedCells]
    );

    return {
        startDragging,
        endDragging,
        updateDragging,
    };
};
