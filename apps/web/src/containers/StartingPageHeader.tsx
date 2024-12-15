import {
    Button,
    ButtonGroup,
    Flex,
    Input,
    Text,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import { Plus, Upload } from "iconoir-react";
import { FC, useCallback, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { v6 } from "uuid";
import {
    addPattern,
    Header,
    Shortcuts,
    ShortcutTableModal,
    usePatternCollectionStore,
    validatePattern
} from "../components";
import { CreatePatternModal } from "./CreatePatternModal";

const hotkeysOptions = { preventDefault: true };
const hotkeysKeyOptions = { preventDefault: true, keydown: true, keyup: true };

export const StartingPageHeader: FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();
    const { isOpen: isHelpOpen, onOpen: onHelpOpen, onClose: onHelpClose } = useDisclosure();
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
    const { dispatch } = usePatternCollectionStore();

    const onPeekShortcuts = useCallback((keyboardEvent: KeyboardEvent) => {
        if (keyboardEvent.type === "keydown") {
            onHelpOpen();
        }
        if (keyboardEvent.type === "keyup") {
            onHelpClose();
        }
    }, [onHelpOpen, onHelpClose]);

    useHotkeys(Shortcuts.help.keyString, onPeekShortcuts, hotkeysKeyOptions, []);
    useHotkeys(Shortcuts.patternCreate.keyString, () => onModalOpen(), hotkeysOptions, []);
    useHotkeys(Shortcuts.patternOpen.keyString, () => fileInputRef.current?.click(), hotkeysOptions, [fileInputRef.current]);

    const handleFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const fileContent = event.target?.result as string;
                const patternJson = JSON.parse(fileContent);

                if (validatePattern(patternJson)) {
                    dispatch(addPattern({
                        ...patternJson,
                        patternId: `pattern-${v6()}`
                    }));
                    toast({
                        title: "Pattern import successful",
                        description: "The pattern has been successfully imported",
                        status: "success",
                        duration: 10000,
                        position: "bottom-right",
                        variant: "subtle",
                        isClosable: true
                    });
                } else {
                    toast({
                        title: "Pattern import failed",
                        description: "The file does not have a valid JSON structure",
                        status: "error",
                        duration: 10000,
                        position: "bottom-right",
                        variant: "subtle",
                        isClosable: true
                    });
                }
            }
            catch (error) {
                console.error(error);
                toast({
                    title: "Pattern import failed",
                    description: "The file does not have a valid JSON structure",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
        };

        reader.readAsText(file);
    }, [dispatch, toast]);

    const handleOnOpenFileClick = useCallback(() => {
        fileInputRef.current?.click();
    }, [fileInputRef.current]);

    const handleOnCreatePatternClick = useCallback(() => {
        onModalOpen();
    }, [onModalOpen]);

    return (
        <Header>
            <Flex alignItems={"center"} cursor={"pointer"} ml={3} gap={2}>
                <Text fontWeight={600}>Beadee</Text>
                <Input
                    accept={".json"}
                    display={"none"}
                    type={"file"}
                    ref={fileInputRef}
                    onChange={handleFileImport}
                />
            </Flex>
            <ButtonGroup id={"header-actions-group"} mr={3} size={"sm"} variant={"outline"}>
                <Button
                    aria-label={"import"}
                    rightIcon={<Upload />}
                    title={"import"}
                    onClick={handleOnOpenFileClick}
                >
                    Open file
                </Button>
                <Button
                    aria-label={"create pattern"}
                    rightIcon={<Plus />}
                    variant={"solid"}
                    title={"create pattern"}
                    backgroundColor={"gray.900"}
                    color={"white"}
                    _hover={{ backgroundColor: "gray.700" }}
                    _active={{ backgroundColor: "gray.600" }}
                    onClick={handleOnCreatePatternClick}
                >
                    Create pattern
                </Button>
            </ButtonGroup>

            <CreatePatternModal isOpen={isModalOpen} onClose={onModalClose} />
            <ShortcutTableModal scope={"page.starting"} isOpen={isHelpOpen} onClose={onHelpClose} />
        </Header>
    );
};