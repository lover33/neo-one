import { Contracts } from '@neo-one/smart-contract-compiler';
import { callWorker } from './callWorker';
import FindContractsWorker from './findContracts.worker';
import { FindContractsOptions } from './types';

export const findContracts = async (options: FindContractsOptions): Promise<Contracts> =>
  callWorker({
    name: 'findContracts',
    createWorker: FindContractsWorker,
    options,
  });
