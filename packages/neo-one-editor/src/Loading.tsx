import { Monogram } from '@neo-one/react-common';
import * as React from 'react';
import { Box, Grid, keyframes, styled } from 'reakit';
import { prop } from 'styled-tools';

const fadeInOut = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.1;
  }

  100% {
    opacity: 1;
  }
`;

const LoadingWrapper = styled(Box)`
  padding-top: 96px;
  flex: 1 1 auto;
  min-height: 512px;
  background-color: ${prop('theme.gray6')};
`;

const MonogramWrapper = styled(Grid)`
  width: 100%;
  flex-direction: column;
  place-items: center;
  place-content: center;
  grid:
    'monogram' auto
    'text' auto
    / auto;
  grid-gap: 16px;
`;

const StyledMonogram = styled(Monogram)`
  animation: ${fadeInOut} 1.5s linear infinite;
`;

export const Loading = () => (
  <LoadingWrapper>
    <MonogramWrapper>
      <StyledMonogram />
    </MonogramWrapper>
  </LoadingWrapper>
);
