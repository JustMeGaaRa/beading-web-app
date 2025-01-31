import { Flex, HStack, Text } from "@chakra-ui/react";
import { PatternOptions, usePatternStore } from "@beadee/pattern-editor";
import { FC, useCallback } from "react";
import { BeadeePatternOptionsPanel } from "../components";
import { InfoCircleIcon } from "@beadee/icons";
import { useBeadeeGridStyles } from "@beadee/grid-editor";

export const BeadeePatternOptionsContainer: FC = () => {
    const pattern = usePatternStore((state) => state.pattern);
    const dispatch = usePatternStore((state) => state.dispatch);
    const { setStyles } = useBeadeeGridStyles();

    const handleOnLayoutChange = useCallback(
        (options: PatternOptions) => {
            setStyles((styles) => ({
                ...styles,
                bead: options.beadSize,
            }));
            dispatch({
                type: "PATTERN_APPLY_OPTIONS",
                options,
            });
        },
        [dispatch, setStyles]
    );

    return (
        <Flex flexDirection={"column"} gap={2} w={"100%"}>
            <Text fontSize={"xs"} fontWeight={"600"}>
                Layout
            </Text>
            <BeadeePatternOptionsPanel
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
