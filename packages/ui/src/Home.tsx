import { Box, useStdout } from "ink";
import React from "react";
import { Focusable } from "./Focusable";
import { Text } from './Text';
// import { RunTest } from './RunTest';
import {
  // @ts-ignore
  useNavigate
} from "react-router-dom";

export const Home = () => {
  const {
    stdout: { columns, rows }
  } = useStdout();
  const navigate = useNavigate();

  return (
    <Box height={rows - 1} width={columns}>
      <Box flexDirection="column">
        <Text>Experiments</Text>
        <Focusable onEnter={() => navigate('/list-detail')}>
          <Text>ListDetail</Text>
        </Focusable>
        {/* <Focusable onEnter={() => navigate('/run-test')}>
          <Text>Running Test</Text>
        </Focusable> */}
        <Focusable onEnter={() => navigate('/run-pass-example-cli')}>
          <Text>Run CLI - Success</Text>
        </Focusable>
        <Focusable onEnter={() => navigate('/run-fail-example-cli')}>
          <Text>Run CLI - Failing</Text>
        </Focusable>
        <Focusable onEnter={() => navigate('/run-pass-example-ci')}>
          <Text>Run CI - Success</Text>
        </Focusable>
        <Focusable onEnter={() => navigate('/run-fail-example-ci')}>
          <Text>Run CI - Failing</Text>
        </Focusable>
      </Box>
    </Box>
  );
};
