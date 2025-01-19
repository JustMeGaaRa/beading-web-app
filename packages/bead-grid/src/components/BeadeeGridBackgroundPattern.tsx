import { FC } from "react";
import { Circle } from "react-konva";
import { Portal } from "react-konva-utils";
import { getGridCellRenderBounds, getGridSize } from "../utils";
import { useGrid, useGridStyles } from "../hooks";

export const BeadeeGridBackgroundPattern: FC = () => {
    const { styles } = useGridStyles();
    const { gridId, options } = useGrid();

    const { height, width } = getGridSize(options);

    return (
        <Portal selector={`.${gridId}`}>
            {Array.from({ length: height })
                .map((_, rowIndex) =>
                    Array.from({ length: width }).map((_, columnIndex) => ({
                        color: "",
                        offset: { rowIndex, columnIndex },
                    }))
                )
                .flat()
                .map((cell) => {
                    const {
                        position: relativePosition,
                        height,
                        width,
                    } = getGridCellRenderBounds(cell.offset, options, styles);

                    return (
                        <Circle
                            key={`blank-${cell.offset.rowIndex}-${cell.offset.columnIndex}`}
                            listening={false}
                            fill={styles.components.pattern.color}
                            height={4}
                            width={4}
                            x={relativePosition.x + width / 2}
                            y={relativePosition.y + height / 2}
                        />
                    );
                })}
        </Portal>
    );
};
