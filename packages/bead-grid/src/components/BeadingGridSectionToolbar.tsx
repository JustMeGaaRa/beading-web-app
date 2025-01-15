import { FC, PropsWithChildren } from "react";
import { ToolbarPlacement } from "../types";
import { useGrid, useGridSelection, useGridStyles } from "../hooks";
import {
    getGridRenderBounds,
    getGridSectionBounds,
    getGridSectionRenderBounds,
    getPlacementPosition,
    pointInBounds,
} from "../utils";
import { Html } from "react-konva-utils";

export const BeadingGridSectionToolbar: FC<
    PropsWithChildren<{
        isVisible?: boolean;
        placement: ToolbarPlacement;
    }>
> = ({ children, isVisible, placement }) => {
    const { offset, options } = useGrid();
    const { styles } = useGridStyles();
    const { selectedCells } = useGridSelection();
    // TODO: section has to know about grid offset
    const sectionBounds = getGridSectionBounds(selectedCells);
    const sectionRenderBounds = getGridSectionRenderBounds(
        sectionBounds,
        options,
        styles
    );
    const toolbarPosition = getPlacementPosition(
        placement,
        sectionRenderBounds
    );
    const gridBounds = getGridRenderBounds(offset, options, styles);
    const isInBounds = pointInBounds(gridBounds, toolbarPosition);

    return (
        isVisible &&
        isInBounds && (
            <Html
                divProps={{ style: { pointerEvents: "none" } }}
                groupProps={toolbarPosition}
                transform
                transformFunc={(attr) => ({
                    ...attr,
                    scaleX: 1,
                    scaleY: 1,
                })}
            >
                {children}
            </Html>
        )
    );
};
