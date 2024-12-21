import { FC, memo } from "react";
import { BeadingGridProperties } from "../types";
import { BeadingGridCell } from "./BeadingGridCell";


export const BeadingGridBackgroundPattern: FC<{
    options: BeadingGridProperties;
}> = memo(({
    options
}) => {
    const height = options.type === "brick" ? options.height + options.fringe : options.height;
    const width = options.width;

    return Array
        .from({ length: height })
        .map((_, rowIndex) => Array
            .from({ length: width })
            .map((_, columnIndex) => ({ color: "", offset: { rowIndex, columnIndex } }))
        )
        .flat()
        .map(cell => (
            <BeadingGridCell
                key={`blank-${cell.offset.rowIndex}-${cell.offset.columnIndex}`}
                color={cell.color}
                offset={cell.offset} />
        ));
});
