import {
    Button,
    ButtonGroup,
    Flex,
    InputGroup,
    InputLeftAddon,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
} from "@chakra-ui/react";
import { BEAD_OPTIONS } from "@beadee/grid-editor";
import { PatternOptions } from "@beadee/pattern-editor";
import { AlignRightIcon, AlignBottomIcon } from "@beadee/icons";
import { FC, ChangeEvent, useCallback, PropsWithChildren } from "react";

export const BeadeePatternOptionsPanel: FC<
    PropsWithChildren<{
        size?: "xs" | "sm" | "md" | "lg";
        options: PatternOptions;
        onChange?: (options: PatternOptions) => void;
    }>
> = ({ size = "xs", options, onChange }) => {
    const handleOnVerticalClick = useCallback(() => {
        onChange?.({
            ...options,
            orientation: "vertical",
        });
    }, [onChange, options]);

    const handleOnHorizontalClick = useCallback(() => {
        onChange?.({
            ...options,
            orientation: "horizontal",
        });
    }, [onChange, options]);

    const handleOnHeightBlur = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            const value = event.target.value;
            const isValidInteger =
                Number.parseInt(value) && !Number.isNaN(value);
            if (isValidInteger) {
                onChange?.({
                    ...options,
                    height: Number.parseInt(value),
                });
            }
        },
        [onChange, options]
    );

    const handleOnWidthBlur = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            const value = event.target.value;
            const isValidInteger =
                Number.parseInt(value) && !Number.isNaN(value);
            if (isValidInteger) {
                onChange?.({
                    ...options,
                    width: Number.parseInt(value),
                });
            }
        },
        [onChange, options]
    );

    const handleOnHeightKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            console.log("height", event.key);
            if (event.key === "Enter") {
                event.currentTarget.blur();
            }
        },
        []
    );

    const handleOnWidthKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            console.log("width", event.key);
            if (event.key === "Enter") {
                event.currentTarget.blur();
            }
        },
        []
    );

    const handleOnBeadSizeChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            const beadSize = BEAD_OPTIONS.find(
                (beadSize) => beadSize.title === event.target.value
            );
            if (beadSize) {
                onChange?.({
                    ...options,
                    beadSize: beadSize,
                });
            }
        },
        [onChange, options]
    );

    return (
        <Flex flexDirection={"column"} gap={2} w={"100%"}>
            <ButtonGroup isAttached size={size} variant={"outline"}>
                <Button
                    aria-selected={options.orientation === "vertical"}
                    borderColor={"gray.400"}
                    leftIcon={<AlignBottomIcon size={16} />}
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
                    aria-selected={options.orientation === "horizontal"}
                    borderColor={"gray.400"}
                    leftIcon={<AlignRightIcon size={16} />}
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
                <Select
                    borderColor={"gray.400"}
                    onChange={handleOnBeadSizeChange}
                >
                    {BEAD_OPTIONS.map((beadSize, index) => (
                        <option key={index} value={beadSize.title}>
                            {beadSize.title}
                        </option>
                    ))}
                </Select>
            </InputGroup>
            {options.orientation === "horizontal" && (
                <InputGroup borderColor={"gray.400"} size={size}>
                    <InputLeftAddon width={"60px"}>Height</InputLeftAddon>
                    <NumberInput
                        allowMouseWheel
                        borderColor={"gray.400"}
                        clampValueOnBlur
                        defaultValue={options.height}
                        keepWithinRange
                        min={1}
                        max={100}
                        width={"100%"}
                        onBlur={handleOnHeightBlur}
                        onKeyDown={handleOnHeightKeyDown}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </InputGroup>
            )}
            {options.orientation === "vertical" && (
                <InputGroup borderColor={"gray.400"} size={size}>
                    <InputLeftAddon width={"60px"}>Width</InputLeftAddon>
                    <NumberInput
                        allowMouseWheel
                        borderColor={"gray.400"}
                        clampValueOnBlur
                        defaultValue={options.width}
                        keepWithinRange
                        min={1}
                        max={100}
                        width={"100%"}
                        onBlur={handleOnWidthBlur}
                        onKeyDown={handleOnWidthKeyDown}
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
