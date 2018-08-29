import ts from 'typescript';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { Helper } from '../Helper';

export interface RawEnumeratorForEachHelperOptions {
  readonly each: (options: VisitOptions) => void;
  readonly withIndex?: boolean;
}

// Input: [enumerator]
// Output: []
export class RawEnumeratorForEachHelper extends Helper {
  private readonly each: (options: VisitOptions) => void;
  private readonly withIndex: boolean;

  public constructor({ each, withIndex = false }: RawEnumeratorForEachHelperOptions) {
    super();
    this.each = each;
    this.withIndex = withIndex;
  }

  public emit(sb: ScriptBuilder, node: ts.Node, optionsIn: VisitOptions): void {
    const options = sb.pushValueOptions(optionsIn);

    if (this.withIndex) {
      // [idx, enumerator]
      sb.emitPushInt(node, 0);
      sb.emitHelper(
        node,
        options,
        sb.helpers.forLoop({
          condition: () => {
            // [enumerator, idx, enumerator]
            sb.emitOp(node, 'OVER');
            // [boolean, enumerator]
            sb.emitSysCall(node, 'Neo.Enumerator.Next');
          },
          each: (innerOptions) => {
            // [idx, enumerator, idx]
            sb.emitOp(node, 'TUCK');
            // [enumerator, idx, enumerator, idx]
            sb.emitOp(node, 'OVER');
            // [value, enumerator, idx]
            sb.emitSysCall(node, 'Neo.Enumerator.Value');
            // [enumerator, idx]
            this.each(innerOptions);
            // [idx, enumerator]
            sb.emitOp(node, 'SWAP');
            // [idx, enumerator]
            sb.emitOp(node, 'INC');
          },
        }),
      );
      // [enumerator]
      sb.emitOp(node, 'DROP');
    } else {
      sb.emitHelper(
        node,
        options,
        sb.helpers.forLoop({
          condition: () => {
            // [enumerator, enumerator]
            sb.emitOp(node, 'DUP');
            // [boolean, enumerator]
            sb.emitSysCall(node, 'Neo.Enumerator.Next');
          },
          each: (innerOptions) => {
            // [enumerator]
            sb.emitOp(node, 'DUP');
            // [value, enumerator]
            sb.emitSysCall(node, 'Neo.Enumerator.Value');
            // [enumerator]
            this.each(innerOptions);
          },
        }),
      );
    }
    // []
    sb.emitOp(node, 'DROP');
  }
}
