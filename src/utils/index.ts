import Konva from "konva";

export const deepClone = <T>(instance: T): T => {
    return JSON.parse(JSON.stringify(instance)) as T;
};

export const toJsonUri = (instance: any) => {
    const patternJson = JSON.stringify(instance, null, 2);
    const blob = new Blob([patternJson], { type: "application/json" });
    return URL.createObjectURL(blob);
};

export const downloadUri = (uri: string, name: string) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const ZOOM_FACTOR = 1.1;
export const ZOOM_MAXIMUM = 4;

type Size = { height: number; width: number };

export const getMinimumScale = (
    stageSize: Size,
    boundarySize: Size
) => {
    const ZOOM_OUTLINE_FACTOR = 0.9;
    return Math.min(
        stageSize.width / boundarySize.width,
        stageSize.height / boundarySize.height
    ) * ZOOM_OUTLINE_FACTOR;
};

export const getGravitationCenter = (
    stageSize: Size,
    boundarySize: Size
) => {
    const stageCenter = {
        x: stageSize.width / 2,
        y: stageSize.height / 2,
    };
    return {
        x: stageCenter.x - boundarySize.width / 2,
        y: stageCenter.y - boundarySize.height / 2
    };
};

export const calculateNewScale = (
    isZoomingOut: boolean,
    currentScale: number,
    scaleBy: number
) => {
    return isZoomingOut
        ? currentScale / scaleBy
        : currentScale * scaleBy;
};

export const getPointerOffset = (
    pointerPosition: Konva.Vector2d,
    stage: Konva.Stage,
    scale: number
) => {
    return {
        x: (pointerPosition.x - stage.x()) / scale,
        y: (pointerPosition.y - stage.y()) / scale,
    };
};

export const calculateNewPosition = (
    pointerOffset: Konva.Vector2d,
    pointerPosition: Konva.Vector2d,
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
    position: Konva.Vector2d
) => {
    stage.position(position);
    stage.scale({ x: scale, y: scale });
    stage.batchDraw();
};
