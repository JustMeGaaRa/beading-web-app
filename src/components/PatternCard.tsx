import {
    AspectRatio,
    Box,
    Card,
    CardBody,
    CardFooter,
    Flex,
    Icon,
    IconButton,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text
} from "@chakra-ui/react"
import { MoreHoriz } from "iconoir-react";
import { FC, useCallback } from "react";
import { PatternState } from "./pattern/types";

export type PatternEventHandler<TEvent> = (source: PatternState, event: TEvent) => void;

export const PatternCard: FC<{
    pattern: PatternState;
    onClick?: PatternEventHandler<React.MouseEvent<HTMLDivElement>>;
    onSave?: PatternEventHandler<React.MouseEvent<HTMLButtonElement>>;
    onDelete?: PatternEventHandler<React.MouseEvent<HTMLButtonElement>>;
}> = ({
    pattern,
    onClick,
    onSave,
    onDelete
}) => {
    const handleOnClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(pattern, event);
    }, [onClick, pattern]);

    const handleOnSave = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        onSave?.(pattern, event);
    }, [onSave, pattern]);

    const handleOnDelete = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        onDelete?.(pattern, event);
    }, [onDelete, pattern]);

    return (
        <Card padding={4}>
            <CardBody padding={0} paddingBottom={2}>
                <AspectRatio ratio={250/180}>
                    <Box
                        alignItems={"center"}
                        backgroundColor={"gray.100"}
                        borderColor={"gray.100"}
                        borderRadius={8}
                        borderWidth={1}
                        justifyContent={"center"}
                        objectFit={"cover"}
                        height={"100%"}
                        width={"100%"}
                        onClick={handleOnClick}
                    >
                        <Image
                            alt={"base64 image"}
                            minHeight={"100%"}
                            minWidth={"100%"}
                            cursor={"pointer"}
                            src={pattern.coverUrl}
                        />
                    </Box>
                </AspectRatio>
            </CardBody>
            <CardFooter padding={0} paddingTop={0}>
                <Flex
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    width={"100%"}
                >
                    <Flex direction={"column"}>
                        <Text noOfLines={1} fontSize={"md"} fontWeight={600}>
                            {pattern.name}
                        </Text>
                        <Text color={"gray.500"} fontSize={"xs"} fontWeight={400}>
                            {pattern.lastModified?.toLocaleString()}
                        </Text>
                    </Flex>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label={"more options"}
                            colorScheme={"gray"}
                            icon={<Icon as={MoreHoriz} boxSize={5} />}
                            size={"md"}
                            variant={"ghost"}
                            title={"more options"}
                        />
                        <MenuList>
                            <MenuItem onClick={handleOnSave}>
                                Save to local device
                            </MenuItem>
                            <MenuItem color={"red.600"} onClick={handleOnDelete}>
                                Delete pattern
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </CardFooter>
        </Card>
    );
};
