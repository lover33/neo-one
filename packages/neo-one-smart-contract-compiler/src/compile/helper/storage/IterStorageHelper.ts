import ts from 'typescript';
import { GlobalProperty } from '../../constants';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { Helper } from '../Helper';

// Input: [keyBuffer]
// Output: [iterator]
export class IterStorageHelper extends Helper {
  public emit(sb: ScriptBuilder, node: ts.Node, optionsIn: VisitOptions): void {
    const options = sb.pushValueOptions(optionsIn);
    const keyBuffer = sb.scope.addUnique();
    // [keyBuffer, keyBuffer]
    sb.emitOp(node, 'DUP');
    // [keyBuffer]
    sb.scope.set(sb, node, options, keyBuffer);
    // [context, keyBuffer]
    sb.emitSysCall(node, 'Neo.Storage.GetReadOnlyContext');
    // [storageIterator]
    sb.emitSysCall(node, 'Neo.Storage.Find');
    // [map, storageIterator]
    sb.emitHelper(node, options, sb.helpers.getGlobalProperty({ property: GlobalProperty.CacheStorage }));
    // [iterator, storageIterator]
    sb.emitSysCall(node, 'Neo.Iterator.Create');
    // [map, storageIterator]
    sb.emitHelper(
      node,
      options,
      sb.helpers.rawIteratorFilter({
        filter: (innerOptions: VisitOptions) => {
          // [key]
          sb.emitOp(node, 'DROP');
          // [keyBuffer, key]
          sb.scope.get(sb, node, innerOptions, keyBuffer);
          // [keyBuffer, key, keyBuffer]
          sb.emitOp(node, 'TUCK');
          // [size, key, keyBuffer]
          sb.emitOp(node, 'SIZE');
          // [prefixBuffer, keyBuffer]
          sb.emitOp(node, 'LEFT');
          // [boolean]
          sb.emitOp(node, 'EQUAL');
        },
      }),
    );
    // [iterator, storageIterator]
    sb.emitSysCall(node, 'Neo.Iterator.Create');
    // [iterator]
    sb.emitSysCall(node, 'Neo.Iterator.Concat');

    if (!optionsIn.pushValue) {
      sb.emitOp(node, 'DROP');
    }
  }
}
