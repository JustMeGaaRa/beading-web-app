import { Button, ButtonGroup, Flex, Text } from "@chakra-ui/react";
import {
    BeadingGridProperties,
    BeadingGrid,
    BeadingGridType,
} from "@beadee/grid-editor";
import { patternSelector, usePatternStore } from "@beadee/pattern-editor";
import { CloseIcon, LoomIcon, PeyoteIcon } from "@beadee/icons";
import { FC, useCallback } from "react";
import { BeadingGridOptionsPanel } from "../components";

export const BeadingGridOptionsContainer: FC<{ grid: BeadingGrid }> = ({
    grid,
}) => {
    const { pattern, dispatch } = usePatternStore(patternSelector);

    const handleOnDeleteGridClick = useCallback(() => {
        dispatch({
            type: "PATTERN_DELETE_GRID",
            gridId: grid.gridId,
        });
    }, [dispatch, grid.gridId]);

    const handleOnTypeClick = useCallback(
        (type: BeadingGridType) => {
            dispatch({
                type: "BEADING_GRID_APPLY_OPTIONS",
                gridId: grid.gridId,
                options: {
                    ...grid.options,
                    type,
                } as BeadingGridProperties,
            });
        },
        [dispatch, grid.gridId, grid.options]
    );

    const handleOnOptionsChange = useCallback(
        (modifiedOptions: BeadingGridProperties) => {
            dispatch({
                type: "BEADING_GRID_APPLY_OPTIONS",
                gridId: grid.gridId,
                options: modifiedOptions,
            });
        },
        [dispatch, grid.gridId]
    );

    const isBrickLayout = pattern.options.type === "brick";

    return (
        <Flex flexDirection={"column"} gap={2} w={"100%"}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Text fontSize={"xs"} fontWeight={"600"}>
                    {grid.name}
                </Text>
                {pattern.grids.length > 0 && (
                    <Button
                        rightIcon={<CloseIcon size={16} stroke={"2"} />}
                        size={"xs"}
                        variant={"ghost"}
                        onClick={handleOnDeleteGridClick}
                    >
                        Delete
                    </Button>
                )}
            </Flex>
            {!isBrickLayout && (
                <ButtonGroup isAttached size={"xs"} variant={"outline"}>
                    <Button
                        aria-selected={grid.options.type === "square"}
                        borderColor={"gray.400"}
                        leftIcon={<LoomIcon size={16} />}
                        width={"50%"}
                        _selected={{
                            backgroundColor: "gray.900",
                            color: "gray.50",
                        }}
                        _hover={{
                            backgroundColor: "gray.700",
                            color: "gray.50",
                        }}
                        onClick={() => handleOnTypeClick("square")}
                    >
                        Square
                    </Button>
                    <Button
                        aria-selected={grid.options.type === "peyote"}
                        borderColor={"gray.400"}
                        leftIcon={<PeyoteIcon size={16} />}
                        width={"50%"}
                        _selected={{
                            backgroundColor: "gray.900",
                            color: "gray.50",
                        }}
                        _hover={{
                            backgroundColor: "gray.700",
                            color: "gray.50",
                        }}
                        onClick={() => handleOnTypeClick("peyote")}
                    >
                        Peyote
                    </Button>
                </ButtonGroup>
            )}
            <BeadingGridOptionsPanel
                name={grid.name}
                options={grid.options}
                orientation={pattern.options.orientation}
                onChange={handleOnOptionsChange}
            />
        </Flex>
    );
};
