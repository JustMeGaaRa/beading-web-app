import { Box, SimpleGrid } from "@chakra-ui/react";
import {
    createContext,
    FC,
    memo,
    PropsWithChildren,
    useCallback,
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
    const [selectedColor, setSelectedColor] = useState<string>(
        initialColors[0]
    );

    return (
        <ColorPaletteContext.Provider
            value={{ colors, selectedColor, setColors, setSelectedColor }}
        >
            {children}
        </ColorPaletteContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useColorPalette = () => {
    return useContext(ColorPaletteContext);
};

export const ColorPalette: FC<{
    onSelect?: (color: string) => void;
}> = ({ onSelect }) => {
    const { colors, selectedColor } = useColorPalette();

    return (
        <SimpleGrid columns={5} spacing={1}>
            {colors.map((color) => (
                <ColorBox
                    key={color}
                    color={color}
                    isSelected={selectedColor === color}
                    onClick={onSelect}
                />
            ))}
        </SimpleGrid>
    );
};

export const ColorBox: FC<{
    color: string;
    isSelected?: boolean;
    onClick?: (color: string) => void;
}> = memo(({ color, isSelected, onClick }) => {
    const handleOnClick = useCallback(() => onClick?.(color), [color, onClick]);

    return (
        <Box
            aria-selected={isSelected}
            backgroundColor={color}
            borderColor={"gray.200"}
            borderRadius={4}
            borderWidth={1}
            height={8}
            width={8}
            _hover={{
                borderColor: "#FFFFFF",
                boxShadow: "0px 0px 0px 2px #0BC5EA;",
            }}
            _selected={{
                borderColor: "#FFFFFF",
                boxShadow: "0px 0px 0px 2px #0BC5EA;",
            }}
            onClick={handleOnClick}
        />
    );
});
