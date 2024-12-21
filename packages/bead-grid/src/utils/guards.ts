import { BeadingGridRow, BeadingGridStateLegacy } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isBeadingGridState = (
    data: any
): data is BeadingGridStateLegacy => {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    return (
        typeof data.name === "string" &&
        typeof data.options === "object" &&
        Array.isArray(data.rows) &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.rows.every((row: any) => isBeadingGridRow(row))
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isBeadingGridRow = (data: any): data is BeadingGridRow => {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    return (
        Array.isArray(data.cells) &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.cells.every((cell: any) => typeof cell === "string")
    );
};
