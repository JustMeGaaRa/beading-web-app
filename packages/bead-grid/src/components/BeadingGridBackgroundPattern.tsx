import { FC } from "react";
import { Circle } from "react-konva";
import { getGridCellOffset, getGridCellRenderSize } from "../utils";
import { useGrid, useGridStyles } from "../hooks";

export const BeadingGridBackgroundPattern: FC = () => {
    const { styles } = useGridStyles();
    const { options } = useGrid();

    const height = options.type === "brick" ? options.height + options.fringe : options.height;
    const width = options.width;

    return Array
        .from({ length: height })
        .map((_, rowIndex) => Array
            .from({ length: width })
            .map((_, columnIndex) => ({ color: "", offset: { rowIndex, columnIndex } }))
        )
        .flat()
        .map(cell => {
            const { x, y } = getGridCellOffset(cell.offset, options, styles);
            const { height, width } = getGridCellRenderSize(options, styles);

            return (
                <Circle
                    key={`blank-${cell.offset.rowIndex}-${cell.offset.columnIndex}`}
                    fill={styles.components.pattern.color}
                    height={4}
                    width={4}
                    x={x + width / 2}
                    y={y + height / 2}
                />
            );
        });
};
