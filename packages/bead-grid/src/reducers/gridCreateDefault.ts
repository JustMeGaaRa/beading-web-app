import { BeadingGridProperties, BeadingGridState } from "../types";
import { buildGridName } from "../utils";

export const gridCreateDefault = (
    options: BeadingGridProperties
): BeadingGridState => {
    return {
        name: buildGridName(options),
        offset: { columnIndex: 0, rowIndex: 0 },
        cells: [],
        options: options,
    };
};
