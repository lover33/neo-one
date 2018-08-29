import ts from 'typescript';
import { GlobalProperty, WellKnownSymbol } from '../../constants';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { Helper } from '../Helper';
import { clear, createDelete, ctor, getMap, has, size } from './common';

// Input: [val]
// Output: [val]
export class GetSetClassHelper extends Helper {
  public readonly needsGlobal: boolean = true;

  public emitGlobal(sb: ScriptBuilder, node: ts.Node, optionsIn: VisitOptions): void {
    const outerOptions = sb.pushValueOptions(optionsIn);

    // [number, globalObject]
    sb.emitPushInt(node, GlobalProperty.Set);
    // [classVal, number, globalObjectVal]
    sb.emitHelper(
      node,
      outerOptions,
      sb.helpers.createClass({
        ctor: ctor(sb, node),
        accessors: {
          size: size(sb, node),
        },
        prototypeMethods: {
          clear: clear(sb, node),
          delete: createDelete(sb, node),
          has: has(sb, node),
          forEach: (innerOptions) => {
            // [argsarr]
            sb.emitPushInt(node, 0);
            // [objectVal]
            sb.emitOp(node, 'PICKITEM');
            // [this, objectVal]
            sb.scope.getThis(sb, node, innerOptions);
            // [map, objectVal]
            getMap(sb, node)(innerOptions);
            // [iterator, objectVal]
            sb.emitSysCall(node, 'Neo.Iterator.Create');
            // [enumerator, objectVal]
            sb.emitSysCall(node, 'Neo.Iterator.Keys');
            // [objectVal, map]
            sb.emitOp(node, 'SWAP');
            // []
            sb.emitHelper(node, innerOptions, sb.helpers.rawEnumeratorForEachFunc);
          },
          add: (innerOptions) => {
            // [this, argsarr]
            sb.scope.getThis(sb, node, innerOptions);
            // [this, argsarr, this]
            sb.emitOp(node, 'TUCK');
            // [map, argsarr, this]
            getMap(sb, node)(innerOptions);
            // [argsarr, map, this]
            sb.emitOp(node, 'SWAP');
            // [length, keyVal, map, this]
            sb.emitOp(node, 'UNPACK');
            // [keyVal, map, this]
            sb.emitOp(node, 'DROP');
            // [val, keyVal, map, this]
            sb.emitPushBoolean(node, true);
            // [this]
            sb.emitOp(node, 'SETITEM');
          },
        },
        prototypeSymbolMethods: {
          [WellKnownSymbol.iterator]: (innerOptions) => {
            // []
            sb.emitOp(node, 'DROP');
            // [thisObjectVal]
            sb.scope.getThis(sb, node, innerOptions);
            // [map]
            getMap(sb, node)(innerOptions);
            // [iterator]
            sb.emitSysCall(node, 'Neo.Iterator.Create');
            // [enumerator]
            sb.emitSysCall(node, 'Neo.Iterator.Keys');
            // [val]
            sb.emitHelper(node, innerOptions, sb.helpers.createGenericEnumeratorIterableIterator);
          },
        },
      }),
    );
    // []
    sb.emitOp(node, 'SETITEM');
  }

  public emit(sb: ScriptBuilder, node: ts.Node, options: VisitOptions): void {
    if (!options.pushValue) {
      return;
    }
    // [classVal]
    sb.emitHelper(node, options, sb.helpers.getGlobalProperty({ property: GlobalProperty.Set }));
  }
}
