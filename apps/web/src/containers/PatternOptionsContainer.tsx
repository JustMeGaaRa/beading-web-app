import { Flex, HStack, Text } from "@chakra-ui/react";
import { PatternOptions, usePatternStore } from "@repo/bead-pattern-editor";
import { FC, useCallback } from "react";
import { PatternOptionsPanel } from "../components";
import { InfoCircleIcon } from "@repo/icons";

export const PatternOptionsContainer: FC = () => {
    const pattern = usePatternStore((state) => state.pattern);
    const dispatch = usePatternStore((state) => state.dispatch);

    const handleOnLayoutChange = useCallback(
        (options: PatternOptions) => {
            dispatch({
                type: "PATTERN_APPLY_OPTIONS",
                options,
            });
        },
        [dispatch]
    );

    return (
        <Flex flexDirection={"column"} gap={2} w={"100%"}>
            <Text fontSize={"xs"} fontWeight={"600"}>
                Layout
            </Text>
            <PatternOptionsPanel
                options={pattern.options}
                size={"xs"}
                onChange={handleOnLayoutChange}
            />
            <HStack alignItems={"center"} gap={1}>
                <InfoCircleIcon size={16} />
                <Text
                    fontSize={"xs"}
                    fontWeight={"400"}
                    justifyContent={"center"}
                >
                    Small tips to grids
                </Text>
            </HStack>
        </Flex>
    );
};
