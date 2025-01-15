import { FC } from "react";
import { Text } from "react-konva";
import { useGridStyles } from "../hooks";
import { BeadingGridOffset, BeadingGridProperties } from "../types";
import { getGridCellRenderBounds } from "../utils";

export const BeadingText: FC<{
    text: string;
    color?: string;
    offset: BeadingGridOffset;
    padding?: number;
    options: BeadingGridProperties;
}> = ({ text, color, offset, padding = 0, options }) => {
    const { styles } = useGridStyles();
    const { relativePosition, height } = getGridCellRenderBounds(
        offset,
        options,
        styles
    );

    return (
        <Text
            height={height}
            align={"left"}
            verticalAlign={"middle"}
            padding={padding}
            text={text}
            fill={color ?? styles.components.text.color}
            x={relativePosition.x}
            y={relativePosition.y}
        />
    );
};
