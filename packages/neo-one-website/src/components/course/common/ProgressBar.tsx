import { Tooltip, TooltipArrow } from '@neo-one/react';
import * as React from 'react';
import { Link } from 'react-static';
import { as, Block, Box, Grid, styled } from 'reakit';
import { prop, switchProp } from 'styled-tools';

interface Props {
  readonly current?: number;
  readonly items: ReadonlyArray<{
    readonly complete: boolean;
    readonly title: string;
    readonly to: string;
  }>;
}

const SegmentBase = styled(Box)<{ readonly bg: 'current' | 'complete' | 'incomplete' }>`
  /* stylelint-disable-next-line */
  background-color: ${switchProp('bg', {
    current: prop('theme.primaryDark'),
    complete: prop('theme.primary'),
    incomplete: prop('theme.accent'),
  })};
  height: 100%;
  display: block;
`;

const Segment = as(Link)(SegmentBase);

export const ProgressBar = ({ current, items }: Props) => (
  <Grid column gap={4} height="8px">
    {items.map((item, idx) => (
      <Block key={idx} relative>
        {idx === current || item.complete || idx === 0 || items[idx - 1].complete ? (
          <Segment
            to={item.to}
            key={idx}
            bg={idx === current ? 'current' : item.complete ? 'complete' : 'incomplete'}
          />
        ) : (
          <SegmentBase key={idx} bg="incomplete" />
        )}

        <Tooltip placement="bottom">
          <TooltipArrow />
          {item.title}
        </Tooltip>
      </Block>
    ))}
  </Grid>
);
