import { Flex } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

export const Header: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Flex
            alignItems={"center"}
            backgroundColor={"white"}
            flexBasis={1}
            flexGrow={0}
            justifyContent={"space-between"}
            height={12}
            padding={1}
            position={"relative"}
            width={"100%"}
        >
            {children}
        </Flex>
    );
};
