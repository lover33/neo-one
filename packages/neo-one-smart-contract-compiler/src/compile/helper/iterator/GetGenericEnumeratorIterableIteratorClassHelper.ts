import ts from 'typescript';
import { GlobalProperty, InternalObjectProperty, WellKnownSymbol } from '../../constants';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { Helper } from '../Helper';

// Input: []
// Output: [val]
export class GetGenericEnumeratorIterableIteratorClassHelper extends Helper {
  public readonly needsGlobal: boolean = true;

  public emitGlobal(sb: ScriptBuilder, node: ts.Node, optionsIn: VisitOptions): void {
    const outerOptions = sb.pushValueOptions(optionsIn);

    // [number, globalObject]
    sb.emitPushInt(node, GlobalProperty.GenericEnumeratorIterableIterator);
    // [classVal, number, globalObjectVal]
    sb.emitHelper(
      node,
      outerOptions,
      sb.helpers.createClass({
        ctor: (innerOptionsIn) => {
          const innerOptions = sb.pushValueOptions(innerOptionsIn);
          // [0, argsarr]
          sb.emitPushInt(node, 0);
          // [enumerator]
          sb.emitOp(node, 'PICKITEM');
          // [thisObjectVal, enumerator]
          sb.scope.getThis(sb, node, innerOptions);
          // [number, thisObjectVal, enumerator]
          sb.emitPushInt(node, InternalObjectProperty.Data0);
          // [enumerator, number, thisObjectVal]
          sb.emitOp(node, 'ROT');
          // []
          sb.emitHelper(node, innerOptions, sb.helpers.setInternalObjectProperty);
        },
        prototypeMethods: {
          next: (innerOptions) => {
            // []
            sb.emitOp(node, 'DROP');
            // [thisObjectVal]
            sb.scope.getThis(sb, node, innerOptions);
            // [number, thisObjectVal]
            sb.emitPushInt(node, InternalObjectProperty.Data0);
            // [enumerator]
            sb.emitHelper(node, innerOptions, sb.helpers.getInternalObjectProperty);
            // [enumerator, enumerator]
            sb.emitOp(node, 'DUP');
            sb.emitHelper(
              node,
              innerOptions,
              sb.helpers.if({
                condition: () => {
                  // [done, enumerator]
                  sb.emitSysCall(node, 'Neo.Enumerator.Next');
                },
                whenTrue: () => {
                  // []
                  sb.emitOp(node, 'DROP');
                  // [val]
                  sb.emitHelper(node, innerOptions, sb.helpers.wrapUndefined);
                  // [done, val]
                  sb.emitPushBoolean(node, true);
                  // [done, val]
                  sb.emitHelper(node, innerOptions, sb.helpers.wrapBoolean);
                },
                whenFalse: () => {
                  // [value, enumerator]
                  sb.emitSysCall(node, 'Neo.Enumerator.Value');
                  // [value]
                  sb.emitOp(node, 'SWAP');
                  // [done, val]
                  sb.emitPushBoolean(node, false);
                  // [done, val]
                  sb.emitHelper(node, innerOptions, sb.helpers.wrapBoolean);
                },
              }),
            );
            // [objectVal, done, val]
            sb.emitHelper(node, innerOptions, sb.helpers.createObject);
            // [objectVal, done, objectVal, val]
            sb.emitOp(node, 'TUCK');
            // ['done', objectVal, done, objectVal, val]
            sb.emitPushString(node, 'done');
            // [done, 'done', objectVal, objectVal, val]
            sb.emitOp(node, 'ROT');
            // [objectVal, val]
            sb.emitHelper(node, innerOptions, sb.helpers.setDataPropertyObjectProperty);
            // [objectVal, val, objectVal]
            sb.emitOp(node, 'TUCK');
            // ['value', objectVal, val, objectVal]
            sb.emitPushString(node, 'value');
            // [val, 'value', objectVal, objectVal]
            sb.emitOp(node, 'ROT');
            // [objectVal]
            sb.emitHelper(node, innerOptions, sb.helpers.setDataPropertyObjectProperty);
          },
        },
        prototypeSymbolMethods: {
          [WellKnownSymbol.iterator]: (innerOptions) => {
            // []
            sb.emitOp(node, 'DROP');
            // [thisObjectVal]
            sb.scope.getThis(sb, node, innerOptions);
          },
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
    sb.emitHelper(
      node,
      options,
      sb.helpers.getGlobalProperty({ property: GlobalProperty.GenericEnumeratorIterableIterator }),
    );
  }
}
