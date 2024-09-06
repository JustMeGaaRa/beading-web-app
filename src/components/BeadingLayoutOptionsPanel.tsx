import {
  Button,
  ButtonGroup,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
} from "@chakra-ui/react";
import { FC, ChangeEvent, useCallback } from "react";
import { BeadSizeOptions, PatternLayoutOptions } from "./pattern";

export const BeadingLayoutOptionsPanel: FC<{
    layout: PatternLayoutOptions;
    onChange?: (layout: PatternLayoutOptions) => void;
}> = ({
    layout,
    onChange
}) => {
    const handleOnVerticalClick = useCallback(() => {
        onChange?.({
            ...layout,
            orientation: "vertical",
        });
    }, [onChange, layout]);

    const handleOnHorizontalClick = useCallback(() => {
        onChange?.({
            ...layout,
            orientation: "horizontal",
        });
    }, [onChange, layout]);

    const handleOnHeightChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        onChange?.({
            ...layout,
            height: parseInt(event.target.value),
        });
    }, [onChange, layout]);

    const handleOnWidthChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        onChange?.({
            ...layout,
            width: parseInt(event.target.value),
        });
    }, [onChange, layout]);

    const handleOnBeadSizeChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        const beadSize = BeadSizeOptions.find((beadSize) => beadSize.title === event.target.value);
        onChange?.({
            ...layout,
            beadSize: beadSize!,
        });
    }, [onChange]);

    const isHorizontal = layout.orientation === "horizontal";

    return (
        <Flex flexDirection={"column"} gap={2} w={"100%"}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Text as={"b"} fontSize={"xs"}>
                    Layout
                </Text>
            </Flex>
            <ButtonGroup isAttached size={"xs"} variant={"outline"}>
                <Button
                    isActive={!isHorizontal}
                    width={"50%"}
                    onClick={handleOnVerticalClick}
                >
                    Vertical
                </Button>
                <Button
                    isActive={isHorizontal}
                    width={"50%"}
                    onClick={handleOnHorizontalClick}
                >
                    Horizontal
                </Button>
            </ButtonGroup>
            {isHorizontal && (
                <InputGroup size={"xs"}>
                    <InputLeftAddon width={"60px"}>Height</InputLeftAddon>
                    <Input
                    type={"number"}
                    value={layout.height}
                    onChange={handleOnHeightChange}
                    />
                </InputGroup>
            )}
            {!isHorizontal && (
                <InputGroup size={"xs"}>
                    <InputLeftAddon width={"60px"}>Width</InputLeftAddon>
                    <Input
                    type={"number"}
                    value={layout.width}
                    onChange={handleOnWidthChange}
                    />
                </InputGroup>
            )}
            <InputGroup size={"xs"}>
                <InputLeftAddon width={"60px"}>Bead</InputLeftAddon>
                <Select onChange={handleOnBeadSizeChange}>
                    {BeadSizeOptions.map((beadSize, index) => (
                        <option key={index} value={beadSize.title}>
                            {beadSize.title}
                        </option>
                    ))}
                </Select>
            </InputGroup>
        </Flex>
    );
};
