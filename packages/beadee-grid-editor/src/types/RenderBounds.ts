export type RenderPoint = {
    x: number;
    y: number;
};

export type RenderBounds = {
    position: RenderPoint;
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
        position: { x, y },
        height,
        width,
    };
};

export const pointInBounds = (bounds: RenderBounds, point: RenderPoint) => {
    return (
        point.x >= bounds.position.x &&
        point.x < bounds.position.x + bounds.width &&
        point.y >= bounds.position.y &&
        point.y < bounds.position.y + bounds.height
    );
};

export const cellInBounds = (bounds: RenderBounds, cell: RenderBounds) => {
    const bottomRight = {
        x: cell.position.x + cell.width,
        y: cell.position.y + cell.height,
    };
    return (
        pointInBounds(bounds, cell.position) &&
        pointInBounds(bounds, bottomRight)
    );
};

export const extendBounds = (bounds: RenderBounds, size: RenderPoint) => {
    return {
        position: {
            x: bounds.position.x,
            y: bounds.position.y,
        },
        width: bounds.width + size.x,
        height: bounds.height + size.y,
    };
};

export const shiftBounds = (
    bounds: RenderBounds,
    offset: RenderPoint
): RenderBounds => {
    return {
        position: {
            x: bounds.position.x + offset.x,
            y: bounds.position.y + offset.y,
        },
        width: bounds.width,
        height: bounds.height,
    };
};
