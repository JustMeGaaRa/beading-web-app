import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

const ColorPaletteContext = createContext<{
  colors: Array<string>;
  selectedColor: string;
  setColors: (colors: Array<string>) => void;
  setSelectedColor: (color: string) => void;
}>({
  colors: [],
  selectedColor: "",
  setColors: () => {},
  setSelectedColor: () => {},
});

export const ColorPaletteProvider: FC<
  PropsWithChildren<{
    colors?: Array<string>;
  }>
> = ({ children, colors: initialColors = [] }) => {
  const [colors, setColors] = useState<Array<string>>(initialColors);
  const [selectedColor, setSelectedColor] = useState<string>(initialColors[0]);

  return (
    <ColorPaletteContext.Provider
      value={{ colors, selectedColor, setColors, setSelectedColor }}
    >
      {children}
    </ColorPaletteContext.Provider>
  );
};

export const useColorPalette = () => {
  return useContext(ColorPaletteContext);
};
