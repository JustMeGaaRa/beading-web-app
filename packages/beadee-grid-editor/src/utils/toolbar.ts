import { RenderBounds, RenderPoint, ToolbarPlacement } from "../types";

export const getPlacementPosition = (
    placement: ToolbarPlacement,
    bounds: RenderBounds
) => {
    switch (placement) {
        case "top-center":
            return {
                x: bounds.position.x + bounds.width / 2,
                y: bounds.position.y,
            };
        case "top-left":
            return { x: bounds.position.x, y: bounds.position.y };
        case "top-right":
            return {
                x: bounds.position.x + bounds.width,
                y: bounds.position.y,
            };
        case "bottom-center":
            return {
                x: bounds.position.x + bounds.width / 2,
                y: bounds.position.y + bounds.height,
            };
        case "bottom-left":
            return {
                x: bounds.position.x,
                y: bounds.position.y + bounds.height,
            };
        case "bottom-right":
            return {
                x: bounds.position.x + bounds.width,
                y: bounds.position.y + bounds.height,
            };
        case "right-center":
            return {
                x: bounds.position.x,
                y: bounds.position.y + bounds.height / 2,
            };
        case "left-center":
            return {
                x: bounds.position.x + bounds.width,
                y: bounds.position.y + bounds.height / 2,
            };
        default:
            return { x: 0, y: 0 };
    }
};

export const getPlacementRelativePosition = (
    placement: ToolbarPlacement,
    bounds: RenderBounds
) => {
    return getPlacementPosition(placement, bounds);
};

export const getPlacementAbsolutePosition = (
    placement: ToolbarPlacement,
    gridPosition: RenderPoint,
    bounds: RenderBounds
) => {
    const cellAbsolutePosition = {
        x: bounds.position.x + gridPosition.x,
        y: bounds.position.y + gridPosition.y,
    };
    const absoluteBounds = {
        ...bounds,
        position: cellAbsolutePosition,
    };
    return getPlacementPosition(placement, absoluteBounds);
};
