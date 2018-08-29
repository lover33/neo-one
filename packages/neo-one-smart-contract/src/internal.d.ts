// tslint:disable
/// <reference path="./global.d.ts" />
import { Contract, SerializableKey, SerializableValue, SmartContractValue } from './index';

export function getArgument<T extends SmartContractValue>(idx: number): T;
export function doReturn(): void;
export function doReturn(value: SmartContractValue): void;
export function destroy(): void;
export function create(
  script: Buffer,
  parameterList: Buffer,
  returnType: number,
  properties: number,
  contractName: string,
  codeVersion: string,
  author: string,
  email: string,
  description: string,
): Contract;
export function migrate(
  script: Buffer,
  parameterList: Buffer,
  returnType: number,
  properties: number,
  contractName: string,
  codeVersion: string,
  author: string,
  email: string,
  description: string,
): Contract;
export function putStorage(key: SerializableValue, value: SerializableValue): void;
export function getStorage<T extends SerializableValue>(key: SerializableValue): T;
export const trigger: number;

export interface MapStorage<K extends SerializableKey, V extends SerializableValue> extends Map<K, V> {}
export interface MapStorageConstructor extends MapConstructor {
  new <K extends SerializableKey, V extends SerializableValue>(prefix?: Buffer): MapStorage<K, V>;
}
export const MapStorage: MapStorageConstructor;

export interface SetStorage<V extends SerializableKey> extends Set<V> {}
export interface SetStorageConstructor extends SetConstructor {
  new <K extends SerializableKey>(prefix: Buffer): SetStorage<K>;
}
export const SetStorage: SetStorageConstructor;
