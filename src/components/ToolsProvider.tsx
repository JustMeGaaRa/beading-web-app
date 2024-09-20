import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useState,
} from "react";

export type ToolName = 
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
    TState extends { currentAction: string | "default" }
> = {
    name: TTool;
    state: TState;
};

export type ToolState = 
    | ToolInfo<"move",   { currentAction: ToolDefaultActionName }>
    | ToolInfo<"cursor", { currentAction: CursorActionName }>
    | ToolInfo<"pencil", { currentAction: ToolDefaultActionName }>
    | ToolInfo<"fill",   { currentAction: ToolDefaultActionName }>
    | ToolInfo<"eraser", { currentAction: ToolDefaultActionName }>
    | ToolInfo<"picker", { currentAction: ToolDefaultActionName }>;

const ToolsContext = createContext<{
    tool: ToolState;
    setTool: Dispatch<SetStateAction<ToolState>>;
}>({
    tool: { name: "pencil", state: { currentAction: "default" } },
    setTool: () => {},
});

export const ToolsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [tool, setTool] = useState<ToolState>({
        name: "pencil",
        state: { currentAction: "default" }
    });

    return (
        <ToolsContext.Provider value={{ tool, setTool }}>
            {children}
        </ToolsContext.Provider>
    );
};

export const useTools = () => {
    return useContext(ToolsContext);
};
