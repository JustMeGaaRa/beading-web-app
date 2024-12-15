import Konva from "konva";

export const deepClone = <T>(instance: T): T => {
    return JSON.parse(JSON.stringify(instance)) as T;
};

export const toJsonUri = (instance: unknown) => {
    const patternJson = JSON.stringify(instance, null, 2);
    const blob = new Blob([patternJson], { type: "application/json" });
    return URL.createObjectURL(blob);
};

export const downloadUri = (uri: string, name: string) => {
    const link = document.createElement("a") as HTMLAnchorElement;
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const SCALE_FACTOR = 1.1;
export const SCALE_MAXIMUM = 4;
export const SCALE_MARGIN_FACTOR = 0.9;

export const getContentScale = (
    originSize: { height: number; width: number },
    currentSize: { height: number; width: number }
) => {
    return (
        Math.min(
            originSize.width / currentSize.width,
            originSize.height / currentSize.height
        ) * SCALE_MARGIN_FACTOR
    );
};

export const getContentOffset = (
    viewportSize: { height: number; width: number },
    contentSize: { height: number; width: number }
) => {
    const viewportCenter = {
        x: viewportSize.width / 2,
        y: viewportSize.height / 2,
    };
    const contentCenter = {
        x: contentSize.width / 2,
        y: contentSize.height / 2,
    };
    return {
        x: viewportCenter.x - contentCenter.x,
        y: viewportCenter.y - contentCenter.y,
    };
};

export const getPointerOffset = (
    pointerPosition: { x: number; y: number },
    viewportPosition: { x: number; y: number },
    scale: number
) => {
    return {
        x: (pointerPosition.x - viewportPosition.x) / scale,
        y: (pointerPosition.y - viewportPosition.y) / scale,
    };
};

export const calculateNewScale = (
    isZoomOutAction: boolean,
    currentScale: number,
    scaleFactor: number
) => {
    return isZoomOutAction
        ? currentScale / scaleFactor
        : currentScale * scaleFactor;
};

export const calculateNewPosition = (
    pointerOffset: { x: number; y: number },
    pointerPosition: { x: number; y: number },
    scale: number
) => {
    return {
        x: pointerPosition.x - pointerOffset.x * scale,
        y: pointerPosition.y - pointerOffset.y * scale,
    };
};

export const applyTransform = (
    stage: Konva.Stage,
    scale: number,
    position: { x: number; y: number }
) => {
    stage.position(position);
    stage.scale({ x: scale, y: scale });
    stage.batchDraw();
};
