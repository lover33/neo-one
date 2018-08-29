import ts from 'typescript';
import { GlobalProperty, WellKnownSymbol } from '../../constants';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { Helper } from '../Helper';
import { clear, createDelete, ctor, getMap, has, size } from './common';

// Input: [val]
// Output: [val]
export class GetMapClassHelper extends Helper {
  public readonly needsGlobal: boolean = true;

  public emitGlobal(sb: ScriptBuilder, node: ts.Node, optionsIn: VisitOptions): void {
    const outerOptions = sb.pushValueOptions(optionsIn);

    // [number, globalObject]
    sb.emitPushInt(node, GlobalProperty.Map);
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
            // [objectVal, iterator]
            sb.emitOp(node, 'SWAP');
            // []
            sb.emitHelper(node, innerOptions, sb.helpers.rawIteratorForEachFunc);
          },
          get: (innerOptions) => {
            // [argsarr]
            sb.emitPushInt(node, 0);
            // [key]
            sb.emitOp(node, 'PICKITEM');
            // [this, key]
            sb.scope.getThis(sb, node, innerOptions);
            // [map, key]
            getMap(sb, node)(innerOptions);
            // [map, key, map]
            sb.emitOp(node, 'TUCK');
            // [key, map, key, map]
            sb.emitOp(node, 'OVER');
            sb.emitHelper(
              node,
              innerOptions,
              sb.helpers.if({
                condition: () => {
                  // [hasKey, key, map]
                  sb.emitOp(node, 'HASKEY');
                },
                whenTrue: () => {
                  // [val]
                  sb.emitOp(node, 'PICKITEM');
                },
                whenFalse: () => {
                  // [map]
                  sb.emitOp(node, 'DROP');
                  // []
                  sb.emitOp(node, 'DROP');
                  // [undefinedVal]
                  sb.emitHelper(node, innerOptions, sb.helpers.wrapUndefined);
                },
              }),
            );
          },
          set: (innerOptions) => {
            // [this, argsarr]
            sb.scope.getThis(sb, node, innerOptions);
            // [this, argsarr, this]
            sb.emitOp(node, 'TUCK');
            // [map, argsarr, this]
            getMap(sb, node)(innerOptions);
            // [argsarr, map, this]
            sb.emitOp(node, 'SWAP');
            // [length, keyVal, valueVal, map, this]
            sb.emitOp(node, 'UNPACK');
            // [keyVal, valueVal, map, this]
            sb.emitOp(node, 'DROP');
            // [valueVal, keyVal, map, this]
            sb.emitOp(node, 'SWAP');
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
            // [val]
            sb.emitHelper(node, innerOptions, sb.helpers.createGenericIteratorIterableIterator);
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
    sb.emitHelper(node, options, sb.helpers.getGlobalProperty({ property: GlobalProperty.Map }));
  }
}
