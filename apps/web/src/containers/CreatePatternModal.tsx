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
import {
    BeadingGridProperties,
    BeadingGridType,
    capitalize,
    DefaultGridProperties,
    getGridRealSize,
} from "@beadee/grid-editor";
import {
    formatPatternSize,
    Pattern,
    createPattern,
    PatternOptions,
    DefaultPatternOptions,
    mergeOptions,
} from "@beadee/pattern-editor";
import { BrickIcon, LoomIcon, PeyoteIcon } from "@beadee/icons";
import { FC, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    BeadeeGridOptionsPanel,
    BeadeePatternOptionsPanel,
} from "../components";
import { usePatternCollectionStore } from "../store";
import { addPatternAction, deletePatternAction } from "../creators";

const GridTypeIcons: Record<BeadingGridType, typeof LoomIcon> = {
    square: LoomIcon,
    peyote: PeyoteIcon,
    brick: BrickIcon,
};

const BeadingGridTypes: Array<BeadingGridType> = ["square", "peyote", "brick"];

export const CreatePatternModal: FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { dispatch } = usePatternCollectionStore();
    const [patternOptions, setPatternOptions] = useState<PatternOptions>(
        DefaultPatternOptions
    );
    const [gridOptions, setGridOptions] = useState<BeadingGridProperties>(
        DefaultGridProperties
    );

    useEffect(() => {
        // NOTE: reset to default setting when opened
        setPatternOptions(DefaultPatternOptions);
        setGridOptions(
            mergeOptions(DefaultPatternOptions, DefaultGridProperties)
        );
    }, [isOpen]);

    const handleOnPatternTypeSelected = useCallback(
        (type: BeadingGridType) => {
            const modifiedPatternOptions = {
                ...patternOptions,
                type,
            } satisfies PatternOptions;

            setPatternOptions(modifiedPatternOptions);
            setGridOptions((gridOptions) =>
                mergeOptions(modifiedPatternOptions, gridOptions)
            );
        },
        [patternOptions]
    );

    const handleOnPatternOptionsChange = useCallback(
        (modifiedPatternOptions: PatternOptions) => {
            setPatternOptions(modifiedPatternOptions);
            setGridOptions((gridOptions) =>
                mergeOptions(modifiedPatternOptions, gridOptions)
            );
        },
        []
    );

    const handleOnGridOptionsChange = useCallback(
        (options: BeadingGridProperties) => {
            setGridOptions(options);
        },
        []
    );

    const handleOnCreateClick = useCallback(() => {
        const pattern = createPattern(patternOptions, gridOptions);
        dispatch(addPatternAction(pattern));
        onClose();
        navigate(`/patterns/${pattern.patternId}`);
    }, [patternOptions, gridOptions, dispatch, onClose, navigate]);

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
                        <Flex
                            mb={2}
                            justifyContent={"space-between"}
                            w={"100%"}
                        >
                            {BeadingGridTypes.map((type) => (
                                <Flex
                                    key={type}
                                    aria-selected={patternOptions.type === type}
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
                                    onClick={() =>
                                        handleOnPatternTypeSelected(type)
                                    }
                                >
                                    <Icon
                                        as={GridTypeIcons[type]}
                                        boxSize={8}
                                    />
                                    <Text fontSize={"xs"}>
                                        {capitalize(type)}
                                    </Text>
                                </Flex>
                            ))}
                        </Flex>
                        <Text color={"gray.700"} fontSize={"small"}>
                            Common pattern properties
                        </Text>
                        <BeadeePatternOptionsPanel
                            size={"sm"}
                            options={patternOptions}
                            onChange={handleOnPatternOptionsChange}
                        />
                        <Text color={"gray.700"} fontSize={"small"}>
                            Initial grid properties
                        </Text>
                        <BeadeeGridOptionsPanel
                            name={"Initial Grid"}
                            options={gridOptions}
                            orientation={patternOptions.orientation}
                            size={"sm"}
                            onChange={handleOnGridOptionsChange}
                        />
                        <Text color={"gray.700"} fontSize={"small"} mt={4}>
                            {`Finished size: ${formatPatternSize(getGridRealSize(gridOptions, patternOptions.beadSize))}`}
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
    pattern: Pattern | null;
    isOpen: boolean;
    onClose: () => void;
}> = ({ pattern, isOpen, onClose }) => {
    const { dispatch } = usePatternCollectionStore();

    const handleOnPatterDeleteConfirm = useCallback(() => {
        if (pattern) {
            dispatch(deletePatternAction(pattern.patternId));
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
                        Are you sure you want to delete{" "}
                        <Text as={"span"} fontWeight={600}>
                            {pattern?.name}
                        </Text>
                        ?
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
