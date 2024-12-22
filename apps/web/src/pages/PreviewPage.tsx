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
    BeadingText,
    BeadingGridDivider
} from "@repo/bead-grid";
import { FC, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import Konva from "konva";
import { Content, Page } from "../components";

export const PreviewPage: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const [stageSize, setStageSize] = useState({ height: 0, width: 0 });
    const [color] = useToken("colors", ["blue.500"]);

    const [state, dispatch] = useReducer(gridReducer, {
        name: "Brick Grid 1",
        cells: [
        ],
        offset: { rowIndex: 10, columnIndex: 10 },
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
        const position = stageRef.current?.getPointerPosition() ?? { x: 0, y: 0 };
        console.log("stage cursor position", position);
        dispatch(setBeadingGridCellAction({ ...event.cell, color }));
    }, [stageRef, color]);

    return (
        <Page>
            <Content>
                <Box ref={containerRef} height={"100%"} width={"100%"}>
                    <Stage ref={stageRef} height={stageSize.height} width={stageSize.width}>
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
                                        <BeadingText
                                            text={state.name}
                                            offset={{ columnIndex: -4, rowIndex: 0 }}
                                            options={state.options}
                                        />
                                        <BeadingGridDivider
                                            length={state.options.width + 4}
                                            orientation={"horizontal"}
                                            offset={{ columnIndex: -4, rowIndex: 0 }}
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
