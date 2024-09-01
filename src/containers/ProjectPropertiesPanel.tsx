import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Icon,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Palette, Plus, Settings } from "iconoir-react";
import { FC, useCallback, useEffect, useState } from "react";
import {
  BeadingGridOptionsPanel,
  BeadingGridState,
  PatternLayoutOptions,
  BeadingLayoutOptionsPanel,
  PatternOptions,
  ColorPalette,
  DefaultPatternOptions,
  usePattern,
} from "../components";
import { PanelPosition } from "../types";
import { applyGridOptions, deepClone } from "../utils";

type BeadingGridConfiguration = Omit<BeadingGridState, "rows">;

type PatternConfigurationState = {
  options: PatternOptions;
  grids: Array<BeadingGridConfiguration>;
};

export const ProjectPropertiesPanel: FC<{
  position: PanelPosition;
}> = ({
  position
}) => {
  const [patternCopy, setPatternCopy] = useState<PatternConfigurationState>({
    options: DefaultPatternOptions,
    grids: [],
  });
  const { grids, options, setGrids, addGrid, setOptions } = usePattern();

  useEffect(() => {
    setPatternCopy({
      options: deepClone<PatternOptions>(options),
      grids: deepClone<Array<BeadingGridConfiguration>>(
        grids.map((grid) => ({
          name: grid.name,
          options: grid.options,
        }))
      ),
    });
  }, [grids, options, setPatternCopy]);

  const handleOnAddGridClick = useCallback(() => {
    addGrid("square");
  }, [addGrid]);

  const handleOnDeleteGridClick = useCallback(
    (grid: BeadingGridConfiguration) => {
      setGrids((grids) => grids.filter((x) => x.name !== grid.name));
    },
    [setGrids]
  );

  const handleOnLayoutChange = useCallback(
    (layout: PatternLayoutOptions) => {
      setPatternCopy((project: PatternConfigurationState) => ({
        ...project,
        options: {
          ...project.options,
          layout: layout,
        },
      }));
    },
    [setPatternCopy]
  );

  const handleOnOptionsChange = useCallback(
    (grid: BeadingGridConfiguration) => {
      setPatternCopy((project: PatternConfigurationState) => ({
        ...project,
        grids: project.grids.map((gridCopy) =>
          gridCopy.name === grid.name ? grid : gridCopy
        ),
      }));
    },
    [setPatternCopy]
  );

  const handleOnDiscardClick = useCallback(() => {
    setPatternCopy({
      options: deepClone<PatternOptions>(options),
      grids: deepClone<Array<BeadingGridConfiguration>>(
        grids.map((grid) => ({
          name: grid.name,
          options: grid.options,
        }))
      ),
    });
  }, [grids, options, setPatternCopy]);

  const handleOnApplyClick = useCallback(() => {
    setGrids((grids) =>
      grids.map((grid) => {
        const gridCopy = patternCopy.grids.find(
          (gridCopy) => grid.name == gridCopy.name
        );
        return gridCopy
          ? applyGridOptions(grid, gridCopy.options, patternCopy.options)
          : grid;
      })
    );
    setOptions(patternCopy.options);
  }, [setGrids, setOptions, patternCopy]);

  return (
    <Box
      alignItems={"start"}
      height={"100%"}
      padding={1}
      position={"absolute"}
      right={0}
      top={0}
      zIndex={1}
    >
      <Box borderRadius={"md"} height={"100%"} width={220}>
        <Accordion
          allowToggle
          backgroundColor={"white"}
          borderRadius={8}
          defaultIndex={[0]}
          mt={2}
        >
          <AccordionItem>
            <AccordionButton>
              <Icon as={Palette} mr={1} />
              <Text as={"b"} flex={1} fontSize={"sm"} textAlign={"left"}>
                Colors
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel maxHeight={"40vh"} overflowY={"scroll"}>
              <ColorPalette />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Accordion
          allowToggle
          backgroundColor={"white"}
          borderRadius={8}
          defaultIndex={[0]}
          mt={2}
        >
          <AccordionItem>
            <AccordionButton>
              <Icon as={Settings} mr={1} />
              <Text as={"b"} flex={1} fontSize={"sm"} textAlign={"left"}>
                Settings
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel maxHeight={"40vh"} overflowY={"scroll"}>
              <VStack
                alignItems={"start"}
                divider={<StackDivider borderColor="gray.200" />}
                spacing={4}
              >
                <BeadingLayoutOptionsPanel
                  layout={patternCopy.options.layout}
                  onChange={handleOnLayoutChange}
                />
                {patternCopy.grids.map((grid) => (
                  <BeadingGridOptionsPanel
                    key={grid.name}
                    canDelete={patternCopy.grids.length > 1}
                    isHorizontal={patternCopy.options.layout.orientation === "horizontal"}
                    name={grid.name}
                    options={grid.options}
                    onChange={handleOnOptionsChange}
                    onDelete={handleOnDeleteGridClick}
                  />
                ))}
                <Button
                  leftIcon={<Plus />}
                  size={"xs"}
                  variant={"outline"}
                  onClick={handleOnAddGridClick}
                >
                  Add grid
                </Button>
                <ButtonGroup size={"sm"} width={"100%"}>
                  <Button
                    variant={"outline"}
                    width={"50%"}
                    onClick={handleOnDiscardClick}
                  >
                    Discard
                  </Button>
                  <Button
                    variant={"solid"}
                    width={"50%"}
                    onClick={handleOnApplyClick}
                  >
                    Apply
                  </Button>
                </ButtonGroup>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  );
};
