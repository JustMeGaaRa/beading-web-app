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
