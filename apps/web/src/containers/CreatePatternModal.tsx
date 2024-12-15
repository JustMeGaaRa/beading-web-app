import {
    Button,
    ButtonGroup,
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
import { useNavigate } from "react-router";
import {
    BeadingGridOptionsPanel,
    BeadingGridState,
    BeadingGridType,
    BEADING_GRID_TYPES,
    BeadingLayoutOptionsPanel,
    BrickIcon,
    createGrid,
    addPattern,
    formatPatternSize,
    getPatternRealSize,
    LoomIcon,
    PatternLayoutOptions,
    PatternState,
    PeyoteIcon,
    createPattern,
    deletePattern,
    usePatternCollectionStore
} from "../components";

const GridTypeIcons: Record<BeadingGridType, typeof LoomIcon> = {
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
        const navigate = useNavigate();
        const [pattern, setPattern] = useState(createPattern("brick"));
        const { dispatch } = usePatternCollectionStore();

        useEffect(() => {
            setPattern(createPattern("brick"));
        }, []);

        const handleOnPatternTypeSelected = useCallback((type: BeadingGridType) => {
            setPattern(state => {
                const modifiedGridOptions = {
                    ...state.grids[0].options,
                    type
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
                const modifiedPatternOptions = {
                    ...state.options,
                    layout: { ...state.options.layout, type: type }
                };
                return {
                    ...state,
                    options: modifiedPatternOptions,
                    grids: [createGrid(0, modifiedGridOptions, modifiedPatternOptions)]
                };
            });
        }, []);

        const handleOnPatternChange = useCallback((layout: PatternLayoutOptions) => {
            setPattern((state) => {
                const modifiedPatternOptions = { ...state.options, layout };
                return {
                    ...state,
                    options: modifiedPatternOptions,
                    grids: [createGrid(0, state.grids[0].options, modifiedPatternOptions)]
                };
            });
        }, []);

        const handleOnGridChange = useCallback((grid: Omit<BeadingGridState, "rows">) => {
            setPattern((state) => ({
                ...state,
                grids: [createGrid(0, grid.options, state.options)],
            }))
        }, []);

        const handleOnCreateClick = useCallback(() => {
            dispatch(addPattern(pattern));
            onClose();
            navigate(`/patterns/${pattern.patternId}`);
        }, [dispatch, pattern, onClose, navigate]);

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
                                {BEADING_GRID_TYPES.map((type) => (
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
                            <BeadingGridOptionsPanel
                                name={pattern.grids[0]?.name}
                                options={pattern.grids[0]?.options}
                                orientation={pattern.options.layout.orientation}
                                size={"sm"}
                                onChange={handleOnGridChange}
                            />
                            <Text color={"gray.700"} fontSize={"small"} mt={4}>
                                {`Finished size: ${formatPatternSize(getPatternRealSize(pattern))}`}
                            </Text>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup width={"100%"}>
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
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        );
    };

export const DeletePatternModal: FC<{
    pattern: PatternState | null;
    isOpen: boolean;
    onClose: () => void;
}> = ({
    pattern,
    isOpen,
    onClose,
}) => {
        const { dispatch } = usePatternCollectionStore();

        const handleOnPatterDeleteConfirm = useCallback(() => {
            if (pattern) {
                dispatch(deletePattern(pattern.patternId));
            }
            onClose();
        }, [pattern, dispatch, onClose]);

        return (
            <Modal isCentered isOpen={isOpen} size={"sm"} onClose={onClose}>
                <ModalOverlay />
                <ModalContent padding={2}>
                    <ModalHeader fontSize={"x-large"} fontWeight={600}>
                        Delete pattern
                    </ModalHeader>
                    <ModalBody>
                        <Text color={"gray.700"} fontSize={"small"}>
                            Are you sure you want to delete <Text as={"span"} fontWeight={600}>{pattern?.name}</Text>?
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup width={"100%"}>
                            <Button
                                width={"50%"}
                                backgroundColor={"gray.900"}
                                color={"gray.50"}
                                _active={{
                                    backgroundColor: "gray.600",
                                    color: "gray.50",
                                }}
                                _hover={{
                                    backgroundColor: "gray.700",
                                    color: "gray.50",
                                }}
                                onClick={handleOnPatterDeleteConfirm}
                            >
                                Delete
                            </Button>
                            <Button
                                width={"50%"}
                                color={"gray.800"}
                                _active={{
                                    backgroundColor: "gray.600",
                                    color: "gray.50",
                                }}
                                _hover={{
                                    backgroundColor: "gray.700",
                                    color: "gray.50",
                                }}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        );
    };
