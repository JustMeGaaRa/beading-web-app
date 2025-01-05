import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    Icon,
    StackDivider,
    Text,
    VStack,
} from "@chakra-ui/react";
import {
    BeadingGridProperties,
    BeadingGridState,
    BeadingGridType,
} from "@repo/bead-grid";
import {
    PatternLayoutOptions,
    usePatternStore,
    patternSelector,
    addBeadingGridAction,
    applyPatternOptionsAction,
    deleteBeadingGridAction,
} from "@repo/bead-pattern-editor";
import {
    LoomIcon,
    PeyoteIcon,
    CloseIcon,
    InfoCircleIcon,
    PaintingPaletteIcon,
    PlusIcon,
    SettingsIcon,
} from "@repo/icons";
import { FC, useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
    BeadingGridOptionsPanel,
    PatternLayoutOptionsPanel,
    ColorPalette,
    useColorPalette,
    Shortcuts,
} from "../components";

const hotkeysOptions = { preventDefault: true };

export const ProjectSettingsContainer: FC = () => {
    const [colorPaletteIndex, setColorPaletteIndex] = useState<
        number | number[]
    >(0);
    const [gridOptionsIndex, setGridOptionsIndex] = useState<number | number[]>(
        0
    );

    const { setSelectedColor } = useColorPalette();
    const { pattern, dispatch } = usePatternStore(patternSelector);

    const togglePanels = useCallback(() => {
        setColorPaletteIndex((state) => (state === 0 ? 1 : 0));
        setGridOptionsIndex((state) => (state === 0 ? 1 : 0));
    }, [setColorPaletteIndex, setGridOptionsIndex]);

    useHotkeys(
        Shortcuts.panelToggleAll.keyString,
        () => togglePanels(),
        hotkeysOptions,
        [togglePanels]
    );

    const handleOnAddGridClick = useCallback(() => {
        dispatch(addBeadingGridAction());
    }, [dispatch]);

    return (
        <Box
            alignItems={"start"}
            height={"100%"}
            padding={3}
            position={"absolute"}
            pointerEvents={"none"}
            right={0}
            top={0}
            zIndex={1}
        >
            <Box pointerEvents={"auto"} width={220}>
                <Accordion
                    allowToggle
                    backgroundColor={"white"}
                    borderRadius={8}
                    index={colorPaletteIndex}
                    mt={2}
                    onChange={setColorPaletteIndex}
                >
                    <AccordionItem>
                        <AccordionButton>
                            <PaintingPaletteIcon size={16} />
                            <Text
                                as={"b"}
                                ml={1}
                                flex={1}
                                fontSize={"sm"}
                                textAlign={"left"}
                            >
                                Colors
                            </Text>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel maxHeight={"40vh"} overflowY={"scroll"}>
                            <ColorPalette onSelect={setSelectedColor} />
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                <Accordion
                    allowToggle
                    backgroundColor={"white"}
                    borderRadius={8}
                    index={gridOptionsIndex}
                    mt={2}
                    visibility={"hidden"}
                    onChange={setGridOptionsIndex}
                >
                    <AccordionItem>
                        <AccordionButton>
                            <SettingsIcon size={16} />
                            <Text
                                as={"b"}
                                ml={1}
                                flex={1}
                                fontSize={"sm"}
                                textAlign={"left"}
                            >
                                Settings
                            </Text>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel maxHeight={"40vh"} overflowY={"scroll"}>
                            <VStack
                                alignItems={"start"}
                                divider={
                                    <StackDivider borderColor="gray.200" />
                                }
                                spacing={4}
                            >
                                <PatternOptionsContainer />
                                {pattern.grids.map((grid) => (
                                    <BeadingGridOptionContainer
                                        key={grid.name}
                                        grid={grid}
                                    />
                                ))}
                                <Button
                                    leftIcon={<PlusIcon />}
                                    borderColor={"gray.800"}
                                    color={"gray.800"}
                                    size={"xs"}
                                    variant={"outline"}
                                    onClick={handleOnAddGridClick}
                                >
                                    Add grid
                                </Button>
                            </VStack>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Box>
        </Box>
    );
};

const PatternOptionsContainer: FC = () => {
    const pattern = usePatternStore((state) => state.pattern);
    const dispatch = usePatternStore((state) => state.dispatch);

    const handleOnLayoutChange = useCallback(
        (layout: PatternLayoutOptions) => {
            dispatch(applyPatternOptionsAction({ layout }));
        },
        [dispatch]
    );

    return (
        <Flex flexDirection={"column"} gap={2} w={"100%"}>
            <Text fontSize={"xs"} fontWeight={"600"}>
                Layout
            </Text>
            <PatternLayoutOptionsPanel
                layout={pattern.options.layout}
                size={"xs"}
                onChange={handleOnLayoutChange}
            />
            <HStack alignItems={"center"} gap={1}>
                <Icon as={InfoCircleIcon} boxSize={4} />
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

const BeadingGridOptionContainer: FC<{ grid: BeadingGridState }> = ({
    grid,
}) => {
    const { pattern, dispatch } = usePatternStore(patternSelector);

    const handleOnDeleteGridClick = useCallback(() => {
        dispatch(deleteBeadingGridAction(grid.name));
    }, [dispatch, grid?.name]);

    const handleOnTypeClick = useCallback(
        (type: BeadingGridType) => {
            dispatch({
                type: "BEADING_GRID_APPLY_OPTIONS",
                payload: {
                    options: {
                        ...grid.options,
                        type,
                    } as BeadingGridProperties,
                },
            });
        },
        [dispatch, grid.options]
    );

    const handleOnOptionsChange = useCallback(
        (modifiedOptions: BeadingGridProperties) => {
            dispatch({
                type: "BEADING_GRID_APPLY_OPTIONS",
                payload: { options: modifiedOptions },
            });
        },
        [dispatch]
    );

    const isBrickLayout = pattern.options.layout.type === "brick";

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
                        leftIcon={<Icon as={LoomIcon} boxSize={4} />}
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
                        leftIcon={<Icon as={PeyoteIcon} boxSize={4} />}
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
                orientation={pattern.options.layout.orientation}
                onChange={handleOnOptionsChange}
            />
        </Flex>
    );
};
