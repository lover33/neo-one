import ts from 'typescript';
import { Types } from '../../../constants';
import { ScriptBuilder } from '../../../sb';
import { VisitOptions } from '../../../types';
import { TypedHelper, TypedHelperOptions } from '../../types';

export interface ArrayForEachHelperOptions extends TypedHelperOptions {
  readonly each: (options: VisitOptions) => void;
  readonly withIndex?: boolean;
}

// Input: [arrayVal]
// Output: []
export abstract class ArrayEnumeratorHelper extends TypedHelper {
  private readonly each: (options: VisitOptions) => void;
  private readonly withIndex: boolean;

  public constructor({ each, withIndex = false, type, knownType, knownSubType }: ArrayForEachHelperOptions) {
    super({ type, knownType, knownSubType });
    this.each = each;
    this.withIndex = withIndex;
  }

  public emit(sb: ScriptBuilder, node: ts.Node, optionsIn: VisitOptions): void {
    const options = sb.pushValueOptions(optionsIn);

    const handleArray = (innerOptions: VisitOptions) => {
      // [arr]
      sb.emitHelper(node, innerOptions, sb.helpers.unwrapArrayArray);
      // [enumerator]
      sb.emitSysCall(node, 'Neo.Enumerator.Create');
    };

    const handleArrayStorage = (innerOptions: VisitOptions) => {
      sb.emitHelper(node, innerOptions, sb.helpers.createContainerStorageIterator);
    };

    sb.emitHelper(
      node,
      options,
      sb.helpers.forArrayType({
        type: this.type,
        knownType: Types.Array,
        knownSubType: this.knownSubType,
        array: handleArray,
        arrayStorage: handleArrayStorage,
      }),
    );
    sb.emitHelper(
      node,
      options,
      sb.helpers.rawEnumeratorForEach({
        withIndex: this.withIndex,
        each: this.each,
      }),
    );
  }
}
