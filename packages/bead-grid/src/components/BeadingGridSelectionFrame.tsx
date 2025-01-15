import { KonvaEventObject } from "konva/lib/Node";
import { FC } from "react";
import { Layer, Rect } from "react-konva";
import { useGridSelectionFrame, useGridStyles } from "../hooks";

export const BeadingGridSelectionFrame: FC<{
    isVisible?: boolean;
    onClick?: (event: KonvaEventObject<MouseEvent>) => void;
}> = ({ isVisible, onClick }) => {
    const { styles } = useGridStyles();
    const { mouseDownPosition, mouseCurrentPosition } = useGridSelectionFrame();

    return (
        isVisible &&
        mouseDownPosition &&
        mouseCurrentPosition && (
            <Layer>
                <Rect
                    fill={styles.components.frame.selection.backgroundColor}
                    listening={false}
                    opacity={0.3}
                    stroke={styles.components.frame.selection.borderColor}
                    strokeWidth={styles.components.frame.selection.borderWidth}
                    x={mouseDownPosition.x}
                    y={mouseDownPosition.y}
                    width={mouseCurrentPosition.x - mouseDownPosition.x}
                    height={mouseCurrentPosition.y - mouseDownPosition.y}
                    onClick={onClick}
                    onTap={onClick}
                />
            </Layer>
        )
    );
};
