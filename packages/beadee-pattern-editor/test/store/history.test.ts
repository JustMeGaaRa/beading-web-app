import { expect, test } from "vitest";
import {
    createPattern,
    DefaultPatternOptions,
    patternReducer,
} from "../../src";
import { DefaultGridProperties } from "@beadee/grid-editor";
import {
    wrapWithUndoRedoReducer,
    wrapWithUndoRedoState,
} from "../../src/store/history";

test("wrapWithUndoRedoState should wrap the state", () => {
    const initialPattern = createPattern(
        DefaultPatternOptions,
        DefaultGridProperties
    );

    const historyPattern = wrapWithUndoRedoState(initialPattern);

    expect(historyPattern.present).toEqual(initialPattern);
    expect(historyPattern.future).toEqual([]);
    expect(historyPattern.past).toEqual([]);
    expect(historyPattern.canUndo).toBe(false);
    expect(historyPattern.canRedo).toBe(false);
});

test("wrapWithUndoRedoReducer should wrap the reducer", () => {
    const initialPattern = createPattern(
        DefaultPatternOptions,
        DefaultGridProperties
    );
    const historyPattern = wrapWithUndoRedoState(initialPattern);
    const historyPatternReducer = wrapWithUndoRedoReducer(patternReducer, {
        delayMilliseconds: -1,
        maxHistoryLength: 10,
    });

    const nextPattern = historyPatternReducer(historyPattern, {
        type: "PATTERN_CHANGE_NAME",
        name: "test",
    });

    expect(nextPattern.present.name).toBe("test");
    expect(nextPattern.past.length).toBe(1);
    expect(nextPattern.canUndo).toBe(true);
    expect(nextPattern.canRedo).toBe(false);
    expect(nextPattern.future.length).toBe(0);
    expect(nextPattern.present).not.toBe(initialPattern);
});
