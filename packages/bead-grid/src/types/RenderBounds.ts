export type RenderPoint = {
    x: number;
    y: number;
};

export type RenderBounds = {
    absolutePosition: RenderPoint;
    relativePosition: RenderPoint;
    height: number;
    width: number;
};

export const createRenderBounds = (
    point1: RenderPoint,
    point2: RenderPoint
): RenderBounds => {
    const x = Math.min(point1.x, point2.x);
    const y = Math.min(point1.y, point2.y);
    const width = Math.abs(point2.x - point1.x);
    const height = Math.abs(point2.y - point1.y);

    return {
        absolutePosition: { x, y },
        relativePosition: { x, y },
        height,
        width,
    };
};
