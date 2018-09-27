import * as React from 'react';
import { MonacoEditor } from './MonacoEditor';
import { EditorFile, EditorFiles, EditorFileType, FileDiagnostic, TextRange } from './types';

interface Props {
  readonly selectedFile: EditorFile;
  readonly range?: TextRange;
  readonly files: EditorFiles;
  readonly extraFiles?: EditorFiles;
  readonly onChangeFile: (file: EditorFile) => void;
  readonly onChangeProblems?: (path: string, diagnostics: ReadonlyArray<FileDiagnostic>) => void;
}

const getType = (type: EditorFileType): 'typescript-smart-contract' | 'typescript' =>
  type === 'contract' ? 'typescript-smart-contract' : 'typescript';

export const EditorView = ({
  selectedFile,
  range,
  files,
  extraFiles,
  onChangeFile,
  onChangeProblems,
  ...props
}: Props) => (
  <MonacoEditor
    {...props}
    file={{
      path: selectedFile.path,
      content: selectedFile.content,
      language: getType(selectedFile.type),
    }}
    range={range}
    entries={files.concat(extraFiles === undefined ? [] : extraFiles).map((file) => ({
      path: file.path,
      content: file.content,
      language: getType(file.type),
    }))}
    readOnly={!selectedFile.writable}
    onValueChange={(content) => onChangeFile({ ...selectedFile, content })}
    onUpdateDiagnostics={onChangeProblems}
  />
);
