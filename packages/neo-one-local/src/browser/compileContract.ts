import { callWorker } from './callWorker';
import CompileContractWorker from './compileContract.worker';
import { CompileContractOptions, ContractResult } from './types';

export const compileContract = async (options: CompileContractOptions): Promise<ContractResult> =>
  callWorker({
    name: 'compileContract',
    createWorker: CompileContractWorker,
    options,
  });
