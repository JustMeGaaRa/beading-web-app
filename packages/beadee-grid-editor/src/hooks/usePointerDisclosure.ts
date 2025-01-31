import { useState, useCallback, useEffect } from "react";

export type PointerPosition = {
    x: number;
    y: number;
};

export const usePointerDisclosure = () => {
    const [isPointerDown, setIsPointerDown] = useState(false);
    const [pointerDownPosition, setPointerDownPosition] =
        useState<PointerPosition>();
    const [pointerCurrentPosition, setPointerCurrentPosition] =
        useState<PointerPosition>();

    useEffect(() => {
        window.addEventListener("pointerup", onPointerRelease);

        return () => {
            window.removeEventListener("pointerup", onPointerRelease);
        };
    }, [isPointerDown]);

    const onPointerRelease = useCallback(() => {
        setIsPointerDown(false);
    }, []);

    const onPointerDown = useCallback((position: PointerPosition) => {
        setIsPointerDown(true);
        setPointerDownPosition(position);
        setPointerCurrentPosition(position);
    }, []);

    const onPointerUp = useCallback((position: PointerPosition) => {
        setIsPointerDown(false);
        setPointerCurrentPosition(position);
    }, []);

    const onPointerMove = useCallback((position: PointerPosition) => {
        setPointerCurrentPosition(position);
    }, []);

    return {
        isPointerDown,
        pointerDownPosition,
        pointerCurrentPosition,
        onPointerDown,
        onPointerMove,
        onPointerUp,
    };
};
