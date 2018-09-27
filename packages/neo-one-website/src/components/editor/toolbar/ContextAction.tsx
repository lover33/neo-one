// tslint:disable no-null-keyword
import * as React from 'react';
import { MdLoop, MdPlayArrow } from 'react-icons/md';
import { connect } from 'react-redux';
import { as, Grid, keyframes, styled } from 'reakit';
import { Observable } from 'rxjs';
import { appendConsole } from '../redux';
import { EditorFile } from '../types';
import { Text } from './Text';
import { Wrapper } from './Wrapper';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const Loop = styled(MdLoop)`
  animation: ${rotate} 1.5s linear infinite;
`;

const GridWrapper = styled(as(Text)(Grid))`
  gap: 2px;
  grid-auto-flow: column;
`;

interface Actions {
  // tslint:disable-next-line readonly-keyword
  [path: string]: boolean;
}

const mutableTakingAction: Actions = {};

interface Props {
  readonly file: EditorFile;
  readonly build: (file: EditorFile) => Observable<string>;
  readonly onConsoleMessage: (value: string) => void;
}

const ContextActionBase = ({ file, build, onConsoleMessage }: Props) => {
  let text: string | undefined;
  let action: ((file: EditorFile) => Observable<string>) | undefined;
  if (file.type === 'contract') {
    text = 'Build';
    action = build;
  }

  if (text === undefined || action === undefined) {
    return null;
  }

  const actionConst = action;

  return (
    <Wrapper
      disabled={mutableTakingAction[file.path]}
      onClick={() => {
        mutableTakingAction[file.path] = true;
        actionConst(file).subscribe({
          next: (value) => {
            onConsoleMessage(value);
          },
          complete: () => {
            mutableTakingAction[file.path] = false;
          },
          error: (error: Error) => {
            mutableTakingAction[file.path] = false;
            onConsoleMessage(error.stack === undefined ? error.message : error.stack);
          },
        });
      }}
    >
      <GridWrapper>
        {mutableTakingAction[file.path] ? <Loop /> : <MdPlayArrow />}
        {text}
      </GridWrapper>
    </Wrapper>
  );
};

export const ContextAction = connect(
  undefined,
  (dispatch) => ({
    onConsoleMessage: (value: string) => dispatch(appendConsole(value)),
  }),
)(ContextActionBase);
