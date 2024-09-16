import { useCallback, useContext, useState } from "react"
import { GridOptionsContext } from "./context";

export const useGridOptions = () => {
    return useContext(GridOptionsContext);
};

export const usePointerDisclosure = () => {
    const [isPointerDown, setIsPointerDown] = useState(false);

    const onPointerDown = useCallback(() => setIsPointerDown(true), [setIsPointerDown]);
    const onPointerUp = useCallback(() => setIsPointerDown(false), [setIsPointerDown]);
    const onPointerToggle = useCallback(() => setIsPointerDown((state) => !state), [setIsPointerDown]);

    return {
        isPointerDown,
        onPointerDown,
        onPointerUp,
        onPointerToggle
    };
};
