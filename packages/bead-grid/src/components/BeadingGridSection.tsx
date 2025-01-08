import { FC, PropsWithChildren } from "react";
import { Group, Rect } from "react-konva";
import { useGrid, useGridSelection, useGridStyles } from "../hooks";
import { getGridSectionBounds, getGridSectionRenderBounds } from "../utils";

// TODO: introduce style props to support state styling from outside
export const BeadingGridSection: FC<PropsWithChildren> = ({ children }) => {
    const { options } = useGrid();
    const { styles } = useGridStyles();
    const { selectedCells } = useGridSelection();
    const sectionBounds = getGridSectionBounds(selectedCells);
    const sectionRenderBounds = getGridSectionRenderBounds(
        sectionBounds,
        options,
        styles
    );

    return (
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
    );
};
