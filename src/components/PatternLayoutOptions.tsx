import {
  Button,
  ButtonGroup,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
} from "@chakra-ui/react";
import { FC, ChangeEvent, useCallback, PropsWithChildren } from "react";
import { BEADING_SIZE_OPTIONS } from "./beading-grid";
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

    const handleOnHeightChange = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        const isValidInteger = Number.parseInt(event.target.value) && !Number.isNaN(event.target.value);
        if (isValidInteger) {
            onChange?.({
                ...layout,
                height: Number.parseInt(event.target.value),
            });
        }
    }, [onChange, layout]);

    const handleOnWidthChange = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        const isValidInteger = Number.parseInt(event.target.value) && !Number.isNaN(event.target.value);
        if (isValidInteger) {
            onChange?.({
                ...layout,
                width: Number.parseInt(event.target.value),
            });
        }
    }, [onChange, layout]);

    const handleOnBeadSizeChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        const beadSize = BEADING_SIZE_OPTIONS.find((beadSize) => beadSize.title === event.target.value);
        if (beadSize) {
            onChange?.({
                ...layout,
                beadSize: beadSize,
            });
        }
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
            <InputGroup borderColor={"gray.400"} size={size}>
                <InputLeftAddon width={"60px"}>Bead</InputLeftAddon>
                <Select borderColor={"gray.400"} onChange={handleOnBeadSizeChange}>
                    {BEADING_SIZE_OPTIONS.map((beadSize, index) => (
                        <option key={index} value={beadSize.title}>
                            {beadSize.title}
                        </option>
                    ))}
                </Select>
            </InputGroup>
            {layout.orientation === "horizontal" && (
                <InputGroup borderColor={"gray.400"} size={size}>
                    <InputLeftAddon width={"60px"}>Height</InputLeftAddon>
                    <NumberInput
                        allowMouseWheel
                        borderColor={"gray.400"}
                        clampValueOnBlur
                        defaultValue={layout.height}
                        keepWithinRange
                        min={1}
                        max={100}
                        width={"100%"}
                        onBlur={handleOnHeightChange}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </InputGroup>
            )}
            {layout.orientation === "vertical" && (
                <InputGroup borderColor={"gray.400"} size={size}>
                    <InputLeftAddon width={"60px"}>Width</InputLeftAddon>
                    <NumberInput
                        allowMouseWheel
                        borderColor={"gray.400"}
                        clampValueOnBlur
                        defaultValue={layout.width}
                        keepWithinRange
                        min={1}
                        max={100}
                        width={"100%"}
                        onBlur={handleOnWidthChange}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </InputGroup>
            )}
        </Flex>
    );
};
