import { Box, ButtonGroup, IconButton } from "@chakra-ui/react";
import {
  ColorPicker,
  CursorPointer,
  EditPencil,
  Erase,
  Redo,
  Undo,
} from "iconoir-react";
import { FC, useCallback } from "react";
import { usePatterHistory, useTools } from "../components";

export const ProjectToolsPanel: FC = () => {
  const { selectedTool, setSelectedTool } = useTools();
  const { undo, redo } = usePatterHistory();

  const handleOnUndoClick = useCallback(() => undo(), [undo]);

  const handleOnRedoClick = useCallback(() => redo(), [redo]);

  return (
    <Box
      padding={3}
      position={"absolute"}
      left={0}
      top={"50%"}
      transform={"translate(0, -50%)"}
      zIndex={1}
    >
      <ButtonGroup
        backgroundColor={"white"}
        borderRadius={"md"}
        colorScheme={"gray"}
        orientation={"vertical"}
        padding={1}
        spacing={1}
        size={"sm"}
        variant={"ghost"}
      >
        <IconButton
          aria-label={"cursor"}
          icon={<CursorPointer />}
          isActive={selectedTool === "cursor"}
          title={"Cursor"}
          onClick={() => setSelectedTool("cursor")}
        />
        <IconButton
          aria-label={"pencil"}
          icon={<EditPencil />}
          isActive={selectedTool === "pencil"}
          title={"Pencil"}
          onClick={() => setSelectedTool("pencil")}
        />
        <IconButton
          aria-label={"eraser"}
          icon={<Erase />}
          isActive={selectedTool === "eraser"}
          title={"Eraser"}
          onClick={() => setSelectedTool("eraser")}
        />
        <IconButton
          aria-label={"picker"}
          icon={<ColorPicker />}
          isActive={selectedTool === "picker"}
          title={"Color Picker"}
          onClick={() => setSelectedTool("picker")}
        />
        <IconButton
          aria-label={"undo"}
          icon={<Undo />}
          title={"Undo"}
          onClick={handleOnUndoClick}
        />
        <IconButton
          aria-label={"redo"}
          icon={<Redo />}
          title={"Redo"}
          onClick={handleOnRedoClick}
        />
      </ButtonGroup>
    </Box>
  );
};
