import { Builtins } from '../Builtins';
import { add as addAccount } from './account';
import { add as addAddress } from './address';
import { add as addAsset } from './asset';
import { add as addAssetType } from './assetType';
import { add as addAttribute } from './attribute';
import { add as addAttributeUsage } from './attributeUsage';
import { add as addBlock } from './block';
import { add as addBlockchain } from './blockchain';
import { add as addContract } from './contract';
import { add as addCreateEventNotifier } from './createEventNotifier';
import { add as addDeploy } from './deploy';
import { add as addHash256 } from './hash256';
import { add as addHeader } from './header';
import { add as addInput } from './input';
import { add as addInternal } from './internal';
import { add as addLinkedSmartContract } from './linkedSmartContract';
import { add as addOutput } from './output';
import { add as addPublicKey } from './publicKey';
import { add as addSmartContract } from './smartContract';
import { add as addTransaction } from './transaction';
import { add as addTransactionType } from './transactionType';

// tslint:disable-next-line export-name
export const add = (builtins: Builtins): void => {
  addAccount(builtins);
  addAddress(builtins);
  addHash256(builtins);
  addInternal(builtins);
  addPublicKey(builtins);
  addAttribute(builtins);
  addInput(builtins);
  addOutput(builtins);
  addTransaction(builtins);
  addAsset(builtins);
  addAssetType(builtins);
  addAttributeUsage(builtins);
  addBlock(builtins);
  addBlockchain(builtins);
  addContract(builtins);
  addCreateEventNotifier(builtins);
  addHeader(builtins);
  addTransactionType(builtins);
  addSmartContract(builtins);
  addLinkedSmartContract(builtins);
  addDeploy(builtins);
};
