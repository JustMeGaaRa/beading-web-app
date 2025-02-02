export type RenderPoint = {
    x: number;
    y: number;
};

export type RenderDelta = {
    dx: number;
    dy: number;
};

export type RenderBounds = {
    position: RenderPoint;
    height: number;
    width: number;
};

export const DefaultEmptyBounds: RenderBounds = {
    position: { x: 0, y: 0 },
    height: 0,
    width: 0,
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

export const extendDelta = (
    delta: RenderDelta,
    factor: number
): RenderDelta => {
    return {
        dx: delta.dx * factor,
        dy: delta.dy * factor,
    };
};

export const negateDelta = (delta: RenderDelta): RenderDelta => {
    return {
        dx: -delta.dx,
        dy: -delta.dy,
    };
};

export const expandBounds = (bounds: RenderBounds, delta: RenderDelta) => {
    return {
        position: {
            x: bounds.position.x,
            y: bounds.position.y,
        },
        width: bounds.width + delta.dx,
        height: bounds.height + delta.dy,
    };
};

export const shiftBounds = (
    bounds: RenderBounds,
    delta: RenderDelta
): RenderBounds => {
    return {
        position: {
            x: bounds.position.x + delta.dx,
            y: bounds.position.y + delta.dy,
        },
        width: bounds.width,
        height: bounds.height,
    };
};

export const scaleAroundCenter = (
    bounds: RenderBounds,
    delta: RenderDelta
): RenderBounds => {
    return expandBounds(
        shiftBounds(bounds, negateDelta(delta)),
        extendDelta(delta, 2)
    );
};
