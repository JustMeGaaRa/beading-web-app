import { FC, PropsWithChildren } from "react";
import { Group, Rect } from "react-konva";
import { useGrid, useGridSelection, useGridStyles } from "../hooks";
import {
    getGridBounds,
    getGridSectionBounds,
    getGridSectionRenderBounds,
    indeciesInBounds,
} from "../utils";

// TODO: introduce style props to support state styling from outside
export const BeadingGridSection: FC<PropsWithChildren> = ({ children }) => {
    const { offset, options } = useGrid();
    const { styles } = useGridStyles();
    const { selectedCells } = useGridSelection();
    const sectionBounds = getGridSectionBounds(selectedCells);
    const sectionRenderBounds = getGridSectionRenderBounds(
        offset,
        sectionBounds,
        options,
        styles
    );

    const gridBounds = getGridBounds(options);
    const sectionBoundsBottomRight = {
        columnIndex:
            sectionBounds.topLeft.columnIndex + sectionBounds.width - 1,
        rowIndex: sectionBounds.topLeft.rowIndex + sectionBounds.height - 1,
    };
    const isInBounds =
        indeciesInBounds(gridBounds, sectionBounds.topLeft) &&
        indeciesInBounds(gridBounds, sectionBoundsBottomRight);

    return (
        isInBounds && (
            <Group>
                <Rect
                    listening={false}
                    opacity={0.3}
                    stroke={styles.components.frame.selection.borderColor}
                    strokeWidth={styles.components.frame.selection.borderWidth}
                    height={sectionRenderBounds.height}
                    width={sectionRenderBounds.width}
                    x={sectionRenderBounds.x}
                    y={sectionRenderBounds.y}
                />
                {children}
            </Group>
        )
    );
};
