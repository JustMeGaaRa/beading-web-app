import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    StackDivider,
    Text,
    VStack,
} from "@chakra-ui/react";
import { usePatternStore, patternSelector } from "@beadee/pattern-editor";
import { PaintingPaletteIcon, PlusIcon, SettingsIcon } from "@beadee/icons";
import { FC, useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ColorPalette, useColorPalette, Shortcuts } from "../components";
import { BeadeePatternOptionsContainer } from "./BeadeePatternOptionsContainer";
import { BeadeeGridOptionsContainer } from "./BeadeeGridOptionsContainer";

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
        dispatch({ type: "PATTERN_ADD_GRID" });
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
                                <BeadeePatternOptionsContainer />
                                {pattern.grids.map((grid) => (
                                    <BeadeeGridOptionsContainer
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
