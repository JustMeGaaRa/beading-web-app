import { Flex } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

export const Page: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Flex
            backgroundColor={"blackAlpha.100"}
            flexDirection={"column"}
            height={"100vh"}
            width={"100vw"}
        >
            {children}
        </Flex>
    );
};
