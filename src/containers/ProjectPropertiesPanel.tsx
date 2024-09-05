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
import { FC, useCallback } from "react";
import {
    BeadingGridOptionsPanel,
    BeadingGridState,
    PatternLayoutOptions,
    BeadingLayoutOptionsPanel,
    ColorPalette,
    usePattern,
} from "../components";

type BeadingGridConfiguration = Omit<BeadingGridState, "rows">;

export const ProjectPropertiesPanel: FC = () => {
    const {
        grids,
        options,
        addGrid,
        deleteGrid,
        applyPatternOptions,
        applyGridOptions
    } = usePattern();

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
            padding={1}
            position={"absolute"}
            right={0}
            top={0}
            zIndex={1}
        >
            <Box borderRadius={"md"} height={"100%"} width={220}>
                <Accordion
                    allowToggle
                    backgroundColor={"white"}
                    borderRadius={8}
                    defaultIndex={[0]}
                    mt={2}
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
                            <ColorPalette />
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                <Accordion
                    allowToggle
                    backgroundColor={"white"}
                    borderRadius={8}
                    defaultIndex={[0]}
                    mt={2}
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
                                    layout={options.layout}
                                    onChange={handleOnLayoutChange}
                                />
                                {grids.map((grid) => (
                                    <BeadingGridOptionsPanel
                                        key={grid.name}
                                        canDelete={grids.length > 1}
                                        isHorizontal={options.layout.orientation === "horizontal"}
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
