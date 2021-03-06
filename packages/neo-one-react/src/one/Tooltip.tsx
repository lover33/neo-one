import * as React from 'react';
import { styled, Tooltip as TooltipBase } from 'reakit';
import { prop } from 'styled-tools';
import { ComponentProps } from '../types';

export const StyledTooltip = styled(TooltipBase)`
  background-color: ${prop('theme.gray5')};
  border-color: ${prop('theme.gray5')};
  color: ${prop('theme.gray0')};
  padding: 8px;
`;

export function Tooltip(props: ComponentProps<typeof StyledTooltip>) {
  return <StyledTooltip fade slide {...props} />;
}

export const TooltipArrow = styled(TooltipBase.Arrow)`
  border-color: ${prop('theme.gray5')};
  color: ${prop('theme.gray5')};

  &&& > svg > path {
    fill: currentColor;
  }
`;
