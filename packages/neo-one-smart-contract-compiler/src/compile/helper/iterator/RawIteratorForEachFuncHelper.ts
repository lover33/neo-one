import ts from 'typescript';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { Helper } from '../Helper';

// Input: [objectVal, iterator]
// Output: []
export class RawIteratorForEachFuncHelper extends Helper {
  public emit(sb: ScriptBuilder, node: ts.Node, optionsIn: VisitOptions): void {
    const options = sb.pushValueOptions(optionsIn);

    // [callable, iterator]
    sb.emitHelper(node, options, sb.helpers.getCallable({}));
    // [iterator, callable]
    sb.emitOp(node, 'SWAP');
    sb.emitHelper(
      node,
      options,
      sb.helpers.forLoop({
        condition: () => {
          // [iterator, iterator, callable]
          sb.emitOp(node, 'DUP');
          // [boolean, iterator, callable]
          sb.emitSysCall(node, 'Neo.Enumerator.Next');
        },
        each: (innerOptions) => {
          // [iterator, iterator, callable]
          sb.emitOp(node, 'DUP');
          // [key, iterator, callable]
          sb.emitSysCall(node, 'Neo.Iterator.Key');
          // [iterator, key, iterator, callable]
          sb.emitOp(node, 'OVER');
          // [value, key, iterator, callable]
          sb.emitSysCall(node, 'Neo.Enumerator.Value');
          // [2, value, key, iterator, callable]
          sb.emitPushInt(node, 2);
          // [argsarr, iterator, callable]
          sb.emitOp(node, 'PACK');
          // [2, argsarr, iterator, callable]
          sb.emitPushInt(node, 2);
          // [callable, argsarr, iterator, callable]
          sb.emitOp(node, 'PICK');
          // [iterator, callable]
          sb.emitHelper(node, sb.noPushValueOptions(innerOptions), sb.helpers.call);
        },
      }),
    );
    // []
    sb.emitOp(node, 'DROP');
  }
}
