import ts from 'typescript';

import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { Helper } from '../Helper';

// Input: [iterator]
// Output: [val]
export class CreateGenericIteratorIterableIteratorHelper extends Helper {
  public emit(sb: ScriptBuilder, node: ts.Node, optionsIn: VisitOptions): void {
    const options = sb.pushValueOptions(optionsIn);
    // [1, val]
    sb.emitPushInt(node, 1);
    // [argsarr]
    sb.emitOp(node, 'PACK');
    // [classVal, argsarr]
    sb.emitHelper(node, options, sb.helpers.getGenericIteratorIterableIteratorClass);
    // [thisVal]
    sb.emitHelper(node, options, sb.helpers.new());

    if (!optionsIn.pushValue) {
      // []
      /* istanbul ignore next */
      sb.emitOp(node, 'DROP');
    }
  }
}
