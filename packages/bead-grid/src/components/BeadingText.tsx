import { FC } from "react";
import { Text } from "react-konva";
import { useGridStyles } from "../hooks";
import { BeadingGridOffset } from "../types";

export const BeadingText: FC<{
    color?: string;
    offset: BeadingGridOffset;
    padding?: number;
    text: string;
}> = ({
    color,
    offset,
    padding = 0,
    text,
}) => {
        const { styles } = useGridStyles();

        return (
            <Text
                height={styles.bead.height * styles.rendering.pixelPerPoint}
                align={"left"}
                verticalAlign={"middle"}
                padding={padding}
                text={text}
                fill={color}
                x={offset.columnIndex * styles.bead.width * styles.rendering.pixelPerPoint}
                y={offset.rowIndex * styles.bead.height * styles.rendering.pixelPerPoint}
            />
        );
    };
