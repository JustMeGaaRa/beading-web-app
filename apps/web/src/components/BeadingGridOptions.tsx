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
import { BeadingGridProperties } from "@beadee/grid-editor";
import { FC, useCallback } from "react";

export const BeadingGridOptionsPanel: FC<{
    name: string;
    options: BeadingGridProperties;
    orientation: "vertical" | "horizontal";
    size?: "xs" | "sm" | "md" | "lg";
    onChange?: (options: BeadingGridProperties) => void;
}> = ({ options, orientation, size = "xs", onChange }) => {
    const handleOnHeightBlur = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            const isValidInteger =
                Number.parseInt(event.target.value) &&
                !Number.isNaN(event.target.value);
            if (isValidInteger) {
                onChange?.({
                    ...options,
                    height: Number.parseInt(event.target.value),
                });
            }
        },
        [onChange, options]
    );

    const handleOnWidthBlur = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            const isValidInteger =
                Number.parseInt(event.target.value) &&
                !Number.isNaN(event.target.value);
            if (isValidInteger) {
                onChange?.({
                    ...options,
                    width: Number.parseInt(event.target.value),
                });
            }
        },
        [onChange, options]
    );

    const handleOnDropBlur = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            const isValidInteger =
                Number.parseInt(event.target.value) &&
                !Number.isNaN(event.target.value);
            if (options.type === "brick" && isValidInteger) {
                onChange?.({
                    ...options,
                    drop: Number.parseInt(event.target.value),
                });
            }
        },
        [onChange, options]
    );

    const handleOnFringeBlur = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            const isValidInteger =
                Number.parseInt(event.target.value) &&
                !Number.isNaN(event.target.value);
            if (options.type === "brick" && isValidInteger) {
                onChange?.({
                    ...options,
                    fringe: Number.parseInt(event.target.value),
                });
            }
        },
        [onChange, options]
    );

    const handleOnHeightKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "Enter") {
                event.currentTarget.blur();
            }
        },
        []
    );

    const handleOnWidthKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "Enter") {
                event.currentTarget.blur();
            }
        },
        []
    );

    const handleOnDropKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "Enter") {
                event.currentTarget.blur();
            }
        },
        []
    );

    const handleOnFringeKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "Enter") {
                event.currentTarget.blur();
            }
        },
        []
    );

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
                        onBlur={handleOnDropBlur}
                        onKeyDown={handleOnDropKeyDown}
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
                        onBlur={handleOnFringeBlur}
                        onKeyDown={handleOnFringeKeyDown}
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
