import { FC, PropsWithChildren, useRef } from "react";
import { createPatterStore, PatternContext, PatternTemporalStore } from "../store";
import { PatternState } from "../types";

export const PatternProvider: FC<PropsWithChildren<{
    pattern?: PatternState;
}>> = ({
    children, pattern
}) => {
        const storeRef = useRef<PatternTemporalStore>();

        if (!storeRef.current) {
            storeRef.current = createPatterStore(pattern);
        }

        return storeRef.current && (
            <PatternContext.Provider value={storeRef.current}>
                {children}
            </PatternContext.Provider>
        );
    };
