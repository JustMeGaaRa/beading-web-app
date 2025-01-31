import { PatternState } from "@beadee/pattern-editor";
import { savePatternAction } from "./creators";
import { usePatternCollectionStore } from "./store";

export const fetchPattern = (
    patternId?: string
): Promise<PatternState | undefined> => {
    const patterns = usePatternCollectionStore.getState().patterns;
    const pattern = patterns.find((pattern) => pattern.patternId === patternId);
    return Promise.resolve(pattern);
};

export const putPattern = (pattern: PatternState): Promise<void> => {
    usePatternCollectionStore.getState().dispatch(savePatternAction(pattern));
    return Promise.resolve();
};
