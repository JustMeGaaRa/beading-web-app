import {
    Flex,
    Input,
    InputGroup,
    InputLeftAddon,
} from "@chakra-ui/react";
import { ChangeEvent, FC, useCallback } from "react";
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
    const handleOnHeightChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
            onChange?.({
                name: name,
                options: {
                    ...options,
                    height: parseInt(event.target.value),
                },
            });
    }, [onChange, name, options]);

    const handleOnWidthChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
            onChange?.({
                name: name,
                options: {
                    ...options,
                    width: parseInt(event.target.value),
                },
            });
    }, [onChange, name, options]);

    const handleOnDropChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (options.type === "brick") {
            onChange?.({
                    name: name,
                    options: {
                    ...options,
                    drop: parseInt(event.target.value),
                },
            });
        }
    }, [onChange, name, options]);

    const handleOnFringeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (options.type === "brick") {
            onChange?.({
                    name: name,
                    options: {
                    ...options,
                    fringe: parseInt(event.target.value),
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
                    <Input
                        min={1}
                        max={100}
                        type={"number"}
                        value={options.height}
                        onChange={handleOnHeightChange}
                    />
                </InputGroup>
            )}
            {isHorizontal && (
                <InputGroup borderColor={"gray.400"} size={size}>
                    <InputLeftAddon width={"60px"}>Width</InputLeftAddon>
                    <Input
                        min={1}
                        max={100}
                        type={"number"}
                        value={options.width}
                        onChange={handleOnWidthChange}
                    />
                </InputGroup>
            )}
            {isBrickGrid && (
                <InputGroup borderColor={"gray.400"} size={size}>
                    <InputLeftAddon width={"60px"}>Drop</InputLeftAddon>
                    <Input
                        min={1}
                        max={100}
                        type={"number"}
                        value={options.drop}
                        onChange={handleOnDropChange}
                    />
                </InputGroup>
            )}
            {isBrickGrid && (
                <InputGroup borderColor={"gray.400"} size={size}>
                    <InputLeftAddon width={"60px"}>Fringe</InputLeftAddon>
                    <Input
                        min={0}
                        max={100}
                        type={"number"}
                        value={options.fringe}
                        onChange={handleOnFringeChange}
                    />
                </InputGroup>
            )}
        </Flex>
    );
};
