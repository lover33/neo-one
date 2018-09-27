import { CompileContractResult, LinkedContracts } from '@neo-one/smart-contract-compiler';
import { RawSourceMap } from 'source-map';

export interface EditorFile {
  readonly path: string;
  readonly content: string;
}

export type EditorFiles = ReadonlyArray<EditorFile>;

export interface CompilerHostOptions {
  readonly files: EditorFiles;
}

export interface FindContractsOptions extends CompilerHostOptions {}

export interface CompileContractOptions extends CompilerHostOptions {
  readonly filePath: string;
  readonly name: string;
  readonly linked: LinkedContracts;
}

export type ContractResult = Omit<CompileContractResult, 'sourceMap'> & {
  readonly filePath: string;
  readonly name: string;
  readonly sourceMap: RawSourceMap;
};

export type CommonCodeContract = ContractResult & {
  readonly addresses: ReadonlyArray<string>;
};

export interface ConsoleMessage {
  readonly message: string;
}
