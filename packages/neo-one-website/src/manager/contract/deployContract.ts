import { common, crypto } from '@neo-one/client-common';
import {
  AddressString,
  Client,
  DeveloperClient,
  LocalKeyStore,
  LocalMemoryStore,
  LocalUserAccountProvider,
  NEOONEDataProvider,
  NEOONEProvider,
  SourceMaps,
  wifToPrivateKey,
} from '@neo-one/client-full';
import { JSONRPCLocalProvider } from '@neo-one/node-browser';
import BigNumber from 'bignumber.js';
import { constants } from './constants';
import { ContractResult } from './types';

export const deployContract = async (
  networkName: string,
  contract: ContractResult,
  sourceMaps: Promise<SourceMaps>,
): Promise<AddressString> => {
  crypto.addPublicKey(
    common.stringToPrivateKey(wifToPrivateKey(constants.PRIVATE_NET_PRIVATE_KEY)),
    common.stringToECPoint(constants.PRIVATE_NET_PUBLIC_KEY),
  );

  const keystore = new LocalKeyStore({
    store: new LocalMemoryStore(),
  });
  await keystore.addAccount({
    network: networkName,
    name: 'master',
    privateKey: wifToPrivateKey(constants.PRIVATE_NET_PRIVATE_KEY),
  });
  const provider = new NEOONEProvider([
    new NEOONEDataProvider({ network: networkName, rpcURL: new JSONRPCLocalProvider() }),
  ]);
  const localUserAccountProvider = new LocalUserAccountProvider({
    keystore,
    provider,
  });
  const providers = {
    memory: localUserAccountProvider,
  };
  const client = new Client(providers);
  const developerClient = new DeveloperClient(provider.read(networkName));

  const hash = crypto.toScriptHash(Buffer.from(contract.contract.script, 'hex'));
  try {
    const existing = await client.read(networkName).getContract(common.uInt160ToString(hash));

    return existing.address;
  } catch {
    // do nothing
  }

  const result = await client.publishAndDeploy(
    contract.contract,
    contract.abi,
    [],
    { systemFee: new BigNumber(-1) },
    sourceMaps,
  );
  const [receipt] = await Promise.all([result.confirmed(), developerClient.runConsensusNow()]);

  if (receipt.result.state === 'FAULT') {
    throw new Error(receipt.result.message);
  }

  return receipt.result.value.address;
};
