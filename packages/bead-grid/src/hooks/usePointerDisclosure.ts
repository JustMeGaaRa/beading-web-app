import { useState, useCallback } from "react";

export const usePointerDisclosure = () => {
    const [isPointerDown, setIsPointerDown] = useState(false);

    const onPointerDown = useCallback(
        () => setIsPointerDown(true),
        [setIsPointerDown]
    );
    const onPointerUp = useCallback(
        () => setIsPointerDown(false),
        [setIsPointerDown]
    );
    const onPointerToggle = useCallback(
        () => setIsPointerDown((state) => !state),
        [setIsPointerDown]
    );

    return {
        isPointerDown,
        onPointerDown,
        onPointerUp,
        onPointerToggle,
    };
};
