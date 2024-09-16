import {
  Button,
  ButtonGroup,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
} from "@chakra-ui/react";
import { FC, ChangeEvent, useCallback, PropsWithChildren } from "react";
import { BeadSizeOptions } from "./beading-grid";
import { HorizontalAlignRightIcon, VerticalAlignBottomIcon } from "./icons";
import { PatternLayoutOptions } from "./pattern";

export const BeadingLayoutOptionsPanel: FC<PropsWithChildren<{
    mode?: "initialization" | "configuration";
    size?: "xs" | "sm" | "md" | "lg";
    title?: string;
    layout: PatternLayoutOptions;
    onChange?: (layout: PatternLayoutOptions) => void;
}>> = ({
    mode = "configuration",
    size = "xs",
    title,
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
    }, [onChange, layout]);

    return (
        <Flex flexDirection={"column"} gap={2} w={"100%"}>
            <ButtonGroup isAttached size={size} variant={"outline"}>
                <Button
                    aria-selected={layout.orientation === "vertical"}
                    borderColor={"gray.400"}
                    leftIcon={<Icon as={VerticalAlignBottomIcon} />}
                    width={"50%"}
                    _selected={{
                        backgroundColor: "gray.900",
                        color: "gray.50",
                    }}
                    _hover={{
                        backgroundColor: "gray.700",
                        color: "gray.50",
                    }}
                    onClick={handleOnVerticalClick}
                >
                    Vertical
                </Button>
                <Button
                    aria-selected={layout.orientation === "horizontal"}
                    borderColor={"gray.400"}
                    leftIcon={<Icon as={HorizontalAlignRightIcon} />}
                    width={"50%"}
                    _selected={{
                        backgroundColor: "gray.900",
                        color: "gray.50",
                    }}
                    _hover={{
                        backgroundColor: "gray.700",
                        color: "gray.50",
                    }}
                    onClick={handleOnHorizontalClick}
                >
                    Horizontal
                </Button>
            </ButtonGroup>
            {layout.orientation === "horizontal" && (
                <InputGroup borderColor={"gray.400"} size={size}>
                    <InputLeftAddon width={"60px"}>Height</InputLeftAddon>
                    <Input
                        min={1}
                        max={100}
                        type={"number"}
                        value={layout.height}
                        onChange={handleOnHeightChange}
                    />
                </InputGroup>
            )}
            {layout.orientation === "vertical" && (
                <InputGroup borderColor={"gray.400"} size={size}>
                    <InputLeftAddon width={"60px"}>Width</InputLeftAddon>
                    <Input
                        min={1}
                        max={100}
                        type={"number"}
                        value={layout.width}
                        onChange={handleOnWidthChange}
                    />
                </InputGroup>
            )}
            <InputGroup borderColor={"gray.400"} size={size}>
                <InputLeftAddon width={"60px"}>Bead</InputLeftAddon>
                <Select borderColor={"gray.400"} onChange={handleOnBeadSizeChange}>
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
