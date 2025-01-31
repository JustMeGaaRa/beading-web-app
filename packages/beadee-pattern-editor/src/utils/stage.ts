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
