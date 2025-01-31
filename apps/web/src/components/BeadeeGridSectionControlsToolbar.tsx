import { Box, ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { BeadeeGridSectionToolbar } from "@beadee/grid-editor";
import { TapMoveIcon } from "@beadee/icons";
import { FC, useCallback, useEffect, useState } from "react";

export const BeadeeGridSectionControlsToolbar: FC<{
    isVisible?: boolean;
    onDragStart?: () => void;
    onDrag?: () => void;
    onDragEnd?: (event: { cancelled: boolean }) => void;
}> = ({ isVisible = true, onDragStart, onDrag, onDragEnd }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleOnPointerDown = useCallback(() => {
        setIsDragging(true);
        onDragStart?.();
    }, [onDragStart]);

    const handleOnPointerMove = useCallback(() => {
        if (isDragging) {
            onDrag?.();
        }
    }, [isDragging, onDrag]);

    const handleOnPointerUp = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
            onDragEnd?.({ cancelled: false });
        }
    }, [isDragging, onDragEnd]);

    const handleOnKeyUp = useCallback(
        (event: KeyboardEvent) => {
            if (isDragging && event.key === "Escape") {
                setIsDragging(false);
                onDragEnd?.({ cancelled: true });
            }
        },
        [isDragging, onDragEnd]
    );

    useEffect(() => {
        window.addEventListener("pointermove", handleOnPointerMove);
        window.addEventListener("pointerup", handleOnPointerUp);
        window.addEventListener("keyup", handleOnKeyUp);

        return () => {
            window.removeEventListener("pointermove", handleOnPointerMove);
            window.removeEventListener("pointerup", handleOnPointerUp);
            window.removeEventListener("keyup", handleOnKeyUp);
        };
    }, [handleOnKeyUp, handleOnPointerMove, handleOnPointerUp]);

    return (
        <BeadeeGridSectionToolbar isVisible={isVisible} placement={"top-right"}>
            <Box
                backgroundColor={"gray.100"}
                borderRadius={"md"}
                cursor={"move"}
                pointerEvents={"all"}
                marginLeft={"2"}
            >
                <ButtonGroup size={"sm"}>
                    <Tooltip label={"Move section"} placement={"right"}>
                        <IconButton
                            aria-label={"Move section"}
                            icon={<TapMoveIcon />}
                            onPointerDown={handleOnPointerDown}
                        />
                    </Tooltip>
                </ButtonGroup>
            </Box>
        </BeadeeGridSectionToolbar>
    );
};
