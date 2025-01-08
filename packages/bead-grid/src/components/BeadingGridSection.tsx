import { FC, PropsWithChildren } from "react";
import { RenderBounds } from "../types";
import { Group, Rect } from "react-konva";
import { useGrid, useGridSelection, useGridStyles } from "../hooks";
import { getGridSectionBounds, getGridSectionRenderBounds } from "../utils";
import { Html } from "react-konva-utils";

// TODO: introduce style props to support state styling from outside
export const BeadingGridSection: FC<PropsWithChildren> = ({ children }) => {
    const { options } = useGrid();
    const { styles } = useGridStyles();
    const { selectedCells } = useGridSelection();
    const sectionBounds = getGridSectionBounds(selectedCells);
    const sectionRenderBounds = getGridSectionRenderBounds(
        sectionBounds,
        options,
        styles
    );

    return (
        <Group>
            <Rect
                listening={false}
                opacity={0.3}
                stroke={styles.components.frame.selection.borderColor}
                strokeWidth={styles.components.frame.selection.borderWidth}
                height={sectionRenderBounds.height}
                width={sectionRenderBounds.width}
                x={sectionRenderBounds.x}
                y={sectionRenderBounds.y}
            />
            {children}
        </Group>
    );
};

export const BeadingGridSectionToolbar: FC<
    PropsWithChildren<{
        isVisible?: boolean;
        placement: "top" | "bottom" | "left" | "right";
    }>
> = ({ children, isVisible, placement }) => {
    const { options } = useGrid();
    const { styles } = useGridStyles();
    const { selectedCells } = useGridSelection();
    const sectionBounds = getGridSectionBounds(selectedCells);
    const sectionRenderBounds = getGridSectionRenderBounds(
        sectionBounds,
        options,
        styles
    );
    const toolbarPosition = getPlacementPosition(
        placement,
        sectionRenderBounds
    );
    // const gridBounds = getGridRenderBounds(options, styles);
    // const isInBounds = pointInBounds(gridBounds, toolbarPosition);

    return (
        isVisible && (
            <Html
                divProps={{ style: { pointerEvents: "none" } }}
                groupProps={toolbarPosition}
                transform
                transformFunc={(attr) => ({
                    ...attr,
                    scaleX: 1,
                    scaleY: 1,
                })}
            >
                {children}
            </Html>
        )
    );
};

export const getPlacementPosition = (
    placement: "top" | "bottom" | "left" | "right",
    bounds: RenderBounds
) => {
    switch (placement) {
        case "top":
            return { x: bounds.x + bounds.width / 2, y: bounds.y };
        case "bottom":
            return {
                x: bounds.x + bounds.width / 2,
                y: bounds.y + bounds.height,
            };
        case "left":
            return { x: bounds.x, y: bounds.y };
        case "right":
            return { x: bounds.x + bounds.width, y: bounds.y };
        default:
            return { x: 0, y: 0 };
    }
};
