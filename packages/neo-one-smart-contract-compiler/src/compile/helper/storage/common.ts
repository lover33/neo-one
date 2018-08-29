import ts from 'typescript';
import { InternalObjectProperty } from '../../constants';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';

export const createGetKey = (sb: ScriptBuilder, node: ts.Node) => (innerOptions: VisitOptions) => {
  // [buffer]
  sb.emitSysCall(node, 'Neo.Runtime.Serialize');
  // [thisObjectVal, buffer]
  sb.scope.getThis(sb, node, innerOptions);
  // [number, thisObjectVal, buffer]
  sb.emitPushInt(node, InternalObjectProperty.Data1);
  // [prefix, buffer]
  sb.emitHelper(node, innerOptions, sb.helpers.getInternalObjectProperty);
  // [buffer, prefix]
  sb.emitOp(node, 'SWAP');
  // [prefix + buffer]
  sb.emitOp(node, 'CAT');
};

type Emit = (options: VisitOptions) => void;

export const createConstructor = (sb: ScriptBuilder, node: ts.Node) => (innerOptionsIn: VisitOptions) => {
  const innerOptions = sb.pushValueOptions(innerOptionsIn);
  // [number, argsarr]
  sb.emitPushInt(node, 0);
  // [val]
  sb.emitOp(node, 'PICKITEM');
  // [buffer]
  sb.emitHelper(node, innerOptions, sb.helpers.unwrapBuffer);
  // [buffer, buffer]
  sb.emitOp(node, 'DUP');
  // [objectVal, buffer, buffer]
  sb.scope.getThis(sb, node, innerOptions);
  // [objectVal, buffer, objectVal, buffer]
  sb.emitOp(node, 'TUCK');
  // [number, objectVal, buffer, objectVal, buffer]
  sb.emitPushInt(node, InternalObjectProperty.Data0);
  // [buffer, number, objectVal, objectVal, buffer]
  sb.emitOp(node, 'ROT');
  // [objectVal, buffer]
  sb.emitHelper(node, innerOptions, sb.helpers.setInternalObjectProperty);
  // [buffer, objectVal, buffer]
  sb.emitOp(node, 'OVER');
  // [idx, objectVal, buffer]
  sb.emitHelper(node, innerOptions, sb.helpers.getCommonStorage);
  sb.emitHelper(
    node,
    innerOptions,
    sb.helpers.handleUndefinedStorage({
      handleUndefined: () => {
        // [buffer, objectVal, buffer]
        sb.emitOp(node, 'OVER');
        // [idx, buffer, objectVal, buffer]
        sb.emitPushInt(node, 0);
        // [buffer, idx, buffer, objectVal, buffer]
        sb.emitOp(node, 'OVER');
        // [buffer, objectVal, buffer]
        sb.emitHelper(node, innerOptions, sb.helpers.putCommonStorage);
        // [idx, buffer, objectVal, buffer]
        sb.emitPushInt(node, 0);
        // [idx, buffer, size, objectVal, buffer]
        sb.emitOp(node, 'TUCK');
        // [prefix, size, objectVal, buffer]
        sb.emitOp(node, 'CAT');
        // [objectVal, buffer]
        sb.emitHelper(node, innerOptions, sb.helpers.putCommonStorage);
        // [idx, objectVal, buffer]
        sb.emitPushInt(node, 0);
      },
      handleDefined: () => {
        // do nothing
      },
    }),
  );
  // [buffer, idx, objectVal]
  sb.emitOp(node, 'ROT');
  // [idx, buffer, objectVal]
  sb.emitOp(node, 'SWAP');
  // [buffer, objectVal]
  sb.emitOp(node, 'CAT');
  // [objectVal, buffer]
  sb.emitOp(node, 'SWAP');
  // [number, objectVal, buffer]
  sb.emitPushInt(node, InternalObjectProperty.Data1);
  // [buffer, number, objectVal]
  sb.emitOp(node, 'ROT');
  // []
  sb.emitHelper(node, innerOptions, sb.helpers.setInternalObjectProperty);
};

