import React from "react";
import { Box, Color } from 'ink';
import { Text } from './Text';

export const RunTest = () => {
  return (
    <Box flexDirection="column" paddingTop={1}>
      <Box>
        <Color red>run test</Color> <Color yellow>hiya</Color>
      </Box>
      <Box>
        <Text bold>
          <Color blue>run test should go here</Color>
        </Text>
      </Box>
    </Box>
  );
};
