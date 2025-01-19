import { KonvaEventObject } from "konva/lib/Node";
import { FC, PropsWithChildren } from "react";
import { Group, Rect } from "react-konva";
import { useGridStyles } from "../hooks";
import { RenderPoint } from "../types";

export const BeadingGridSelectionFrame: FC<
    PropsWithChildren<{
        backgroundColor?: string;
        position: RenderPoint;
        height: number;
        width: number;
        isVisible?: boolean;
        onClick?: (event: KonvaEventObject<MouseEvent>) => void;
    }>
> = ({
    children,
    backgroundColor,
    position,
    height,
    width,
    isVisible,
    onClick,
}) => {
    const { styles } = useGridStyles();

    return (
        <Group visible={isVisible}>
            <Rect
                fill={
                    backgroundColor ??
                    styles.components.frame.selection.backgroundColor
                }
                listening={false}
                opacity={0.3}
                stroke={styles.components.frame.selection.borderColor}
                strokeWidth={styles.components.frame.selection.borderWidth}
                x={position.x}
                y={position.y}
                height={height}
                width={width}
                onClick={onClick}
                onTap={onClick}
            />
            {children}
        </Group>
    );
};
