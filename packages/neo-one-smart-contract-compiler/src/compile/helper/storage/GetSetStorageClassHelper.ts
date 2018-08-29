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
  createGetKey,
  createHas,
  createIterator,
  createSet,
  createSize,
} from './common';

// Input: [val]
// Output: [val]
export class GetSetStorageClassHelper extends Helper {
  public readonly needsGlobal: boolean = true;

  public emitGlobal(sb: ScriptBuilder, node: ts.Node, optionsIn: VisitOptions): void {
    const outerOptions = sb.pushValueOptions(optionsIn);

    const getKey = createGetKey(sb, node);

    // [number, globalObject]
    sb.emitPushInt(node, GlobalProperty.SetStorage);
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
            // [enumerator, objectVal]
            sb.emitSysCall(node, 'Neo.Iterator.Keys');
            // [objectVal, enumerator]
            sb.emitOp(node, 'SWAP');
            // []
            sb.emitHelper(node, innerOptions, sb.helpers.rawEnumeratorForEachFunc);
          }),
          has: createHas(sb, node, getKey),
          add: createSet(sb, node, getKey, (innerOptions) => {
            // [buffer]
            sb.emitOp(node, 'NIP');
            // [boolean, buffer]
            sb.emitPushBoolean(node, true);
            // [val, buffer]
            sb.emitHelper(node, innerOptions, sb.helpers.wrapBoolean);
          }),
        },
        prototypeSymbolMethods: {
          [WellKnownSymbol.iterator]: createIterator(sb, node, (innerOptions) => {
            // [enumerator]
            sb.emitSysCall(node, 'Neo.Iterator.Keys');
            // [val]
            sb.emitHelper(node, innerOptions, sb.helpers.createGenericEnumeratorIterableIterator);
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
    sb.emitHelper(node, options, sb.helpers.getGlobalProperty({ property: GlobalProperty.SetStorage }));
  }
}
