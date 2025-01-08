import { RenderBounds, ToolbarPlacement } from "../types";

export const getPlacementPosition = (
    placement: ToolbarPlacement,
    bounds: RenderBounds
) => {
    switch (placement) {
        case "top-center":
            return { x: bounds.x + bounds.width / 2, y: bounds.y };
        case "top-left":
            return { x: bounds.x, y: bounds.y };
        case "top-right":
            return { x: bounds.x + bounds.width, y: bounds.y };
        case "bottom-center":
            return {
                x: bounds.x + bounds.width / 2,
                y: bounds.y + bounds.height,
            };
        case "bottom-left":
            return { x: bounds.x, y: bounds.y + bounds.height };
        case "bottom-right":
            return { x: bounds.x + bounds.width, y: bounds.y + bounds.height };
        case "right-center":
            return { x: bounds.x, y: bounds.y + bounds.height / 2 };
        case "left-center":
            return {
                x: bounds.x + bounds.width,
                y: bounds.y + bounds.height / 2,
            };
        default:
            return { x: 0, y: 0 };
    }
};
