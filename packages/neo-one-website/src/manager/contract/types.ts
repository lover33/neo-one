import { CompileContractResult, LinkedContracts } from '@neo-one/smart-contract-compiler';
import { RawSourceMap } from 'source-map';
import { EditorFiles } from '../../types';

export interface CompilerHostOptions {
  readonly files: EditorFiles;
}

export interface FindContractsOptions extends CompilerHostOptions {}

export interface CompileContractOptions extends CompilerHostOptions {
  readonly filePath: string;
  readonly name: string;
  readonly linked: LinkedContracts;
}

interface Progress {
  readonly type: 'progress';
  readonly message: string;
}

interface Complete {
  readonly type: 'complete';
}

export type BuildProgress = Progress | Complete;

export type ContractResult = Omit<CompileContractResult, 'sourceMap'> & {
  readonly filePath: string;
  readonly name: string;
  readonly sourceMap: RawSourceMap;
};

export type CommonCodeContract = ContractResult & {
  readonly addresses: ReadonlyArray<string>;
};
