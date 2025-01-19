import { FC, PropsWithChildren } from "react";
import { Group } from "react-konva";
import { useGrid, useGridSelection, useGridStyles } from "../hooks";
import { getGridSectionBounds, getGridSectionRenderBounds } from "../utils";
import { BeadingGridCellState } from "../types";
import { BeadeeGridCell } from "./BeadeeGridCell";
import { BeadeeGridSelectionFrame } from "./BeadeeGridSelectionFrame";

// TODO: introduce style props to support state styling from outside
export const BeadeeGridSection: FC<
    PropsWithChildren<{
        cells?: Array<BeadingGridCellState>;
    }>
> = ({ children, cells }) => {
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
            <BeadeeGridSelectionFrame
                backgroundColor={"transparent"}
                position={sectionRenderBounds.position}
                height={sectionRenderBounds.height}
                width={sectionRenderBounds.width}
                isVisible
            />
            {cells?.map((cell) => (
                <BeadeeGridCell
                    key={`${cell.offset.rowIndex}-${cell.offset.columnIndex}`}
                    color={cell.color}
                    offset={cell.offset}
                    isSelected={true}
                />
            ))}
            {children}
        </Group>
    );
};
