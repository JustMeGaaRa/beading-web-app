import { ToolState } from "./types";

export function getCursor(
    tool: ToolState
): "move" | "grab" | "crosshair" | "cursor" {
    switch (tool.name) {
        case "move":
            return "grab";
        case "cursor":
            return "crosshair";
        default:
            return "cursor";
    }
}

export const createToolInfo = (tool: ToolState) => {
    return {
        isPencilEnabled: tool.name === "pencil",
        isCursorEnabled: tool.name === "cursor",
        isEraserEnabled: tool.name === "eraser",
        isPickerEnabled: tool.name === "picker",
        isMirrorEnabled:
            tool.name === "cursor" && tool.state.currentAction === "mirror",
        isDuplicateEnabled:
            tool.name === "cursor" && tool.state.currentAction === "duplicate",
        isMovementEnabled: tool.name === "move",
        cursor: getCursor(tool),
    };
};
