import { FC } from "react";
import { Text } from "react-konva";
import { useGridOptions } from "../hooks";
import { BeadingGridOffset } from "../types";


export const GridText: FC<{
    color?: string;
    offset: BeadingGridOffset;
    padding?: number;
    text: string;
}> = ({
    color, offset, padding = 0, text,
}) => {
        const { cellHeight, cellWidth, pointPixelRatio } = useGridOptions();

        return (
            <Text
                height={cellHeight * pointPixelRatio}
                align={"left"}
                verticalAlign={"middle"}
                padding={padding}
                text={text}
                fill={color}
                x={offset.columnIndex * cellWidth * pointPixelRatio}
                y={offset.rowIndex * cellHeight * pointPixelRatio} />
        );
    };
