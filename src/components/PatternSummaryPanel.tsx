import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { FC, useMemo } from "react";
import { usePattern } from "./pattern";

export const PatternSummaryPanel: FC<{}> = ({}) => {
  const { getSummary } = usePattern();

  const summary = useMemo(() => getSummary(), [getSummary]);

  return (
    <Flex flexDirection={"column"} color={"gray.600"} fontSize={"sm"} gap={2}>
      <Text fontWeight={"semibold"} fontSize={"medium"}>
        Summary
      </Text>
      <Text>{`Total beads: ${summary.totalBeads}`}</Text>
      <Text>{`Bead size: ${summary.beadSize.title}`}</Text>
      <Text>{`Total size: ${summary.totalSize.title}`}</Text>
      <VStack maxHeight={"400px"} overflowY={"scroll"}>
        {summary.beads.map((beadSummary) => (
          <BeadSummaryItem key={beadSummary.color} {...beadSummary} />
        ))}
      </VStack>
    </Flex>
  );
};

const BeadSummaryItem: FC<{
  color: string;
  colorName: string;
  number: number;
}> = ({
  color,
  colorName,
  number
}) => {
  return (
    <Flex
      alignItems={"center"}
      fontSize={"xs"}
      justifyContent={"start"}
      gap={2}
      width={"100%"}
    >
      <Box backgroundColor={color} borderRadius={4} height={8} width={8} />
      <Flex flexDirection={"column"}>
        <Text color={"gray.800"} fontWeight={"semibold"}>
          {colorName}
        </Text>
        <Text>{`${number} ${number > 1 ? "beads" : "bead"}`}</Text>
      </Flex>
    </Flex>
  );
};
