import { useState, useCallback, useEffect } from "react";

export const usePointerDisclosure = () => {
    const [isPointerDown, setIsPointerDown] = useState(false);

    useEffect(() => {
        window.addEventListener("pointerup", onPointerUp);

        return () => {
            window.removeEventListener("pointerup", onPointerUp);
        };
    }, [isPointerDown]);

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
