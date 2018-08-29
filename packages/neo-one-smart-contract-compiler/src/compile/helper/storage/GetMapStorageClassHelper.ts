import ts from 'typescript';
import { GlobalProperty, WellKnownSymbol } from '../../constants';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { Helper } from '../Helper';
import {
  createClear,
  createConstructor,
  createDelete,
  createForEach,
  createGet,
  createGetKey,
  createHas,
  createIterator,
  createSet,
  createSize,
} from './common';

// Input: [val]
// Output: [val]
export class GetMapStorageClassHelper extends Helper {
  public readonly needsGlobal: boolean = true;

  public emitGlobal(sb: ScriptBuilder, node: ts.Node, optionsIn: VisitOptions): void {
    const outerOptions = sb.pushValueOptions(optionsIn);

    const getKey = createGetKey(sb, node);

    // [number, globalObject]
    sb.emitPushInt(node, GlobalProperty.MapStorage);
    // [classVal, number, globalObjectVal]
    sb.emitHelper(
      node,
      outerOptions,
      sb.helpers.createClass({
        superClass: (innerOptions) => {
          sb.emitHelper(node, innerOptions, sb.helpers.getMapClass);
        },
        ctor: createConstructor(sb, node),
        accessors: {
          size: createSize(sb, node),
        },
        prototypeMethods: {
          clear: createClear(sb, node),
          delete: createDelete(sb, node, getKey),
          forEach: createForEach(sb, node, (innerOptions) => {
            // [objectVal, iterator]
            sb.emitOp(node, 'SWAP');
            // []
            sb.emitHelper(node, innerOptions, sb.helpers.rawIteratorForEachFunc);
          }),
          get: createGet(sb, node, getKey),
          has: createHas(sb, node, getKey),
          set: createSet(sb, node, getKey, () => {
            // [argsarr, buffer]
            sb.emitOp(node, 'SWAP');
            // [1, argsarr, buffer]
            sb.emitPushInt(node, 1);
            // [val, buffer]
            sb.emitOp(node, 'PICKITEM');
          }),
        },
        prototypeSymbolMethods: {
          [WellKnownSymbol.iterator]: createIterator(sb, node, (innerOptions) => {
            // [val]
            sb.emitHelper(node, innerOptions, sb.helpers.createGenericIteratorIterableIterator);
          }),
        },
      }),
    );
    // []
    sb.emitOp(node, 'SETITEM');
  }

  public emit(sb: ScriptBuilder, node: ts.Node, options: VisitOptions): void {
    if (!options.pushValue) {
      /* istanbul ignore next */
      return;
    }
    // [classVal]
    sb.emitHelper(node, options, sb.helpers.getGlobalProperty({ property: GlobalProperty.MapStorage }));
  }
}
