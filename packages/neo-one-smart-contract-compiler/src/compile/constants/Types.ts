export enum Types {
  Undefined = 0,
  Null = 1,
  Boolean = 2,
  String = 3,
  Symbol = 4,
  Number = 5,
  Object = 6,
  Array = 7,
  Buffer = 8,
  Map = 9,
  Set = 10,
  Enumerator = 11,
  Iterator = 12,
  Transaction = 13,
  Output = 14,
  Attribute = 15,
  Input = 16,
  Account = 17,
  Asset = 18,
  Contract = 19,
  Header = 20,
  Block = 21,
}

export type WrappableType =
  | Types.Boolean
  | Types.String
  | Types.Symbol
  | Types.Number
  | Types.Object
  | Types.Array
  | Types.Buffer
  | Types.Map
  | Types.Set
  | Types.Enumerator
  | Types.Iterator
  | Types.Transaction
  | Types.Output
  | Types.Attribute
  | Types.Input
  | Types.Account
  | Types.Asset
  | Types.Contract
  | Types.Header
  | Types.Block;

export enum ArraySubType {
  Array = 0,
  ArrayStorage = 1,
}
export enum MapSubType {
  Map = 0,
  MapStorage = 1,
}
export enum SetSubType {
  Set = 0,
  SetStorage = 1,
}

export type SubTypes = ArraySubType | MapSubType | SetSubType;
