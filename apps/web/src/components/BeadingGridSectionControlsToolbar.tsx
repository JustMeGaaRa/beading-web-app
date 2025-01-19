import { Box, ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { BeadeeGridSectionToolbar } from "@repo/bead-grid";
import { TapMoveIcon } from "@repo/icons";
import { FC } from "react";

export const BeadingGridSectionControlsToolbar: FC<{
    isVisible?: boolean;
}> = ({ isVisible = true }) => {
    return (
        <BeadeeGridSectionToolbar isVisible={isVisible} placement={"top-right"}>
            <Box
                backgroundColor={"gray.100"}
                borderRadius={"md"}
                cursor={"move"}
                pointerEvents={"all"}
                marginLeft={"2"}
            >
                <ButtonGroup size={"sm"}>
                    <Tooltip label={"Move section"} placement={"right"}>
                        <IconButton
                            aria-label={"Move section"}
                            icon={<TapMoveIcon />}
                        />
                    </Tooltip>
                </ButtonGroup>
            </Box>
        </BeadeeGridSectionToolbar>
    );
};
