import { FC, PropsWithChildren } from "react";
import { ToolbarPlacement } from "../types";
import { useBeadeeRenderBounds } from "../hooks";
import { getPlacementPosition } from "../utils";
import { Html } from "react-konva-utils";

export const BeadeeGridSectionToolbar: FC<
    PropsWithChildren<{
        isVisible?: boolean;
        placement: ToolbarPlacement;
    }>
> = ({ children, isVisible, placement }) => {
    const bounds = useBeadeeRenderBounds();

    return (
        isVisible && (
            <Html
                divProps={{ style: { pointerEvents: "none" } }}
                groupProps={getPlacementPosition(placement, bounds)}
                transform
                transformFunc={(attr) => ({
                    ...attr,
                    scaleX: 1,
                    scaleY: 1,
                })}
            >
                {children}
            </Html>
        )
    );
};
