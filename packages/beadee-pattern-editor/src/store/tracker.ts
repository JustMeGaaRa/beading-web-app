import { Reducer } from "react";

export type ChangeTrackerState<TState> = TState & {
    changed: boolean;
};

export type ChangeTrackerAction<TACtion> = TACtion | { type: "RESET" };

export const wrapWithChangeTrackerReducer = <TState, TAction extends object>(
    reducer: Reducer<TState, TAction>
): Reducer<ChangeTrackerState<TState>, ChangeTrackerAction<TAction>> => {
    return function changeTrackerReducer(
        state: ChangeTrackerState<TState>,
        action: ChangeTrackerAction<TAction>
    ): ChangeTrackerState<TState> {
        if ("type" in action) {
            switch (action.type) {
                case "RESET":
                    return {
                        ...state,
                        changed: false,
                    };
            }
        }

        return {
            ...state,
            ...reducer(state, action),
            changed: true,
        };
    };
};

export const wrapWithChangeTrackerState = <T>(
    initialState: T
): ChangeTrackerState<T> => {
    return {
        ...initialState,
        changed: false,
    };
};
