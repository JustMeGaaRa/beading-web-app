import { RenderPoint } from "@beadee/grid-editor";
import { useCallback, useContext } from "react";
import { ToolsContext } from "./context";
import { ToolState } from "./types";

export const useTools = () => {
    const { tool, setTool } = useContext(ToolsContext);

    const toggleTool = useCallback(
        (tool: ToolState) => {
            setTool((state) =>
                state.name === tool.name
                    ? { name: "move", state: { currentAction: "default" } }
                    : tool
            );
        },
        [setTool]
    );

    const enablePencil = useCallback(() => {
        setTool({ name: "pencil", state: { currentAction: "default" } });
    }, [setTool]);

    const enableCursor = useCallback(() => {
        setTool({ name: "cursor", state: { currentAction: "default" } });
    }, [setTool]);

    const enableEraser = useCallback(() => {
        setTool({ name: "eraser", state: { currentAction: "default" } });
    }, [setTool]);

    const enablePicker = useCallback(() => {
        setTool({ name: "picker", state: { currentAction: "default" } });
    }, [setTool]);

    return {
        tool,
        setTool,
        toggleTool,
        enablePencil,
        enableCursor,
        enableEraser,
        enablePicker,
    };
};

export const useColorPicker = () => {
    const { setTool } = useContext(ToolsContext);

    const enablePicker = useCallback(() => {
        setTool({ name: "picker", state: { currentAction: "default" } });
    }, [setTool]);

    const pickCellColor = useCallback(
        (position: RenderPoint) => {
            // TODO: perform a hit test, get the color and set selected color
            console.log("Picking color at position", position);
            // NOTE: reset the tool to pencil after color is being picked
            setTool({ name: "pencil", state: { currentAction: "default" } });
        },
        [setTool]
    );

    return { enablePicker, pickCellColor };
};
