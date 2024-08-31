import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

export type ToolType = "cursor" | "pencil" | "eraser" | "picker";

const ToolsContext = createContext<{
  selectedTool: ToolType;
  setSelectedTool: (tool: ToolType) => void;
}>({
  selectedTool: "pencil",
  setSelectedTool: () => {},
});

export const ToolsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [selectedTool, setSelectedTool] = useState<ToolType>("pencil");
  return (
    <ToolsContext.Provider value={{ selectedTool, setSelectedTool }}>
      {children}
    </ToolsContext.Provider>
  );
};

export const useTools = () => {
  return useContext(ToolsContext);
};
