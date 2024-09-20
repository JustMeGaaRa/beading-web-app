import {
    Flex,
    HStack,
    Kbd,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Text,
    VStack
} from "@chakra-ui/react";
import { FC, memo } from "react";
import { Shortcuts } from "./constants";
import { ShortcutKeyArray, ShortcutScopes } from "./types";

export const ShortcutTableModal: FC<{
    scope: ShortcutScopes;
    isOpen: boolean;
    onClose: () => void;
}> = ({
    scope,
    isOpen,
    onClose,
}) => {
    const scopeShortcuts = ShortcutKeyArray
        .map((key) => Shortcuts[key])
        .filter(x => x.scope === scope || scope === "global");
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>Shortcut Table</ModalHeader>
                <ModalCloseButton />
                <ModalBody maxH={"400px"} overflowY={"scroll"}>
                    <VStack width={"100%"}>
                        {scopeShortcuts.map(shortcut => (
                            <Flex key={shortcut.keyString} justifyContent={"space-between"} width={"100%"}>
                                <Text>{shortcut.description}</Text>
                                <Shortcut keys={shortcut.keys} />
                            </Flex>
                        ))}
                    </VStack>
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>
    );
};

export const Shortcut: FC<{ keys: Array<string> }> = memo(({ keys }) => (
    <HStack>
        {keys.map((key) => (<Kbd key={key}>{key}</Kbd>))}
    </HStack>
));
