import ts from 'typescript';
import { GlobalProperty } from '../../constants';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { Helper } from '../Helper';

// Input: [keyBuffer, valBuffer]
// Output: [value]
export class PutCommonStorageHelper extends Helper {
  public readonly needsGlobal: boolean = true;
  public readonly needsGlobalOut = true;

  public emitGlobal(sb: ScriptBuilder, node: ts.Node, optionsIn: VisitOptions): void {
    const options = sb.pushValueOptions(optionsIn);
    // [number, globalObject]
    sb.emitPushInt(node, GlobalProperty.CommonStorage);
    // [buffer, number, globalObject]
    sb.emitPushBuffer(node, Buffer.alloc(0, 0));
    // [value, number, globalObject]
    sb.emitHelper(node, options, sb.helpers.getStorageBase);
    sb.emitHelper(
      node,
      options,
      sb.helpers.handleUndefinedStorage({
        handleUndefined: () => {
          // [map, number, globalObject]
          sb.emitOp(node, 'NEWMAP');
        },
        handleDefined: () => {
          // [map, number, globalObject]
          sb.emitSysCall(node, 'Neo.Runtime.Deserialize');
        },
      }),
    );
    // []
    sb.emitOp(node, 'SETITEM');
  }

  public emitGlobalOut(sb: ScriptBuilder, node: ts.Node): void {
    // [number, globalObject]
    sb.emitPushInt(node, GlobalProperty.CommonStorage);
    // [map]
    sb.emitOp(node, 'PICKITEM');
    // [buffer]
    sb.emitSysCall(node, 'Neo.Runtime.Serialize');
    // [keyBuffer, valueBuffer]
    sb.emitPushBuffer(node, Buffer.alloc(0, 0));
    // [context, keyBuffer, valBuffer]
    sb.emitSysCall(node, 'Neo.Storage.GetContext');
    // []
    sb.emitSysCall(node, 'Neo.Storage.Put');
  }

  public emit(sb: ScriptBuilder, node: ts.Node, options: VisitOptions): void {
    if (!options.pushValue) {
      /* istanbul ignore next */
      return;
    }
    // [map, valBuffer, keyBuffer]
    sb.emitOp(node, 'SWAP');
    // [map, valBuffer, keyBuffer]
    sb.emitHelper(node, options, sb.helpers.getGlobalProperty({ property: GlobalProperty.CommonStorage }));
    // [keyBuffer, map, valBuffer]
    sb.emitOp(node, 'ROT');
    // [valBuffer, keyBuffer, map]
    sb.emitOp(node, 'ROT');
    // []
    sb.emitOp(node, 'SETITEM');
  }
}
