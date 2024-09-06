import { Button, ButtonGroup, Flex, Input, Text, useToast } from "@chakra-ui/react";
import { Plus, Upload } from "iconoir-react";
import { FC, useCallback, useRef } from "react";
import { v6 } from "uuid";
import { createDefaultPattern, Header, usePatternCollection, validatePattern } from "../components";

export const StartingPageHeader: FC = () => {
    const { addPattern } = usePatternCollection();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

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
        addPattern(createDefaultPattern());
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
                    onClick={handleOnCreatePatternClick}
                >
                    Create pattern
                </Button>
            </ButtonGroup>
        </Header>
    );
};
