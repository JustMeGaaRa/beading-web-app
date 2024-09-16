import {
    Button,
    Divider,
    Flex,
    Icon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
} from "@chakra-ui/react";
import capitalize from "just-capitalize";
import { FC, useCallback, useEffect, useState } from "react";
import {
    BeadingGridOptionsPanel,
    BeadingGridState,
    BeadingGridType,
    BeadingGridTypes,
    BeadingLayoutOptionsPanel,
    BrickIcon,
    createGrid,
    createPattern,
    LoomIcon,
    PatternLayoutOptions,
    PeyoteIcon,
    usePatternCollection
} from "../components";

const GridTypeIcons: Record<BeadingGridType, any> = {
    square: LoomIcon,
    peyote: PeyoteIcon,
    brick: BrickIcon,
};

export const CreatePatternModal: FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({
    isOpen,
    onClose
}) => {
    const [pattern, setPattern] = useState(createPattern("brick"));
    const { addPattern } = usePatternCollection();

    useEffect(() => {
        setPattern(createPattern("brick"));
    }, []);

    const handleOnPatternTypeSelected = useCallback((type: BeadingGridType) => {
        setPattern(state => ({
            ...state,
            options: {
                ...state.options,
                layout: {
                    ...state.options.layout,
                    type: type
                }
            },
            grids: [createGrid(0, { ...state.grids[0].options, type } as any, state.options)]
        }));
    }, []);

    const handleOnPatternChange = useCallback((layout: PatternLayoutOptions) => {
        setPattern((state) => ({ ...state, layout }));
    }, []);

    const handleOnGridChange = useCallback((grid: Omit<BeadingGridState, "rows">) => {
        setPattern((state) => ({
            ...state,
            grids: state.grids.map((currentGrid) => (
                currentGrid.name === grid.name
                    ? { ...currentGrid, options: grid.options }
                    : currentGrid
            )),
        }))
    }, []);

    const handleOnCreateClick = useCallback(() => {
        addPattern(pattern);
        onClose();
    }, [pattern, onClose]);

    return (
        <Modal isCentered isOpen={isOpen} size={"sm"} onClose={onClose}>
            <ModalOverlay />
            <ModalContent padding={2}>
                <ModalCloseButton />
                <ModalHeader fontSize={"x-large"} fontWeight={600}>
                    Create pattern
                </ModalHeader>
                <ModalBody>
                    <VStack gap={2} width={"100%"}>
                        <Flex mb={2} justifyContent={"space-between"} w={"100%"}>
                            {BeadingGridTypes.map((type, index) => (
                                <Flex
                                    key={type}
                                    aria-selected={pattern.grids[0].options.type === type}
                                    alignItems={"center"}
                                    borderColor={"gray.400"}
                                    borderRadius={8}
                                    borderWidth={1}
                                    color={"gray.800"}
                                    cursor={"pointer"}
                                    flexDirection={"column"}
                                    justifyContent={"center"}
                                    padding={2}
                                    width={"30%"}
                                    _selected={{
                                        backgroundColor: "gray.900",
                                        color: "gray.50",
                                    }}
                                    _hover={{
                                        backgroundColor: "gray.700",
                                        color: "gray.50",
                                    }}
                                    onClick={() => handleOnPatternTypeSelected(type)}
                                >
                                    <Icon as={GridTypeIcons[type]} boxSize={8} />
                                    <Text fontSize={"xs"}>{capitalize(type)}</Text>
                                </Flex>
                            ))}
                        </Flex>
                        <BeadingLayoutOptionsPanel
                            mode={"initialization"}
                            size={"sm"}
                            layout={pattern.options.layout}
                            onChange={handleOnPatternChange}
                        />
                        <Divider borderColor={"gray.200"} my={2} />
                        <BeadingGridOptionsPanel
                            name={pattern.grids[0]?.name}
                            options={pattern.grids[0]?.options}
                            orientation={pattern.options.layout.orientation}
                            size={"sm"}
                            onChange={handleOnGridChange}
                        />
                        <Text color={"gray.700"} fontSize={"small"} mt={4}>
                            {`Finished size: ${
                                    pattern.options.layout.width * pattern.options.layout.beadSize.width
                                } x ${
                                    pattern.options.layout.height * pattern.options.layout.beadSize.height
                            } cm`}
                        </Text>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Flex flexDirection={"column"} width={"100%"}>
                        <Button
                            width={"100%"}
                            backgroundColor={"gray.900"}
                            color={"gray.50"}
                            _hover={{ backgroundColor: "gray.700" }}
                            _active={{ backgroundColor: "gray.600" }}
                            onClick={handleOnCreateClick}
                        >
                            Create
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
