import { Flex } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

export const Content: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Flex
      backgroundColor={"blackAlpha.100"}
      flexGrow={1}
      overflow={"hidden"}
      position={"relative"}
    >
      {children}
    </Flex>
  );
};
