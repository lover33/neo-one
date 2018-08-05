import ts from 'typescript';

import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { Helper } from '../Helper';

// Input: [arrayVal]
// Output: [val]
export class CreateArrayIterableIteratorHelper extends Helper {
  public emit(sb: ScriptBuilder, node: ts.Node, optionsIn: VisitOptions): void {
    const options = sb.pushValueOptions(optionsIn);
    // [1, val]
    sb.emitPushInt(node, 1);
    // [argsarr]
    sb.emitOp(node, 'PACK');
    // [classVal, argsarr]
    sb.emitHelper(node, options, sb.helpers.getArrayIterableIteratorClass);
    // [thisVal]
    sb.emitHelper(node, options, sb.helpers.new());

    if (!optionsIn.pushValue) {
      // []
      sb.emitOp(node, 'DROP');
    }
  }
}
