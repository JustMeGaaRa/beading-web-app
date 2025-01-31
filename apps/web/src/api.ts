import { Pattern } from "@beadee/pattern-editor";
import { savePatternAction } from "./creators";
import { usePatternCollectionStore } from "./store";

export const fetchPattern = (
    patternId?: string
): Promise<Pattern | undefined> => {
    const patterns = usePatternCollectionStore.getState().patterns;
    const pattern = patterns.find((pattern) => pattern.patternId === patternId);
    return Promise.resolve(pattern);
};

export const putPattern = (pattern: Pattern): Promise<void> => {
    usePatternCollectionStore.getState().dispatch(savePatternAction(pattern));
    return Promise.resolve();
};
