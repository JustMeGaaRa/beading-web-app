import { FC, useMemo } from "react";
import { Circle } from "react-konva";
import { Portal } from "react-konva-utils";
import { getCellRenderBounds } from "../utils";
import { useBeadeeGridOptions, useBeadeeGridStyles } from "../hooks";
import { getGridSize, shiftOffset } from "../types";

export const BeadeeGridBackgroundPattern: FC<{
    id: string;
}> = ({ id }) => {
    const { styles } = useBeadeeGridStyles();
    const { offset, options } = useBeadeeGridOptions();

    const cells = useMemo(() => {
        const { height, width } = getGridSize(options);
        return Array.from({ length: height })
            .map((_, rowIndex) =>
                Array.from({ length: width }).map((_, columnIndex) => ({
                    color: "",
                    offset: shiftOffset(offset, { rowIndex, columnIndex }),
                }))
            )
            .flat();
    }, [options]);

    return (
        <Portal selector={`.${id}`}>
            {cells.map((cell) => {
                const { position, height, width } = getCellRenderBounds(
                    cell.offset,
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
                        x={position.x + width / 2}
                        y={position.y + height / 2}
                    />
                );
            })}
        </Portal>
    );
};
