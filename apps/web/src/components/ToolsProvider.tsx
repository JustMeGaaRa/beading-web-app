import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useCallback,
    useContext,
    useState,
} from "react";

export type ToolName =
    | "none"
    | "move"
    | "cursor"
    | "pencil"
    | "fill"
    | "eraser"
    | "picker";

export type ToolDefaultActionName = "default";

export type CursorActionName =
    | ToolDefaultActionName
    | "mirror"
    | "duplicate"
    | "copy"
    | "cut"
    | "paste";

export type ToolInfo<
    TTool extends string,
    TState extends { currentAction: string | "default" },
> = {
    name: TTool;
    state: TState;
};

export type ToolState =
    | ToolInfo<"none", { currentAction: ToolDefaultActionName }>
    | ToolInfo<"move", { currentAction: ToolDefaultActionName }>
    | ToolInfo<"cursor", { currentAction: CursorActionName }>
    | ToolInfo<"pencil", { currentAction: ToolDefaultActionName }>
    | ToolInfo<"fill", { currentAction: ToolDefaultActionName }>
    | ToolInfo<"eraser", { currentAction: ToolDefaultActionName }>
    | ToolInfo<"picker", { currentAction: ToolDefaultActionName }>;

const ToolsContext = createContext<{
    tool: ToolState;
    setTool: Dispatch<SetStateAction<ToolState>>;
}>({
    tool: { name: "move", state: { currentAction: "default" } },
    setTool: () => {},
});

export const ToolsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [tool, setTool] = useState<ToolState>({
        name: "move",
        state: { currentAction: "default" },
    });

    return (
        <ToolsContext.Provider value={{ tool, setTool }}>
            {children}
        </ToolsContext.Provider>
    );
};

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
