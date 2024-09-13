import { Button, ButtonGroup, Flex, Input, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { Plus, Upload } from "iconoir-react";
import { FC, useCallback, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { v6 } from "uuid";
import { createPattern, Header, Shortcuts, ShortcutTableModal, usePatternCollection, validatePattern } from "../components";

export const StartingPageHeader: FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();
    const { addPattern } = usePatternCollection();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const peekShortcuts = useCallback((keyboardEvent: KeyboardEvent, hotkeysEvent: any) => {
        if (keyboardEvent.type === "keydown") {
            onOpen();
        }
        if (keyboardEvent.type === "keyup") {
            onClose();
        }
    }, [onOpen, onClose]);

    useHotkeys(Shortcuts.help.keyString, peekShortcuts, { preventDefault: true, keydown: true, keyup: true }, []);
    useHotkeys(Shortcuts.patternCreate.keyString, () => addPattern(createPattern()), { preventDefault: true }, [addPattern]);
    useHotkeys(Shortcuts.patternOpen.keyString, () => fileInputRef.current?.click(), { preventDefault: true }, [fileInputRef.current]);

    const handleFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const fileContent = event.target?.result as string;
                const patternJson = JSON.parse(fileContent);

                if (validatePattern(patternJson)) {
                    addPattern({
                        ...patternJson,
                        patternId: `pattern-${v6()}`
                    });
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
    }, [addPattern]);
    
    const handleOnOpenFileClick = useCallback(() => {
        fileInputRef.current?.click();
    }, [addPattern, fileInputRef.current]);
    
    const handleOnCreatePatternClick = useCallback(() => {
        addPattern(createPattern());
    }, [addPattern]);
    
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
            
            <ShortcutTableModal
                scope={"page.starting"}
                isOpen={isOpen}
                onClose={onClose}
            />
        </Header>
    );
};
