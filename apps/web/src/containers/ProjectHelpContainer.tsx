import {
    Box,
    ButtonGroup,
    IconButton,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";
import { FC, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Shortcuts, ShortcutTableModal } from "../components";
import { QuestionmarkCircleIcon } from "@repo/icons";

const hotkeysOptions = { preventDefault: true, keydown: true, keyup: true };

export const ProjectHelpContainer: FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const peekShortcuts = useCallback(
        (keyboardEvent: KeyboardEvent) => {
            if (keyboardEvent.type === "keydown") {
                onOpen();
            }
            if (keyboardEvent.type === "keyup") {
                onClose();
            }
        },
        [onOpen, onClose]
    );

    useHotkeys(Shortcuts.help.keyString, peekShortcuts, hotkeysOptions, [
        peekShortcuts,
    ]);

    return (
        <Box padding={3} position={"absolute"} left={0} bottom={0} zIndex={1}>
            <Box backgroundColor={"white"} borderRadius={"lg"} padding={1}>
                <ButtonGroup
                    colorScheme={"gray"}
                    orientation={"vertical"}
                    spacing={1}
                    size={"md"}
                    variant={"ghost"}
                >
                    <Tooltip label={"Show help"} placement={"right"}>
                        <IconButton
                            aria-label={"help"}
                            icon={<QuestionmarkCircleIcon />}
                            onClick={onOpen}
                        />
                    </Tooltip>
                </ButtonGroup>
                <ShortcutTableModal
                    scope={"page.pattern"}
                    isOpen={isOpen}
                    onClose={onClose}
                />
            </Box>
        </Box>
    );
};
