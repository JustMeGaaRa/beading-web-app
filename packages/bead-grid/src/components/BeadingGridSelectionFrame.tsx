import { KonvaEventObject } from "konva/lib/Node";
import { FC } from "react";
import { Rect } from "react-konva";
import { useGridStyles } from "../hooks";

export const BeadingGridSelectionFrame: FC<{
    x: number;
    y: number;
    height: number;
    width: number;
    onClick?: (event: KonvaEventObject<MouseEvent>) => void;
}> = ({ x, y, height, width, onClick }) => {
    const { styles } = useGridStyles();

    return (
        <Rect
            fill={styles.components.frame.selection.backgroundColor}
            listening={false}
            opacity={0.3}
            stroke={styles.components.frame.selection.borderColor}
            strokeWidth={styles.components.frame.selection.borderWidth}
            height={height}
            width={width}
            x={x}
            y={y}
            onClick={onClick}
            onTap={onClick}
        />
    );
};
