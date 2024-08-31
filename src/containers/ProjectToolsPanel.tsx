import { Box, ButtonGroup, IconButton } from "@chakra-ui/react";
import {
  ColorPicker,
  CursorPointer,
  EditPencil,
  Erase,
  Redo,
  Undo,
} from "iconoir-react";
import { FC } from "react";
import { useTools } from "../components";
import { PanelPosition } from "../types";

export const ProjectToolsPanel: FC<{
  position: PanelPosition;
}> = ({ position }) => {
  const { selectedTool, setSelectedTool } = useTools();

  return (
    <Box
      padding={1}
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
        <IconButton aria-label={"undo"} icon={<Undo />} title={"Undo"} />
        <IconButton aria-label={"redo"} icon={<Redo />} title={"Redo"} />
      </ButtonGroup>
    </Box>
  );
};
