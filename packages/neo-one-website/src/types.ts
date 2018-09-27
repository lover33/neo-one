import * as React from 'react';

// tslint:disable-next-line no-any
export type ComponentProps<C extends React.ComponentType<any>> = C extends React.ComponentType<infer P> ? P : never;

export type EditorFiles = ReadonlyArray<EditorFile>;

export type EditorFileType = 'typescript' | 'contract';

export interface EditorFile {
  readonly path: string;
  readonly content: string;
  readonly writable: boolean;
  readonly type: EditorFileType;
}
