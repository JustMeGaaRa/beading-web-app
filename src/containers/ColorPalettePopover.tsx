import {
    Box,
    Divider,
    Flex,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text
} from "@chakra-ui/react";
import { FC, PropsWithChildren, useCallback } from "react";
import { BeadSummaryItem, ColorPalette, usePattern } from "../components";

export const ColorPalettePopover: FC<PropsWithChildren<{
    color: string;
    colorName: string;
    number: number;
}>> = ({
    color,
    colorName,
    number
}) => {
    const { changePatternColor } = usePattern();

    const handleOnColorPaletteSelect = useCallback((newColor: string) => {
        changePatternColor(color, newColor);
    }, [changePatternColor, color]);

    return (
        <Popover placement={"right-end"} closeOnBlur>
            <PopoverTrigger>
                <Box
                    backgroundColor={color}
                    borderColor={"gray.200"}
                    borderRadius={4}
                    borderWidth={1}
                    height={8}
                    width={8}
                    _hover={{ borderColor: "#FFFFFF", boxShadow: "0px 0px 0px 2px #0BC5EA;" }}
                />
            </PopoverTrigger>
            <PopoverContent borderRadius={12} width={220}>
                <PopoverBody>
                    <Flex flexDirection={"column"} gap={2} overflowY={"scroll"} padding={1}>
                        <Text color={"gray.700"} fontSize={"sm"} fontWeight={600}>Select color</Text>
                        <BeadSummaryItem color={color} colorName={colorName} number={number} />
                        <Divider borderColor={"blackAlpha.200"} />
                        <ColorPalette onSelect={handleOnColorPaletteSelect} />
                    </Flex>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};
