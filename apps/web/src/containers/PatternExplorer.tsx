import { Box, Button, Flex, Grid, Text, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { Plus } from "iconoir-react";
import { FC, useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { PatternCard, usePatternCollectionStore } from "../components";
import { downloadUri, toJsonUri } from "../utils";
import { CreatePatternModal, DeletePatternModal } from "./CreatePatternModal";
import { PatternState } from "@repo/bead-pattern-editor";

const comparePatterns = (a: PatternState, b: PatternState) => {
    return new Date(b.lastModified).valueOf() - new Date(a.lastModified).valueOf();
}

export const PatternCollectionExplorer: FC = () => {
    const navigate = useNavigate();
    const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3, xl: 4, "2xl": 5 });
    const [deletingPattern, setDeletingPattern] = useState<PatternState | null>(null);
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { patterns } = usePatternCollectionStore();

    const handleOnPatternClick = useCallback((pattern: PatternState) => {
        navigate(`/patterns/${pattern.patternId}`);
    }, [navigate]);

    const handleOnCreatePatternClick = useCallback(() => {
        onCreateOpen();
    }, [onCreateOpen]);

    const handleOnPatternDelete = useCallback((pattern: PatternState) => {
        setDeletingPattern(pattern);
        onDeleteOpen();
    }, [onDeleteOpen]);

    const handleOnPatternSave = useCallback((pattern: PatternState) => {
        const patternUri = toJsonUri(pattern);
        downloadUri(patternUri, `${pattern.name}.json`);
    }, []);

    return patterns.length > 0 ? (
        <Box height={"100%"} overflowY={"scroll"} padding={6} width={"100%"}>
            <Box background={"blue.100"} borderRadius={8} padding={4} mb={4}>
                <Text color={"blackAlpha.900"} fontWeight={600}>Please Note:</Text>
                <Text color={"blackAlpha.700"}>
                    All your projects are saved locally in your browser. This means they may be lost at any time, especially if you clear your browser data or use private/incognito tabs. To avoid losing your work, please make sure to save each file from your project card regularly.
                    Thank you for understanding and happy creating! 😊
                </Text>
            </Box>
            <Grid gridTemplateColumns={`repeat(${gridColumns}, 1fr)`} gap={6}>
                {patterns.sort(comparePatterns).map((pattern) => (
                    <PatternCard
                        key={pattern.patternId}
                        pattern={pattern}
                        onClick={handleOnPatternClick}
                        onSave={handleOnPatternSave}
                        onDelete={handleOnPatternDelete}
                    />
                ))}
            </Grid>

            <DeletePatternModal pattern={deletingPattern} isOpen={isDeleteOpen} onClose={onDeleteClose} />
        </Box>
    ) : (
        <Flex alignItems={"center"} justifyContent={"center"} height={"100%"} width={"100%"}>
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
                Create first pattern
            </Button>

            <CreatePatternModal isOpen={isCreateOpen} onClose={onCreateClose} />
        </Flex>
    );
};