export const createGet = (sb: ScriptBuilder, node: ts.Node, getKey: Emit) => (innerOptions: VisitOptions) => {
  // [number, argsarr]
  sb.emitPushInt(node, 0);
  // [val]
  sb.emitOp(node, 'PICKITEM');
  // [buffer]
  getKey(innerOptions);
  // [buffer]
  sb.emitHelper(node, innerOptions, sb.helpers.getStorage);
  sb.emitHelper(
    node,
    innerOptions,
    sb.helpers.handleUndefinedStorage({
      handleUndefined: () => {
        sb.emitHelper(node, innerOptions, sb.helpers.wrapUndefined);
      },
      handleDefined: () => {
        sb.emitSysCall(node, 'Neo.Runtime.Deserialize');
      },
    }),
  );
};

export const createHas = (sb: ScriptBuilder, node: ts.Node, getKey: Emit) => (innerOptions: VisitOptions) => {
  // [number, argsarr]
  sb.emitPushInt(node, 0);
  // [val]
  sb.emitOp(node, 'PICKITEM');
  // [buffer]
  getKey(innerOptions);
  // [buffer]
  sb.emitHelper(node, innerOptions, sb.helpers.getStorage);
  sb.emitHelper(
    node,
    innerOptions,
    sb.helpers.handleUndefinedStorage({
      handleUndefined: () => {
        // [boolean]
        sb.emitPushBoolean(node, false);
        // [val]
        sb.emitHelper(node, innerOptions, sb.helpers.wrapBoolean);
      },
      handleDefined: () => {
        // []
        sb.emitOp(node, 'DROP');
        // [boolean]
        sb.emitPushBoolean(node, true);
        // [val]
        sb.emitHelper(node, innerOptions, sb.helpers.wrapBoolean);
      },
    }),
  );
};

const handleSize = (sb: ScriptBuilder, node: ts.Node, innerOptions: VisitOptions, increment = true) => {
  // [size]
  sb.emitHelper(node, innerOptions, sb.helpers.getCommonStorage);
  if (increment) {
    // [size]
    sb.emitOp(node, 'INC');
  } else {
    // [size]
    sb.emitOp(node, 'DEC');
  }
  // [thisObjectVal, size]
  sb.scope.getThis(sb, node, innerOptions);
  // [number, thisObjectVal, size]
  sb.emitPushInt(node, InternalObjectProperty.Data1);
  // [prefix, size]
  sb.emitHelper(node, innerOptions, sb.helpers.getInternalObjectProperty);
  // []
  sb.emitHelper(node, innerOptions, sb.helpers.putCommonStorage);
};

export const createSet = (sb: ScriptBuilder, node: ts.Node, getKey: Emit, handleValue: Emit) => (
  innerOptions: VisitOptions,
) => {
  // [argsarr, argsarr]
  sb.emitOp(node, 'DUP');
  // [number, argsarr, argsarr]
  sb.emitPushInt(node, 0);
  // [val, argsarr]
  sb.emitOp(node, 'PICKITEM');
  // [buffer, argsarr]
  getKey(innerOptions);
  // [val, bufferKey]
  handleValue(innerOptions);
  // [bufferVal, bufferKey]
  sb.emitSysCall(node, 'Neo.Runtime.Serialize');
  // [bufferKey, bufferVal, bufferKey]
  sb.emitOp(node, 'OVER');
  // [bufferVal, bufferKey]
  handleSize(sb, node, innerOptions, true);
  // [bufferKey, bufferVal]
  sb.emitOp(node, 'SWAP');
  // []
  sb.emitHelper(node, innerOptions, sb.helpers.putStorage);
  // [val]
  sb.scope.getThis(sb, node, innerOptions);
};

export const createDelete = (sb: ScriptBuilder, node: ts.Node, getKey: Emit) => (innerOptions: VisitOptions) => {
  // [number, argsarr]
  sb.emitPushInt(node, 0);
  // [val]
  sb.emitOp(node, 'PICKITEM');
  // [buffer]
  getKey(innerOptions);
  // [buffer, buffer]
  sb.emitOp(node, 'DUP');
  sb.emitHelper(
    node,
    innerOptions,
    sb.helpers.if({
      condition: () => {
        // [boolean, buffer]
        sb.emitHelper(node, innerOptions, sb.helpers.deleteStorage);
      },
      whenTrue: () => {
        // []
        handleSize(sb, node, innerOptions, false);
        // [boolean]
        sb.emitPushBoolean(node, true);
      },
      whenFalse: () => {
        // []
        sb.emitOp(node, 'DROP');
        // [boolean]
        sb.emitPushBoolean(node, false);
      },
    }),
  );
  // [val]
  sb.emitHelper(node, innerOptions, sb.helpers.wrapBoolean);
};

