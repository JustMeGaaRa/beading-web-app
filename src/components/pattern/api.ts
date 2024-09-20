import { savePattern, usePatternCollectionStore } from "../pattern-collection";
import { PatternState } from "./types";

export const fetchPattern = (patternId?: string): Promise<PatternState | undefined> => {
    const patterns = usePatternCollectionStore.getState().patterns;
    const pattern = patterns.find((pattern) => pattern.patternId === patternId);
    return Promise.resolve(pattern);
};

export const putPattern = (pattern: PatternState): Promise<void> => {
    usePatternCollectionStore.getState().dispatch(savePattern(pattern));
    return Promise.resolve();
};
