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
    BeadingGridDivider,
    BeadingFrame,
    BeadingGridSelectionProvider,
} from "@repo/bead-grid";
import { getPatternSize, PatternOptions } from "@repo/bead-pattern-editor";
import {
    FC,
    useCallback,
    useEffect,
    useReducer,
    useRef,
    useState,
} from "react";
import { Layer, Stage } from "react-konva";
import Konva from "konva";
import { ColorPaletteProvider, Content, Page } from "../components";

export const PreviewPage: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const [stageSize, setStageSize] = useState({ height: 0, width: 0 });
    const colors = useToken("colors", [
        "gray.900",
        "gray.700",
        "gray.500",
        "gray.300",
        "gray.100",
        "red.900",
        "red.700",
        "red.500",
        "red.300",
        "red.100",
        "orange.900",
        "orange.700",
        "orange.500",
        "orange.300",
        "orange.100",
        "yellow.900",
        "yellow.700",
        "yellow.500",
        "yellow.300",
        "yellow.100",
        "green.900",
        "green.700",
        "green.500",
        "green.300",
        "green.100",
        "teal.900",
        "teal.700",
        "teal.500",
        "teal.300",
        "teal.100",
        "blue.900",
        "blue.700",
        "blue.500",
        "blue.300",
        "blue.100",
        "cyan.900",
        "cyan.700",
        "cyan.500",
        "cyan.300",
        "cyan.100",
        "purple.900",
        "purple.700",
        "purple.500",
        "purple.300",
        "purple.100",
        "pink.900",
        "pink.700",
        "pink.500",
        "pink.300",
        "pink.100",
    ]);

    const [state, dispatch] = useReducer(gridReducer, {
        name: "Brick Grid 1",
        cells: [],
        options: {
            type: "brick",
            height: 30,
            width: 20,
            drop: 3,
            fringe: 5,
        },
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

    const handleOnCellEnter = useCallback(
        (_: BeadingGridState, event: BeadingPointerEvent) => {
            if (event.isPointerDown) {
                dispatch(
                    setBeadingGridCellAction({
                        ...event.cell,
                        color: colors[0],
                    })
                );
            }
        },
        [colors]
    );

    const patternOptions: PatternOptions = {
        layout: {
            type: "brick",
            orientation: "vertical",
            beadSize: DefaultGridStyles.bead,
            height: 30,
            width: 20,
        },
    };

    const { height, width } = getPatternSize([state], patternOptions);

    return (
        <ColorPaletteProvider colors={colors}>
            <Page>
                <Content>
                    <Box ref={containerRef} height={"100%"} width={"100%"}>
                        <Stage
                            ref={stageRef}
                            x={100}
                            y={100}
                            height={stageSize.height}
                            width={stageSize.width}
                        >
                            <Layer>
                                <BeadingGridStylesProvider
                                    styles={DefaultGridStyles}
                                >
                                    <BeadingGridSelectionProvider>
                                        <BeadingGridProvider>
                                            <BeadingGrid
                                                cells={state.cells}
                                                offset={{
                                                    rowIndex: 0,
                                                    columnIndex: 0,
                                                }}
                                                options={state.options}
                                                onCellEnter={handleOnCellEnter}
                                            >
                                                <BeadingGridBackgroundPattern />
                                                <BeadingText
                                                    text={state.name}
                                                    offset={{
                                                        columnIndex: -4,
                                                        rowIndex: 0,
                                                    }}
                                                    options={state.options}
                                                />
                                                <BeadingGridDivider
                                                    length={
                                                        state.options.width + 4
                                                    }
                                                    orientation={"horizontal"}
                                                    offset={{
                                                        columnIndex: -4,
                                                        rowIndex: 0,
                                                    }}
                                                />
                                            </BeadingGrid>
                                        </BeadingGridProvider>

                                        <BeadingFrame
                                            height={height}
                                            width={width}
                                            options={state.options}
                                        />
                                    </BeadingGridSelectionProvider>
                                </BeadingGridStylesProvider>
                            </Layer>
                        </Stage>
                    </Box>
                </Content>
            </Page>
        </ColorPaletteProvider>
    );
};
