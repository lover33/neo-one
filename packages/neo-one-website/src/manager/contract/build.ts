import { scriptHashToAddress, SmartContractNetworksDefinitions, SourceMaps } from '@neo-one/client';
import { common, crypto } from '@neo-one/client-common';
import { genCommonBrowserFiles, genFiles } from '@neo-one/smart-contract-codegen';
import { defer, Observable, Subject } from 'rxjs';
import { DiagnosticCategory } from 'typescript';
import { EditorFile, EditorFiles } from '../../types';
import { compileContract } from './compileContract';
import { deployContract } from './deployContract';
import { findContracts } from './findContracts';
import { BuildProgress, CommonCodeContract } from './types';

export interface BuildOptions {
  readonly files: EditorFiles;
}

interface BuildWorkerOptions extends BuildOptions {
  readonly subject: Subject<BuildProgress>;
}

const buildWorker = async ({ files, subject }: BuildWorkerOptions): Promise<void> => {
  const networkName = 'local';
  subject.next({ type: 'progress', message: 'Scanning for contracts...' });
  const contractPaths = await findContracts({ files });
  if (contractPaths.length === 0) {
    throw new Error('No contracts found.');
  }

  const mutableSmartContractNetworkDefinitions: SmartContractNetworksDefinitions = {};
  const mutableContracts: CommonCodeContract[] = [];
  const mutableLinked: { [filePath: string]: { [name: string]: string } } = {};
  const mutableSourceMaps: Modifiable<SourceMaps> = {};

  // tslint:disable-next-line no-loop-statement
  for (const contractPath of contractPaths) {
    subject.next({ type: 'progress', message: `Compiling contract ${contractPath.name}` });
    const contract = await compileContract({
      filePath: contractPath.filePath,
      name: contractPath.name,
      linked: mutableLinked,
      files,
    });

    if (contract.diagnostics.some((diagnostic) => diagnostic.category === DiagnosticCategory.Error)) {
      throw new Error('Compilation error.');
    }

    const address = scriptHashToAddress(
      common.uInt160ToString(crypto.toScriptHash(Buffer.from(contract.contract.script, 'hex'))),
    );
    mutableSourceMaps[address] = contract.sourceMap;
    await deployContract(networkName, contract, Promise.resolve(mutableSourceMaps));

    mutableLinked[contractPath.filePath] = { [contractPath.name]: address };

    mutableContracts.push({
      ...contract,
      addresses: [address],
    });

    mutableSmartContractNetworkDefinitions[contract.name] = {
      [networkName]: { address },
    };
  }

  const generated = 'generated';
  const sourceMapsPath = `${generated}/sourceMaps.ts`;
  const testPath = `${generated}/test.ts`;
  const commonTypesPath = `${generated}/types.ts`;
  const reactPath = `${generated}/react.jts`;
  const clientPath = `${generated}/client.ts`;
  const projectIDPath = `${generated}/projectID.ts`;
  const generatedPath = `${generated}/index.ts`;

  const mutableFiles: EditorFile[] = [];

  subject.next({ type: 'progress', message: 'Generate code...' });
  mutableContracts.forEach((contractResult) => {
    const base = `${generated}/${contractResult.name}`;
    const typesPath = `${base}/types.ts`;
    const abiPath = `${base}/abi.ts`;
    const createContractPath = `${base}/contract.ts`;

    const { abi: abiContents, contract: contractContents, types: typesContents } = genFiles({
      name: contractResult.name,
      networksDefinition: mutableSmartContractNetworkDefinitions[contractResult.name],
      contractPath: contractResult.filePath,
      typesPath,
      abiPath,
      createContractPath,
      abi: contractResult.abi,
      sourceMapsPath,
    });

    mutableFiles.push({ path: typesPath, content: typesContents.ts, writable: false, type: 'typescript' });
    mutableFiles.push({ path: abiPath, content: abiContents.ts, writable: false, type: 'typescript' });
    mutableFiles.push({ path: createContractPath, content: contractContents.ts, writable: false, type: 'typescript' });
  });

  const {
    sourceMaps: sourceMapsContents,
    test: testContents,
    commonTypes: commonTypesContents,
    react: reactContents,
    client: clientContents,
    generated: generatedContents,
  } = genCommonBrowserFiles({
    contractsPaths: contractPaths,
    testPath,
    commonTypesPath,
    reactPath,
    clientPath,
    generatedPath,
    localDevNetworkName: networkName,
    wallets,
    networks: mutableSmartContractNetworkDefinitions,
    projectID: 'dummy',
    projectIDPath,
    sourceMapsPath,
    sourceMaps: mutableSourceMaps,
  });
};

export const build = (options: BuildOptions): Observable<BuildProgress> => {
  const subject = new Subject<BuildProgress>();
  buildWorker({ ...options, subject })
    .then(() => {
      subject.complete();
    })
    .catch((error) => {
      subject.error(error);
    });

  return subject;
};
