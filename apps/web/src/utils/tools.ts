import { ToolState } from "../components";

export function isPencil(tool: ToolState): boolean {
    return tool.name === "pencil";
}

export function isEraser(tool: ToolState): boolean {
    return tool.name === "eraser";
}

export function isCursor(tool: ToolState): boolean {
    return tool.name === "cursor" && tool.state.currentAction === "default";
}

export function isMovement(tool: ToolState): boolean {
    return tool.name === "move";
}

export function isColorFill(tool: ToolState): boolean {
    return tool.name === "fill";
}

export function isColorPicker(tool: ToolState): boolean {
    return tool.name === "picker";
}

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

export default {
    isPencil,
    isEraser,
    isCursor,
    isMovement,
    isColorFill,
    isColorPicker,
    getCursor,
};
