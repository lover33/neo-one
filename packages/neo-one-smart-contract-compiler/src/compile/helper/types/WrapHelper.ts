import ts from 'typescript';
import { Types } from '../../constants';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { Helper } from '../Helper';

// Input: [value]
// Output: [val]
export abstract class WrapHelper extends Helper {
  protected readonly length: number = 2;
  protected abstract readonly type: Types;

  public emit(sb: ScriptBuilder, node: ts.Node, options: VisitOptions): void {
    if (!options.pushValue) {
      sb.emitOp(node, 'DROP');

      return;
    }

    // [0, value]
    sb.emitPushInt(node, 0);
    // [struct, value]
    sb.emitOp(node, 'NEWSTRUCT');
    // [struct, struct, value]
    sb.emitOp(node, 'DUP');
    if (this.length === 2) {
      // [value, struct, struct]
      sb.emitOp(node, 'ROT');
      // [struct, value, struct, struct]
      sb.emitOp(node, 'OVER');
      // [type, struct, value, struct, struct]
      sb.emitPushInt(node, this.type);
      // [value, struct, struct]
      sb.emitOp(node, 'APPEND');
      // [struct]
      sb.emitOp(node, 'APPEND');
    } else {
      // [type, struct, struct]
      sb.emitPushInt(node, this.type);
      // [struct]
      sb.emitOp(node, 'APPEND');
    }
  }
}
