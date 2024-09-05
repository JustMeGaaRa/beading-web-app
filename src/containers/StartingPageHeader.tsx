import { Box, Button, ButtonGroup, Flex, Image, Text } from "@chakra-ui/react";
import { Plus, Upload } from "iconoir-react";
import { FC, useCallback } from "react";
import { createDefaultPattern, Header, usePatternCollection } from "../components";

export const StartingPageHeader: FC = () => {
    const { addPattern } = usePatternCollection();
    
    const handleOnOpenFileClick = useCallback(() => {

    }, [addPattern]);
    
    const handleOnCreatePatternClick = useCallback(() => {
        addPattern(createDefaultPattern());
    }, [addPattern]);
    
    return (
        <Header>
            <Flex alignItems={"center"} cursor={"pointer"} ml={6} gap={2}>
                {/* <Image boxSize={"24px"} src={"logo-32.svg"} /> */}
                <Text fontWeight={600}>Beadee</Text>
            </Flex>
            <ButtonGroup id={"header-actions-group"} size={"sm"} variant={"outline"}>
                <Button
                    aria-label={"summary"}
                    isDisabled
                    rightIcon={<Upload />}
                    title={"summary"}
                    onClick={handleOnOpenFileClick}
                >
                    Open file
                </Button>
                <Button
                    aria-label={"summary"}
                    rightIcon={<Plus />}
                    variant={"solid"}
                    title={"summary"}
                    onClick={handleOnCreatePatternClick}
                >
                    Create pattern
                </Button>
            </ButtonGroup>
        </Header>
    );
};
