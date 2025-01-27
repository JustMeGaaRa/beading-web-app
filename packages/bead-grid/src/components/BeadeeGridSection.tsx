import { FC, PropsWithChildren } from "react";
import {
    BeadingGridCell,
    BeadingGridOffset,
    BeadingGridProperties,
    getCellKey,
    shiftOffset,
} from "../types";
import { BeadeeGridCell } from "./BeadeeGridCell";
import { useBeadeeGridStyles } from "../hooks";
import { getGridSectionRenderBounds } from "../utils";
import { BeadeeRenderBounds } from "./BeadeeRednerBounds";

// TODO: introduce style props to support state styling from outside
export const BeadeeGridSection: FC<
    PropsWithChildren<{
        cells: Array<BeadingGridCell>;
        offset: BeadingGridOffset;
        options: BeadingGridProperties;
    }>
> = ({ children, cells, offset, options }) => {
    const { styles } = useBeadeeGridStyles();

    const sectionBounds = getGridSectionRenderBounds(
        cells,
        offset,
        options,
        styles
    );

    return (
        <BeadeeRenderBounds
            backgroundColor={"transparent"}
            {...sectionBounds}
            isVisible={sectionBounds !== undefined}
        >
            {cells.map((cell) => (
                <BeadeeGridCell
                    key={getCellKey(cell)}
                    color={cell.color}
                    offset={shiftOffset(cell.offset, offset)}
                    isSelected
                />
            ))}
            {children}
        </BeadeeRenderBounds>
    );
};
