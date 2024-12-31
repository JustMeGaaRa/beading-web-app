export type RenderBounds = {
    x: number;
    y: number;
    height: number;
    width: number;
};

export const createRenderBounds = (
    point1: { x: number; y: number },
    point2: { x: number; y: number }
): RenderBounds => {
    const x = Math.min(point1.x, point2.x);
    const y = Math.min(point1.y, point2.y);
    const width = Math.abs(point2.x - point1.x);
    const height = Math.abs(point2.y - point1.y);

    return {
        x,
        y,
        height,
        width,
    };
};
