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
    tool: { name: "none", state: { currentAction: "default" } },
    setTool: () => {},
});

export const ToolsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [tool, setTool] = useState<ToolState>({
        name: "none",
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
                    ? { name: "none", state: { currentAction: "default" } }
                    : tool
            );
        },
        [setTool]
    );

    return {
        tool,
        setTool,
        toggleTool,
    };
};
