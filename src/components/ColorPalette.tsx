import { Box, SimpleGrid } from "@chakra-ui/react";
import { FC } from "react";
import { useColorPalette } from "./ColorPaletteProvider";

export const ColorPalette: FC = () => {
  const { colors, selectedColor, setSelectedColor } = useColorPalette();

  return (
    <SimpleGrid columns={5} spacing={1}>
      {colors.map((color) => (
        <Box
          aria-selected={selectedColor === color}
          backgroundColor={color}
          borderRadius={4}
          borderWidth={1}
          height={8}
          width={8}
          _hover={{
            borderColor: "blue.400",
          }}
          _selected={{
            borderColor: "blue.400",
          }}
          onClick={() => setSelectedColor(color)}
        />
      ))}
    </SimpleGrid>
  );
};
