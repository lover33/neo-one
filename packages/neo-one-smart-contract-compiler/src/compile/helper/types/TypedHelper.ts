import ts from 'typescript';
import { SubTypes, Types } from '../../constants';
import { Helper } from '../Helper';

export interface TypedHelperOptions {
  readonly type: ts.Type | undefined;
  readonly knownType?: Types;
  readonly knownSubType?: SubTypes;
}

export abstract class TypedHelper<Node extends ts.Node = ts.Node> extends Helper<Node> {
  protected readonly type: ts.Type | undefined;
  protected readonly knownType: Types | undefined;
  protected readonly knownSubType: SubTypes | undefined;

  public constructor({ knownType, type, knownSubType }: TypedHelperOptions) {
    super();
    this.type = type;
    this.knownType = knownType;
    this.knownSubType = knownSubType;
  }
}
