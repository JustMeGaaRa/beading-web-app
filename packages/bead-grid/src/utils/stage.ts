import Konva from "konva";

export const getStageRelativePosition = (
    stage: Konva.Stage | null | undefined
) => {
    const currentPosition = stage?.getRelativePointerPosition() ?? {
        x: 0,
        y: 0,
    };
    return currentPosition;
};
