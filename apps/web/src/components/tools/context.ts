import { createContext, Dispatch, SetStateAction } from "react";
import { ToolState } from "./types";

export const ToolsContext = createContext<{
    tool: ToolState;
    setTool: Dispatch<SetStateAction<ToolState>>;
}>({
    tool: { name: "move", state: { currentAction: "default" } },
    setTool: () => {},
});
