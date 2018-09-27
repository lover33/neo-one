import { Contracts, scan } from '@neo-one/smart-contract-compiler';
import { createCompilerHost } from './createCompilerHost';
import { handleWorker } from './handleWorker';
import { FindContractsOptions } from './types';

handleWorker(
  // tslint:disable-next-line no-any
  self as any,
  async (options: FindContractsOptions): Promise<Contracts> => scan('', createCompilerHost(options)),
);

// tslint:disable-next-line no-any
const FindContractsWorker: () => Worker = undefined as any;

// tslint:disable-next-line no-default-export export-name
export default FindContractsWorker;
