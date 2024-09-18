import {
    Flex,
    InputGroup,
    InputLeftAddon,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from "@chakra-ui/react";
import { FC, useCallback } from "react";
import {
    BeadingGridProperties,
    BeadingGridState,
} from "./beading-grid";

export const BeadingGridOptionsPanel: FC<{
    name: string;
    options: BeadingGridProperties;
    orientation: "vertical" | "horizontal";
    size?: "xs" | "sm" | "md" | "lg";
    onChange?: (grid: Omit<BeadingGridState, "rows">) => void;
}> = ({
    name,
    options,
    orientation,
    size = "xs",
    onChange,
}) => {
    const handleOnHeightChange = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        const isValidInteger = Number.parseInt(event.target.value) && !Number.isNaN(event.target.value);
        if (isValidInteger) {
            onChange?.({
                name: name,
                options: {
                    ...options,
                    height: Number.parseInt(event.target.value),
                },
            });
        }
    }, [onChange, name, options]);

    const handleOnWidthChange = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        const isValidInteger = Number.parseInt(event.target.value) && !Number.isNaN(event.target.value);
        if (isValidInteger) {
            onChange?.({
                name: name,
                options: {
                    ...options,
                    width: Number.parseInt(event.target.value),
                },
            });
        }
    }, [onChange, name, options]);

    const handleOnDropChange = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        const isValidInteger = Number.parseInt(event.target.value) && !Number.isNaN(event.target.value);
        if (options.type === "brick" && isValidInteger) {
            onChange?.({
                    name: name,
                    options: {
                    ...options,
                    drop: Number.parseInt(event.target.value),
                },
            });
        }
    }, [onChange, name, options]);

    const handleOnFringeChange = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        const isValidInteger = Number.parseInt(event.target.value) && !Number.isNaN(event.target.value);
        if (options.type === "brick" && isValidInteger) {
            onChange?.({
                    name: name,
                    options: {
                    ...options,
                    fringe: Number.parseInt(event.target.value),
                },
            });
        }
    }, [onChange, name, options]);
    
    const isHorizontal = orientation === "horizontal";
    const isBrickGrid = options.type === "brick";

    return (
        <Flex flexDirection={"column"} gap={2} w={"100%"}>
            {!isHorizontal && (
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
            {isHorizontal && (
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
            {isBrickGrid && (
                <InputGroup borderColor={"gray.400"} size={size}>
                    <InputLeftAddon width={"60px"}>Drop</InputLeftAddon>
                    <NumberInput
                        allowMouseWheel
                        borderColor={"gray.400"}
                        clampValueOnBlur
                        defaultValue={options.drop}
                        keepWithinRange
                        min={1}
                        max={100}
                        width={"100%"}
                        onBlur={handleOnDropChange}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </InputGroup>
            )}
            {isBrickGrid && (
                <InputGroup borderColor={"gray.400"} size={size}>
                    <InputLeftAddon width={"60px"}>Fringe</InputLeftAddon>
                    <NumberInput
                        allowMouseWheel
                        borderColor={"gray.400"}
                        clampValueOnBlur
                        defaultValue={options.fringe}
                        keepWithinRange
                        min={0}
                        max={100}
                        width={"100%"}
                        onBlur={handleOnFringeChange}
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
