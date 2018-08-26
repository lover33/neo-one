import * as React from 'react';
import { Base, styled } from 'reakit';
import { prop } from 'styled-tools';
import { WithAddToast } from './ToastsContainer';

export type AddError = (error: Error) => void;

const ErrorText = styled(Base)`
  color: ${prop('theme.error')};
`;

interface WithAddErrorProps {
  readonly children: (addError: AddError) => React.ReactNode;
}

// tslint:disable-next-line no-let
let mutableID = 0;

const StyledPre = styled.pre`
  white-space: pre-wrap;
`;

export function WithAddError({ children }: WithAddErrorProps) {
  return (
    <WithAddToast>
      {(addToast) =>
        children((error) => {
          // tslint:disable-next-line no-console
          console.error(error.stack === undefined ? error : error.stack);
          addToast({
            id: `error:${mutableID}`,
            title: (
              <span>
                <ErrorText as="span">Error.&nbsp;</ErrorText>
                <span>See console for more info.</span>
              </span>
            ),
            message: <StyledPre>{error.message}</StyledPre>,
          });
          mutableID += 1;
        })
      }
    </WithAddToast>
  );
}
