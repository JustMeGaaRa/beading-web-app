import { BeadProperties } from "../types";

export const isNullOrEmpty = (str?: string) => {
    return str === null || str === undefined || str === "";
};

export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const flipBead = (bead: BeadProperties): BeadProperties => {
    return {
        ...bead,
        width: bead.height,
        height: bead.width,
    };
};
