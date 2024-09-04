import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FC, useCallback, useState } from "react";
import { BeadingGridType, BeadingGridTypes } from "../components";
import { usePattern } from "../components";

export const CreatePatternModal: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({
  isOpen,
  onClose
}) => {
  const [selectedType, setSelectedType] = useState<BeadingGridType>("square");
  const { resetGrids } = usePattern();

  const handleOnCreateClick = useCallback(() => {
    resetGrids(selectedType);
    onClose();
  }, [selectedType, resetGrids, onClose]);

  return (
    <Modal isCentered isOpen={isOpen} size={"sm"} onClose={onClose}>
      <ModalOverlay backgroundColor={"white"} />
      <ModalContent>
        <ModalHeader fontSize={"xx-large"}>Create pattern</ModalHeader>
        <ModalBody>
          <Flex flexDirection={"column"} width={"100%"}>
            <Text fontSize={"sm"}>All your beading needs are here!</Text>
            <Text fontSize={"sm"}>
              Combine grids, change colors, mirror and more.
            </Text>
            <Flex mt={8} mb={2} justifyContent={"space-between"}>
              {BeadingGridTypes.map((type) => (
                <Box
                  key={type}
                  aria-selected={selectedType === type}
                  borderColor={"gray.300"}
                  borderRadius={16}
                  borderWidth={1}
                  cursor={"pointer"}
                  height={100}
                  textAlign={"center"}
                  width={100}
                  _selected={{
                    backgroundColor: "gray.100",
                  }}
                  _hover={{
                    backgroundColor: "gray.200",
                  }}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Box>
              ))}
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Flex flexDirection={"column"} width={"100%"}>
            <Button width={"100%"} onClick={handleOnCreateClick}>
              Create
            </Button>
            <Text
              color={"gray.500"}
              fontSize={"xs"}
              mt={4}
              textAlign={"center"}
            >
              Configure grids to your needs in the process!
            </Text>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
