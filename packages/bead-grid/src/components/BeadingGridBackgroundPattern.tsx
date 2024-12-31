import { FC } from "react";
import { Circle, Group } from "react-konva";
import {
    getGridCellRenderBounds,
    getGridCellRenderSize,
    getGridSize,
} from "../utils";
import { useGrid, useGridStyles } from "../hooks";

export const BeadingGridBackgroundPattern: FC = () => {
    const { styles } = useGridStyles();
    const { options } = useGrid();

    const { height, width } = getGridSize(options);

    return (
        <Group>
            {Array.from({ length: height })
                .map((_, rowIndex) =>
                    Array.from({ length: width }).map((_, columnIndex) => ({
                        color: "",
                        offset: { rowIndex, columnIndex },
                    }))
                )
                .flat()
                .map((cell) => {
                    const { x, y } = getGridCellRenderBounds(
                        cell.offset,
                        options,
                        styles
                    );
                    const { height, width } = getGridCellRenderSize(
                        options,
                        styles
                    );

                    return (
                        <Circle
                            key={`blank-${cell.offset.rowIndex}-${cell.offset.columnIndex}`}
                            listening={false}
                            fill={styles.components.pattern.color}
                            height={4}
                            width={4}
                            x={x + width / 2}
                            y={y + height / 2}
                        />
                    );
                })}
        </Group>
    );
};
