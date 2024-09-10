import {
    Button,
    ButtonGroup,
    Flex,
    Input,
    InputGroup,
    InputLeftAddon,
    Text,
} from "@chakra-ui/react";
import { Xmark } from "iconoir-react";
import { ChangeEvent, FC, useCallback } from "react";
import {
    BeadingGridProperties,
    BeadingGridState,
    BeadingGridType,
    BeadingGridTypes,
} from "./pattern";

export const BeadingGridOptionsPanel: FC<{
    canDelete?: boolean;
    isHorizontal?: boolean;
    name: string;
    options: BeadingGridProperties;
    onChange?: (grid: Omit<BeadingGridState, "rows">) => void;
    onDelete?: (grid: Omit<BeadingGridState, "rows">) => void;
}> = ({
    canDelete,
    isHorizontal,
    name,
    options,
    onChange,
    onDelete
}) => {
    const handleOnDeleteClick = useCallback(() => {
        onDelete?.({ name, options });
    }, [onDelete, name, options]);

    const handleOnTypeClick = useCallback((type: BeadingGridType) => {
        onChange?.({
            name: name,
            options: {
                ...options,
                type: type,
            } as any,
        });
    }, [onChange, name, options]);

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

    return (
        <Flex flexDirection={"column"} gap={2} w={"100%"}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Text as={"b"} fontSize={"xs"}>
                {name}
            </Text>
            {canDelete && (
                <Button
                    rightIcon={<Xmark />}
                    size={"xs"}
                    variant={"ghost"}
                    onClick={handleOnDeleteClick}
                >
                    Delete
                </Button>
            )}
            </Flex>
            <ButtonGroup isAttached size={"xs"} variant={"outline"}>
                {BeadingGridTypes.map((type) => (
                    <Button
                        key={type}
                        isActive={options.type === type}
                        width={"34%"}
                        onClick={() => handleOnTypeClick(type)}
                    >
                        {type}
                    </Button>
                ))}
            </ButtonGroup>
            {!isHorizontal && (
                <InputGroup size={"xs"}>
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
                <InputGroup size={"xs"}>
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
            {options.type === "brick" && (
                <InputGroup size={"xs"}>
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
            {options.type === "brick" && (
                <InputGroup size={"xs"}>
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
