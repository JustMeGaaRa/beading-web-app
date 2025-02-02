import {
    forwardRef,
    PropsWithChildren,
    useCallback,
    useRef,
    useState,
} from "react";
import { Layer, Stage } from "react-konva";
import Konva from "konva";
import {
    getContentScale,
    getPatternRenderBounds,
    SCALE_MAXIMUM,
} from "../utils";
import {
    BeadeeRenderBoundsProvider,
    DefaultEmptyBounds,
    useBeadeeGridStyles,
} from "@beadee/grid-editor";
import { Pattern, PatternMetadata } from "../types";

export const BeadeePattern = forwardRef<
    Konva.Stage,
    PropsWithChildren<{
        pattern: Pattern;
        metadata?: PatternMetadata;
        height: number;
        width: number;
        isDraggable?: boolean;
        isZoomable?: boolean;
        onClick?: (event: Konva.KonvaEventObject<MouseEvent>) => void;
        onContextMenu?: (event: Konva.KonvaEventObject<MouseEvent>) => void;
        onPointerDown?: (event: Konva.KonvaEventObject<MouseEvent>) => void;
        onPointerUp?: (event: Konva.KonvaEventObject<MouseEvent>) => void;
        onPointerMove?: (event: Konva.KonvaEventObject<MouseEvent>) => void;
    }>
>(
    (
        {
            children,
            pattern,
            metadata,
            height,
            width,
            isDraggable,
            isZoomable,
            onClick,
            onContextMenu,
            onPointerDown,
            onPointerMove,
            onPointerUp,
        },
        ref
    ) => {
        const lastTouchDistanceRef = useRef(0);

        // SECTION: stage event handlers
        const [touchZoom, setTouchZoom] = useState(false);
        const { styles } = useBeadeeGridStyles();

        const handleOnStageWheel = useCallback(
            (event: Konva.KonvaEventObject<WheelEvent>) => {
                event.evt.preventDefault();

                const stage = event.target.getStage();
                if (!stage) return;

                const currentScale = stage.scaleX();
                const pointerPosition = stage.getPointerPosition();
                const stagePosition = stage.position();

                if (!pointerPosition) return;

                const stageSize = stage.getSize();
                const patternSize = getPatternRenderBounds(
                    pattern.grids,
                    styles
                );
                const minScale = getContentScale(stageSize, patternSize);
                const maxScale = SCALE_MAXIMUM;

                const direction = event.evt.deltaY > 0 ? -1 : 1;
                const scaleBy = 1.2;
                let newScale =
                    direction > 0
                        ? currentScale * scaleBy
                        : currentScale / scaleBy;

                const mousePointTo = {
                    x: (pointerPosition.x - stagePosition.x) / currentScale,
                    y: (pointerPosition.y - stagePosition.y) / currentScale,
                };

                if (direction > 0) {
                    // Zoom In: Keep the point under cursor stationary
                    newScale = Math.min(maxScale, newScale);
                } else {
                    // Zoom Out: Keep the point under cursor stationary
                    newScale = Math.max(minScale, newScale);
                }

                const newPos = {
                    x: pointerPosition.x - mousePointTo.x * newScale,
                    y: pointerPosition.y - mousePointTo.y * newScale,
                };

                stage.scale({ x: newScale, y: newScale });
                stage.position(newPos);

                stage.batchDraw();
            },
            [pattern.grids, pattern.options, styles]
        );

        const handleOnStageTouchStart = useCallback(
            (event: Konva.KonvaEventObject<TouchEvent>) => {
                // NOTE: pinch gesture requires two fingers, otherwise it might be other gesture
                setTouchZoom(event.evt.touches.length === 2);
            },
            []
        );

        const handleOnStageTouchMove = useCallback(
            (event: Konva.KonvaEventObject<TouchEvent>) => {
                if (!isZoomable) return;

                event.evt.preventDefault();

                // NOTE: pinch gesture requires two fingers, otherwise it might be other gesture
                if (event.evt.touches.length !== 2) return;

                const [touchPoint1, touchPoint2] = event.evt
                    .touches as unknown as [Touch, Touch];
                const currentTouchDistance = Math.hypot(
                    touchPoint2.clientX - touchPoint1.clientX,
                    touchPoint2.clientY - touchPoint1.clientY
                );

                if (lastTouchDistanceRef.current === 0) {
                    lastTouchDistanceRef.current = currentTouchDistance;
                    return;
                }

                const stage = event.target.getStage();
                if (!stage) return;

                const pointerPosition = {
                    x: (touchPoint1.clientX + touchPoint2.clientX) / 2,
                    y: (touchPoint1.clientY + touchPoint2.clientY) / 2,
                };

                const stageSize = stage.getSize();
                const stagePosition = stage.position();
                const patternSize = getPatternRenderBounds(
                    pattern.grids,
                    styles
                );
                const minScale = getContentScale(stageSize, patternSize);
                const maxScale = SCALE_MAXIMUM;
                const oldScale = stage.scaleX();

                let newScale =
                    oldScale *
                    (currentTouchDistance / lastTouchDistanceRef.current);

                newScale = Math.max(minScale, Math.min(maxScale, newScale));

                const mousePointTo = {
                    x: (pointerPosition.x - stagePosition.x) / oldScale,
                    y: (pointerPosition.y - stagePosition.y) / oldScale,
                };

                const newPos = {
                    x: pointerPosition.x - mousePointTo.x * newScale,
                    y: pointerPosition.y - mousePointTo.y * newScale,
                };

                stage.scale({ x: newScale, y: newScale });
                stage.position(newPos);
                stage.batchDraw();

                lastTouchDistanceRef.current = currentTouchDistance;
            },
            [pattern.grids, pattern.options, styles]
        );

        const handleOnStageTouchEnd = useCallback(() => {
            lastTouchDistanceRef.current = 0;
            setTouchZoom(false);
        }, []);

        return (
            <BeadeeRenderBoundsProvider
                {...(metadata?.patternBounds ?? DefaultEmptyBounds)}
            >
                <Stage
                    ref={ref}
                    height={height}
                    width={width}
                    draggable={isDraggable && !touchZoom}
                    onClick={onClick}
                    onContextMenu={onContextMenu}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onTouchStart={handleOnStageTouchStart}
                    onTouchMove={handleOnStageTouchMove}
                    onTouchEnd={handleOnStageTouchEnd}
                    onWheel={handleOnStageWheel}
                >
                    <Layer>{children}</Layer>
                </Stage>
            </BeadeeRenderBoundsProvider>
        );
    }
);
