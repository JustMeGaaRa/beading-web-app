import { FC, PropsWithChildren, useState } from "react";
import { ToolState } from "./types";
import { ToolsContext } from "./context";

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
