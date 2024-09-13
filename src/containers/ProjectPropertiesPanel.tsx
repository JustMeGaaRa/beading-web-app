import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Icon,
    StackDivider,
    Text,
    VStack,
} from "@chakra-ui/react";
import { Palette, Plus, Settings } from "iconoir-react";
import { FC, useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
    BeadingGridOptionsPanel,
    BeadingGridState,
    PatternLayoutOptions,
    BeadingLayoutOptionsPanel,
    ColorPalette,
    usePattern,
    useColorPalette,
    Shortcuts,
} from "../components";

type BeadingGridConfiguration = Omit<BeadingGridState, "rows">;

export const ProjectPropertiesPanel: FC = () => {
    const {
        pattern,
        addGrid,
        deleteGrid,
        applyPatternOptions,
        applyGridOptions
    } = usePattern();
    const { setSelectedColor } = useColorPalette();
    const [colorPaletteIndex, setColorPaletteIndex] = useState<number | number[]>(0);
    const [gridOptionsIndex, setGridOptionsIndex] = useState<number | number[]>(0);

    const togglePanels = useCallback(() => {
        setColorPaletteIndex((prev) => (prev === 0 ? 1 : 0));
        setGridOptionsIndex((prev) => (prev === 0 ? 1 : 0));
    }, [setColorPaletteIndex, setGridOptionsIndex]);

    useHotkeys(Shortcuts.panelToggleAll.keyString, () => togglePanels(), { preventDefault: true }, [togglePanels]);

    const handleOnAddGridClick = useCallback(() => {
        addGrid();
    }, [addGrid]);

    const handleOnDeleteGridClick = useCallback((grid: BeadingGridConfiguration) => {
        deleteGrid(grid.name);
    }, [deleteGrid]);

    const handleOnLayoutChange = useCallback((layout: PatternLayoutOptions) => {
        applyPatternOptions({ layout });
    }, [applyPatternOptions]);

    const handleOnOptionsChange = useCallback((modifiedGrid: BeadingGridConfiguration) => {
        applyGridOptions(modifiedGrid.name, modifiedGrid.options);
    }, [applyGridOptions]);

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
                            <Icon as={Palette} mr={1} />
                            <Text as={"b"} flex={1} fontSize={"sm"} textAlign={"left"}>
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
                    onChange={setGridOptionsIndex}
                >
                    <AccordionItem>
                        <AccordionButton>
                            <Icon as={Settings} mr={1} />
                            <Text as={"b"} flex={1} fontSize={"sm"} textAlign={"left"}>
                                Settings
                            </Text>
                        <AccordionIcon />
                    </AccordionButton>
                        <AccordionPanel maxHeight={"40vh"} overflowY={"scroll"}>
                            <VStack
                                alignItems={"start"}
                                divider={<StackDivider borderColor="gray.200" />}
                                spacing={4}
                            >
                                <BeadingLayoutOptionsPanel
                                    layout={pattern.options.layout}
                                    onChange={handleOnLayoutChange}
                                />
                                {pattern.grids.map((grid) => (
                                    <BeadingGridOptionsPanel
                                        key={grid.name}
                                        canDelete={pattern.grids.length > 1}
                                        isHorizontal={pattern.options.layout.orientation === "horizontal"}
                                        name={grid.name}
                                        options={grid.options}
                                        onChange={handleOnOptionsChange}
                                        onDelete={handleOnDeleteGridClick}
                                    />
                                ))}
                                <Button
                                    leftIcon={<Plus />}
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