export const createClear = (sb: ScriptBuilder, node: ts.Node) => (innerOptions: VisitOptions) => {
  // []
  sb.emitOp(node, 'DROP');
  // [objectVal]
  sb.scope.getThis(sb, node, innerOptions);
  // [data1, objectVal]
  sb.emitPushInt(node, InternalObjectProperty.Data1);
  // [objectVal, data1, objectVal]
  sb.emitOp(node, 'DUP');
  // [number, objectVal, data1, objectVal]
  sb.emitPushInt(node, InternalObjectProperty.Data0);
  // [originalPrefix, data1, objectVal]
  sb.emitHelper(node, innerOptions, sb.helpers.getInternalObjectProperty);
  // [originalPrefix, originalPrefix, data1, objectVal]
  sb.emitOp(node, 'DUP');
  // [idx, originalPrefix, data1, objectVal]
  sb.emitHelper(node, innerOptions, sb.helpers.getCommonStorage);
  // [idx, originalPrefix, data1, objectVal]
  sb.emitOp(node, 'INC');
  // [idx, originalPrefix, idx, data1, objectVal]
  sb.emitOp(node, 'TUCK');
  // [originalPrefix, idx, originalPrefix, idx, data1, objectVal]
  sb.emitOp(node, 'OVER');
  // [originalPrefix, idx, data1, objectVal]
  sb.emitHelper(node, innerOptions, sb.helpers.putCommonStorage);
  // [idx, originalPrefix, data1, objectVal]
  sb.emitOp(node, 'SWAP');
  // [prefix, data1, objectVal]
  sb.emitOp(node, 'CAT');
  // [0, prefix, data1, objectVal]
  sb.emitPushInt(node, 0);
  // [prefix, 0, prefix, data1, objectVal]
  sb.emitOp(node, 'OVER');
  // [prefix, data1, objectVal]
  sb.emitHelper(node, innerOptions, sb.helpers.putCommonStorage);
  // []
  sb.emitHelper(node, innerOptions, sb.helpers.setInternalObjectProperty);
  // [val]
  sb.emitHelper(node, innerOptions, sb.helpers.wrapUndefined);
};

export const createSize = (sb: ScriptBuilder, node: ts.Node) => ({
  getter: (innerOptions: VisitOptions) => {
    // []
    sb.emitOp(node, 'DROP');
    // [objectVal]
    sb.scope.getThis(sb, node, innerOptions);
    // [data1, objectVal]
    sb.emitPushInt(node, InternalObjectProperty.Data1);
    // [prefix]
    sb.emitHelper(node, innerOptions, sb.helpers.getInternalObjectProperty);
    // [size]
    sb.emitHelper(node, innerOptions, sb.helpers.getCommonStorage);
    // [val]
    sb.emitHelper(node, innerOptions, sb.helpers.wrapNumber);
  },
});

export const createForEach = (sb: ScriptBuilder, node: ts.Node, handleIterator: (_options: VisitOptions) => void) => (
  innerOptions: VisitOptions,
) => {
  // [argsarr]
  sb.emitPushInt(node, 0);
  // [objectVal]
  sb.emitOp(node, 'PICKITEM');
  // [thisVal, objectVal]
  sb.scope.getThis(sb, node, innerOptions);
  // [data1, thisVal, objectVal]
  sb.emitPushInt(node, InternalObjectProperty.Data1);
  // [prefix, objectVal]
  sb.emitHelper(node, innerOptions, sb.helpers.getInternalObjectProperty);
  // [iterator, objectVal]
  sb.emitHelper(node, innerOptions, sb.helpers.iterStorage);
  // []
  handleIterator(innerOptions);
  // [val]
  sb.emitHelper(node, innerOptions, sb.helpers.wrapUndefined);
};

export const createIterator = (sb: ScriptBuilder, node: ts.Node, handleIterator: (_options: VisitOptions) => void) => (
  innerOptions: VisitOptions,
) => {
  // []
  sb.emitOp(node, 'DROP');
  // [thisVal]
  sb.scope.getThis(sb, node, innerOptions);
  // [data1, thisVal]
  sb.emitPushInt(node, InternalObjectProperty.Data1);
  // [prefix]
  sb.emitHelper(node, innerOptions, sb.helpers.getInternalObjectProperty);
  // [iterator]
  sb.emitHelper(node, innerOptions, sb.helpers.iterStorage);
  // [val]
  handleIterator(innerOptions);
};
