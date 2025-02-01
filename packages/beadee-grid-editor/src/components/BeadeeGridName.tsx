import { FC } from "react";
import { Text } from "react-konva";
import { useBeadeeGridStyles, useBeadeeRenderBounds } from "../hooks";

export const BeadeeGridName: FC<{
    alignment?: "start" | "end";
    placement?: "start" | "end";
    text: string;
    color?: string;
    padding?: number;
}> = ({ alignment, placement, text, color, padding = 8 }) => {
    const { styles } = useBeadeeGridStyles();
    const { position, height, width } = useBeadeeRenderBounds();

    return (
        <Text
            height={height}
            width={width}
            align={alignment === "start" ? "left" : "right"}
            verticalAlign={placement === "start" ? "top" : "bottom"}
            padding={padding}
            text={text}
            fill={color ?? styles.components.text.color}
            x={position.x}
            y={position.y}
        />
    );
};
