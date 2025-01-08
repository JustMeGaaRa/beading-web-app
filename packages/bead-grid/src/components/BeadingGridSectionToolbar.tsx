import { FC, PropsWithChildren } from "react";
import { ToolbarPlacement } from "../types";
import { useGrid, useGridSelection, useGridStyles } from "../hooks";
import {
    getGridSectionBounds,
    getGridSectionRenderBounds,
    getPlacementPosition,
} from "../utils";
import { Html } from "react-konva-utils";

export const BeadingGridSectionToolbar: FC<
    PropsWithChildren<{
        isVisible?: boolean;
        placement: ToolbarPlacement;
    }>
> = ({ children, isVisible, placement }) => {
    const { options } = useGrid();
    const { styles } = useGridStyles();
    const { selectedCells } = useGridSelection();
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
    // const gridBounds = getGridRenderBounds(options, styles);
    // const isInBounds = pointInBounds(gridBounds, toolbarPosition);

    return (
        isVisible && (
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
