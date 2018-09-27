import { compileContract as compileContractBase } from '@neo-one/smart-contract-compiler';
import { createCompilerHost } from './createCompilerHost';
import { handleWorker } from './handleWorker';
import { CompileContractOptions, ContractResult } from './types';

handleWorker(
  // tslint:disable-next-line no-any
  self as any,
  async ({ filePath, name, linked, ...rest }: CompileContractOptions): Promise<ContractResult> => {
    const compileResult = compileContractBase(filePath, name, createCompilerHost(rest), linked);
    const sourceMap = await compileResult.sourceMap;

    return {
      ...compileResult,
      sourceMap,
      filePath,
      name,
    };
  },
);

// tslint:disable-next-line no-any
const CompileContractWorker: () => Worker = undefined as any;

// tslint:disable-next-line no-default-export export-name
export default CompileContractWorker;
