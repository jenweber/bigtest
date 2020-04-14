import React, { FC } from "react";
import { Text as InkText } from "ink";
import { useFocus } from "./Focusable";

interface TextProps {
  onEnter?: (text: string) => void
  bold?: boolean;
  italic?: boolean;
}

export const Text: FC<TextProps> = ({ children, ...props }) => {
  const { isFocused } = useFocus();

  return (
    <InkText underline={isFocused} {...props}>{children}</InkText>
  );
};

