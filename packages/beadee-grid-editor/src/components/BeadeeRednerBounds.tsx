import { KonvaEventObject } from "konva/lib/Node";
import { FC, PropsWithChildren } from "react";
import { Group, Rect } from "react-konva";
import { useBeadeeGridStyles } from "../hooks";
import { RenderPoint } from "../types";
import { BeadeeRenderBoundsProvider } from "./BeadeeRenderBoundsProvider";

export const BeadeeRenderBounds: FC<
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
    const { styles } = useBeadeeGridStyles();

    return (
        <BeadeeRenderBoundsProvider
            position={position}
            height={height}
            width={width}
        >
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
        </BeadeeRenderBoundsProvider>
    );
};
