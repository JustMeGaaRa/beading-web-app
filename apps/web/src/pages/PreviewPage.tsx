import { Box, useToken } from "@chakra-ui/react";
import {
    BeadingGrid,
    BeadingGridBackgroundPattern,
    BeadingGridProvider,
    BeadingGridStylesProvider,
    DefaultGridStyles,
    setBeadingGridCellAction,
    BeadingPointerEvent,
    BeadingGridState,
    gridReducer,
} from "@repo/bead-grid";
import { FC, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import { Content, Page } from "../components";

export const PreviewPage: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [stageSize, setStageSize] = useState({ height: 0, width: 0 });
    const [color] = useToken("colors", ["blue.500"]);

    const [state, dispatch] = useReducer(gridReducer, {
        name: "",
        cells: [
        ],
        offset: { rowIndex: 0, columnIndex: 0 },
        options: {
            type: "brick",
            height: 8,
            width: 10,
            drop: 3,
            fringe: 2,
        }
    });

    useEffect(() => {
        const resizeStage = () => {
            if (containerRef.current) {
                setStageSize({
                    height: containerRef.current.offsetHeight,
                    width: containerRef.current.offsetWidth,
                });
            }
        };

        resizeStage();
    }, []);

    const handleOnCellPointerDown = useCallback((_: BeadingGridState, event: BeadingPointerEvent) => {
        dispatch(setBeadingGridCellAction({ ...event.cell, color }));
    }, [color]);

    return (
        <Page>
            <Content>
                <Box ref={containerRef} height={"100%"} width={"100%"}>
                    <Stage height={stageSize.height} width={stageSize.width}>
                        <Layer>
                            <BeadingGridStylesProvider styles={DefaultGridStyles}>
                                <BeadingGridProvider>
                                    <BeadingGrid
                                        cells={state.cells}
                                        offset={state.offset}
                                        options={state.options}
                                        onCellPointerDown={handleOnCellPointerDown}
                                    >
                                        <BeadingGridBackgroundPattern
                                            options={state.options}
                                        />
                                    </BeadingGrid>
                                </BeadingGridProvider>
                            </BeadingGridStylesProvider>
                        </Layer>
                    </Stage>
                </Box>
            </Content>
        </Page>
    );
};
