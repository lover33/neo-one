import { tsUtils } from '@neo-one/ts-utils';
import ts from 'typescript';
import { MapSubType, SetSubType } from '../../constants';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { BuiltinInstanceMemberCall } from '../BuiltinInstanceMemberCall';
import { CallMemberLikeExpression } from '../types';

enum Slots {
  MapSubType = 0,
  OriginalPrefix = 1,
  CurrentPrefix = 2,
}

// tslint:disable-next-line
export const createNewMapStorageLike = (
  sb: ScriptBuilder,
  node: ts.Node,
  optionsIn: VisitOptions,
  subType: MapSubType | SetSubType,
  wrap: (options: VisitOptions) => void,
) => {
  const options = sb.pushValueOptions(optionsIn);
  // [buffer]
  sb.emitHelper(node, options, sb.helpers.unwrapBuffer);
  // [buffer, buffer]
  sb.emitOp(node, 'DUP');
  // [0, buffer, buffer]
  sb.emitPushInt(node, 0);
  // [arr, buffer, buffer]
  sb.emitOp(node, 'NEWARRAY');
  // [arr, arr, buffer, buffer]
  sb.emitOp(node, 'DUP');
  // [number, arr, arr, buffer, buffer]
  sb.emitPushInt(node, subType);
  // [arr, buffer, buffer]
  sb.emitOp(node, 'APPEND');
  // [arr, buffer, arr, buffer]
  sb.emitOp(node, 'TUCK');
  // [buffer, arr, arr, buffer]
  sb.emitOp(node, 'ROT');
  // [arr, buffer]
  sb.emitOp(node, 'APPEND');
  // [arr, buffer, arr]
  sb.emitOp(node, 'TUCK');
  // [buffer, arr, buffer, arr]
  sb.emitOp(node, 'OVER');
  // [idx, arr, buffer, arr]
  sb.emitHelper(node, options, sb.helpers.getCommonStorage);
  sb.emitHelper(
    node,
    options,
    sb.helpers.handleUndefinedStorage({
      handleUndefined: () => {
        // [buffer, arr, buffer, arr]
        sb.emitOp(node, 'OVER');
        // [idx, buffer, arr, buffer, arr]
        sb.emitPushInt(node, 0);
        // [buffer, idx, buffer, arr, buffer, arr]
        sb.emitOp(node, 'OVER');
        // [buffer, arr, buffer, arr]
        sb.emitHelper(node, options, sb.helpers.putCommonStorage);
        // [idx, buffer, arr, buffer, arr]
        sb.emitPushInt(node, 0);
        // [idx, buffer, size, arr, buffer, arr]
        sb.emitOp(node, 'TUCK');
        // [prefix, size, arr, buffer, arr]
        sb.emitOp(node, 'CAT');
        // [arr, buffer, arr]
        sb.emitHelper(node, options, sb.helpers.putCommonStorage);
        // [idx, arr, buffer, arr]
        sb.emitPushInt(node, 0);
      },
      handleDefined: () => {
        // do nothing
      },
    }),
  );
  // [buffer, idx, arr, arr]
  sb.emitOp(node, 'ROT');
  // [idx, buffer, arr, arr]
  sb.emitOp(node, 'SWAP');
  // [buffer, arr, arr]
  sb.emitOp(node, 'CAT');
  // [arr]
  sb.emitOp(node, 'APPEND');
  // [val]
  wrap(options);
};

export const createMapStorageLikeIterator = (
  sb: ScriptBuilder,
  node: ts.Node,
  innerOptions: VisitOptions,
  handleIterator: () => void,
) => {
  // []
  sb.emitPushInt(node, Slots.OriginalPrefix);
  // [prefix]
  sb.emitOp(node, 'PICKITEM');
  // [iterator]
  sb.emitHelper(node, innerOptions, sb.helpers.iterStorage);
  // [val]
  handleIterator();
};
