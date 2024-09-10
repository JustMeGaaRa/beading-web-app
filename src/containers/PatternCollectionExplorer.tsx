import { Box, Button, Flex, Grid, Text, useBreakpointValue } from "@chakra-ui/react";
import { Plus } from "iconoir-react";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router";
import {
    createDefaultPattern,
    PatternCard,
    PatternState,
    usePatternCollection
} from "../components";
import { downloadUri, toJsonUri } from "../utils";

export type PatternCollectionState = {
    patterns: Array<PatternState>;
}

export const PatternCollectionExplorer: FC = () => {
    const navigate = useNavigate();
    const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3, xl: 4, "2xl": 5 });
    const { patterns, addPattern, deletePattern } = usePatternCollection();

    const handleOnPatternClick = useCallback((pattern: PatternState) => {
        navigate(`/patterns/${pattern.patternId}`);
    }, [navigate]);

    const handleOnPatternDelete = useCallback((pattern: PatternState) => {
        deletePattern(pattern.patternId);
    }, [deletePattern]);

    const handleOnPatternSave = useCallback((pattern: PatternState) => {
        const patternUri = toJsonUri(pattern);
        downloadUri(patternUri, `${pattern.name}.json`);
    }, [deletePattern]);
    
    const handleOnCreatePatternClick = useCallback(() => {
        addPattern(createDefaultPattern());
    }, [addPattern]);
    
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
                {patterns.map((pattern) => (
                    <PatternCard
                        key={pattern.patternId}
                        pattern={pattern}
                        onClick={handleOnPatternClick}
                        onSave={handleOnPatternSave}
                        onDelete={handleOnPatternDelete}
                    />
                ))}
            </Grid>
        </Box>
    ) : (
        <Flex alignItems={"center"} justifyContent={"center"} height={"100%"} width={"100%"}>
            <Button
                aria-label={"create pattern"}
                rightIcon={<Plus />}
                variant={"solid"}
                title={"create pattern"}
                onClick={handleOnCreatePatternClick}
            >
                Create first pattern
            </Button>
        </Flex>
    );
};
