import { Box, Grid, useBreakpointValue } from "@chakra-ui/react";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router";
import {
    downloadUri,
    PatternCard,
    PatternState,
    toJsonUri,
    usePattern,
    usePatternCollection
} from "../components";

export type PatternCollectionState = {
    patterns: Array<PatternState>;
}

export const PatternCollectionExplorer: FC = () => {
    const navigate = useNavigate();
    const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3, xl: 4, "2xl": 5 });
    const { patterns, deletePattern } = usePatternCollection();
    const { setPattern } = usePattern();

    const handleOnPatternClick = useCallback((pattern: PatternState) => {
        navigate(`/patterns/${pattern.patternId}`);
        setPattern(pattern);
    }, [navigate]);

    const handleOnPatternDelete = useCallback((pattern: PatternState) => {
        deletePattern(pattern.patternId);
    }, [deletePattern]);

    const handleOnPatternSave = useCallback((pattern: PatternState) => {
        const patternUri = toJsonUri(pattern);
        downloadUri(patternUri, `${pattern.name}.json`);
    }, [deletePattern]);
    
    return (
        <Box height={"100%"} overflowY={"scroll"} padding={6} width={"100%"}>
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
    );
};
