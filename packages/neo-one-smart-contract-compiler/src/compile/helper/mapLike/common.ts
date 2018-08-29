import ts from 'typescript';
import { InternalObjectProperty } from '../../constants';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';

export const ctor = (sb: ScriptBuilder, node: ts.Node) => (innerOptionsIn: VisitOptions) => {
  const innerOptions = sb.pushValueOptions(innerOptionsIn);
  // []
  sb.emitOp(node, 'DROP');
  // [objectVal]
  sb.scope.getThis(sb, node, innerOptions);
  // [number, objectVal]
  sb.emitPushInt(node, InternalObjectProperty.Data0);
  // [obj, number, objectVal]
  sb.emitOp(node, 'NEWMAP');
  // []
  sb.emitHelper(node, innerOptions, sb.helpers.setInternalObjectProperty);
};

export const clear = (sb: ScriptBuilder, node: ts.Node) => (innerOptions: VisitOptions) => {
  clear(sb, node)(innerOptions);
  // [val]
  sb.emitHelper(node, innerOptions, sb.helpers.wrapUndefined);
};

export const getMap = (sb: ScriptBuilder, node: ts.Node) => (innerOptions: VisitOptions) => {
  // [number, objectVal]
  sb.emitPushInt(node, InternalObjectProperty.Data0);
  // [obj]
  sb.emitHelper(node, innerOptions, sb.helpers.getInternalObjectProperty);
};

export const size = (sb: ScriptBuilder, node: ts.Node) => ({
  getter: (innerOptions: VisitOptions) => {
    // []
    sb.emitOp(node, 'DROP');
    // [this]
    sb.scope.getThis(sb, node, innerOptions);
    // [map]
    getMap(sb, node)(innerOptions);
    // [number]
    sb.emitOp(node, 'ARRAYSIZE');
    // [val]
    sb.emitHelper(node, innerOptions, sb.helpers.wrapNumber);
  },
});

export const createDelete = (sb: ScriptBuilder, node: ts.Node) => (innerOptions: VisitOptions) => {
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
  // [hasKey, key, map]
  sb.emitOp(node, 'HASKEY');
  // [map, hasKey, key]
  sb.emitOp(node, 'ROT');
  // [key, map, hasKey]
  sb.emitOp(node, 'ROT');
  // [hasKey]
  sb.emitOp(node, 'REMOVE');
  // [boolVal]
  sb.emitHelper(node, innerOptions, sb.helpers.wrapBoolean);
};

export const has = (sb: ScriptBuilder, node: ts.Node) => (innerOptions: VisitOptions) => {
  // [argsarr]
  sb.emitPushInt(node, 0);
  // [key]
  sb.emitOp(node, 'PICKITEM');
  // [this, key]
  sb.scope.getThis(sb, node, innerOptions);
  // [map, key]
  getMap(sb, node)(innerOptions);
  // [key, map]
  sb.emitOp(node, 'SWAP');
  // [boolean]
  sb.emitOp(node, 'HASKEY');
  // [val]
  sb.emitHelper(node, innerOptions, sb.helpers.wrapBoolean);
};
