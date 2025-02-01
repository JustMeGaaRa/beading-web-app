import { BeadProperties, ONE_SIX_BY_ONE_THREE } from "./BeadProperties";

export type BeadingGridStyles = {
    components: {
        pattern: {
            color: string;
        };
        divider: {
            strokeColor: string;
            strokeWidth: number;
        };
        cell: {
            backgroundColor: string;
            borderColor: string;
            borderWidth: number;
            borderRadius: number;
            height: number;
            width: number;
            _selected: {
                backgroundColor: string;
                borderColor: string;
                borderWidth: number;
                borderRadius: number;
            };
        };
        text: {
            color: string;
        };
        frame: {
            marker: {
                backgroundColor: string;
                borderColor: string;
                borderWidth: number;
            };
            text: {
                color: string;
            };
            selection: {
                backgroundColor: string;
                borderColor: string;
                borderWidth: number;
            };
        };
    };
    // TODO: merge this bead with cell styles, as they are basically the same
    bead: BeadProperties;
};

export const DefaultGridStyles: BeadingGridStyles = {
    components: {
        pattern: {
            color: "rgba(0, 0, 0, 0.36)",
        },
        divider: {
            strokeColor: "#00000029",
            strokeWidth: 1,
        },
        cell: {
            backgroundColor: "",
            borderColor: "#718096",
            borderWidth: 1,
            borderRadius: 2,
            height: 1.6,
            width: 1.3,
            _selected: {
                backgroundColor: "#9DECF9",
                borderColor: "#0BC5EA",
                borderWidth: 2,
                borderRadius: 2,
            },
        },
        text: {
            color: "#00000029",
        },
        frame: {
            marker: {
                backgroundColor: "rgba(0, 0, 0, 0.36)",
                borderColor: "",
                borderWidth: 0,
            },
            text: {
                color: "#718096",
            },
            selection: {
                backgroundColor: "#9DECF9",
                borderColor: "#0BC5EA",
                borderWidth: 2,
            },
        },
    },
    bead: ONE_SIX_BY_ONE_THREE,
};
