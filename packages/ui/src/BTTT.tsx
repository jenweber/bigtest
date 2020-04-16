import React, { FC } from "react";
import { Box, Color } from 'ink';
import { Text } from './Text';

interface BTTTProp {
  TT: string;
  TC: number;
}

export const BTTT: FC<BTTTProp> = ({ TT, TC, children }) => {
  let tabs: string = "";
  for (let i = 0; i < TC; i++) {
    const tab: string = "  ";
    tabs = tabs + tab;
  }
  let TTT = TT.slice(0, 4);
  let TTS = TT.slice(4, 5);
  switch (TTT) {
    case "titl":
      return (
        <Box>
          <Text bold>
            {tabs}
            <Color white>
              {children}
            </Color>
          </Text>
        </Box>
      )
    case "guar": {
      switch (TTS) {
        case "+":
          return (
            <Box>
              <Text>
                {tabs}
                <Color green>
                  ●
                </Color> <Text italic><Color white>
                  {children}
                </Color></Text>
              </Text>
            </Box>
          );
        case "x":
          return (
            <Box>
              <Text>
                {tabs}
                <Color red>
                  ✕ {children}
                </Color>
              </Text>
            </Box>
          );
        default:
          return;
      }
    }
    case "step":
      switch (TTS) {
        case "+":
          return (
            <Box>
              <Text>
                {tabs}
                <Color green>
                  ● </Color><Color white>{children}
                </Color>
              </Text>
            </Box>
          );
        case "x":
          return (
            <Box>
              <Text>
                {tabs}
                <Color red>
                  ▲ {children}
                </Color>
              </Text>
            </Box>
          );
        case "-":
          return (
            <Box>
              <Text>
                {tabs}
                <Color grey>
                  ○ {children}
                </Color>
              </Text>
            </Box>
          );
        case "w":
          return (
            <Box>
              <Text>
                {tabs}
                <Color yellow>
                  ▲ {children}
                </Color>
              </Text>
            </Box>
          );
        default:
          return;
      }
    case "asrt":
      switch (TTS) {
        case "+":
          return (
            <Box>
              <Text>
                {tabs}
                <Color green>
                  ✔
                </Color> <Color white>
                  {children}
                </Color>
              </Text>
            </Box>
          );
        case "x":
          return (
            <Box>
              <Text>
                {tabs}
                <Color red>
                  ✕ {children}
                </Color>
              </Text>
            </Box>
          );
        case "-":
          return (
            <Box>
              <Text>
                {tabs}
                <Color grey>
                  - {children}
                </Color>
              </Text>
            </Box>
          );
        default:
          return;
      }
    case "erro":
      return (
        <Box paddingY={1}>
          <Text>
            {tabs}
            <Color red>
              Error: {children}
            </Color>
          </Text>
        </Box>
      );
    default:
      return;
  }
};
