import { Box, Tooltip } from "@chakra-ui/react";
import { BeadingGridSectionToolbar } from "@repo/bead-grid";
import { TapMoveIcon } from "@repo/icons";
import { FC } from "react";

export const BeadingGridSectionControlsToolbar: FC<{
    isVisible?: boolean;
}> = ({ isVisible = true }) => {
    return (
        <BeadingGridSectionToolbar isVisible={isVisible} placement={"right"}>
            <Box
                backgroundColor={"gray.100"}
                borderRadius={"md"}
                cursor={"move"}
                pointerEvents={"all"}
                transform={"translate(50%, 0%)"}
            >
                <Tooltip label={"Move section"}>
                    <TapMoveIcon />
                </Tooltip>
            </Box>
        </BeadingGridSectionToolbar>
    );
};
