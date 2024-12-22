import { FC } from "react";
import { Text } from "react-konva";
import { useGridStyles } from "../hooks";
import { BeadingGridOffset, BeadingGridProperties } from "../types";
import { getGridCellOffset, getGridCellSize } from "../utils";

export const BeadingText: FC<{
    text: string;
    color?: string;
    offset: BeadingGridOffset;
    padding?: number;
    options: BeadingGridProperties;
}> = ({
    text,
    color,
    offset,
    padding = 0,
    options,
}) => {
        const { styles } = useGridStyles();
        const position = getGridCellOffset(offset, options, styles);
        const size = getGridCellSize(options, styles);

        return (
            <Text
                height={size.height}
                align={"left"}
                verticalAlign={"middle"}
                padding={padding}
                text={text}
                fill={color}
                x={position.x}
                y={position.y}
            />
        );
    };
