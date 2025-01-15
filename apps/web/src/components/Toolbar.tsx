import { Box } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

type ToolbarPlacement = "top" | "bottom" | "left" | "right";

type PositionProps = {
    left?: number | string;
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    transform?: string | "auto";
};

function getPosition(placement: ToolbarPlacement): PositionProps {
    switch (placement) {
        case "top":
            return { left: "50%", top: 0, transform: "translate(-50%, 0)" };
        case "bottom":
            return { left: "50%", bottom: 0, transform: "translate(-50%, 0)" };
        case "left":
            return { left: 0, top: "50%", transform: "translate(0, -50%)" };
        case "right":
            return { right: 0, top: "50%", transform: "translate(0, -50%)" };
    }
}

export const Toolbar: FC<
    PropsWithChildren<{
        placement: ToolbarPlacement;
        isVisible?: boolean;
    }>
> = ({ children, placement, isVisible = true }) => {
    return (
        isVisible && (
            <Box
                padding={3}
                position={"absolute"}
                pointerEvents={"none"}
                zIndex={1}
                {...getPosition(placement)}
            >
                {children}
            </Box>
        )
    );
};
