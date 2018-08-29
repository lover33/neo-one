import ts from 'typescript';
import { MapSubType } from '../../constants';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { BuiltinInstanceOf } from '../BuiltinInstanceOf';
import { BuiltinInterface } from '../BuiltinInterface';
import { Builtins } from '../Builtins';
import { createNewMapStorageLike } from '../common';
import { Builtin, BuiltinNew, BuiltinType } from '../types';
import { MapClear } from './clear';
import { MapIterator } from './iterator';

class MapInterface extends BuiltinInterface {}
class ReadonlyMapInterface extends BuiltinInterface {}
class MapStorageInterface extends BuiltinInterface {}
class MapValue extends BuiltinInstanceOf implements BuiltinNew {
  public readonly types = new Set([BuiltinType.InstanceOf, BuiltinType.New]);
  public emitInstanceOf(sb: ScriptBuilder, node: ts.Expression, optionsIn: VisitOptions): void {
    const options = sb.pushValueOptions(optionsIn);
    // [val]
    sb.visit(node, options);
    if (optionsIn.pushValue) {
      // [boolean]
      sb.emitHelper(node, options, sb.helpers.isMap);
      // [val]
      sb.emitHelper(node, options, sb.helpers.wrapBoolean);
    } else {
      // []
      /* istanbul ignore next */
      sb.emitOp(node, 'DROP');
    }
  }

  public emitNew(sb: ScriptBuilder, node: ts.NewExpression, options: VisitOptions): void {
    if (options.pushValue) {
      // [map]
      sb.emitOp(node, 'NEWMAP');
      // [val]
      sb.emitHelper(node, options, sb.helpers.wrapMapMap);
    }
  }
}
class MapStorageValue extends BuiltinInstanceOf implements BuiltinNew {
  public readonly types = new Set([BuiltinType.InstanceOf, BuiltinType.New]);
  public emitInstanceOf(sb: ScriptBuilder, node: ts.Expression, optionsIn: VisitOptions): void {
    const options = sb.pushValueOptions(optionsIn);
    // [val]
    sb.visit(node, options);
    if (optionsIn.pushValue) {
      // [boolean]
      sb.emitHelper(node, options, sb.helpers.isMap);
      // [val]
      sb.emitHelper(node, options, sb.helpers.wrapBoolean);
    } else {
      // []
      /* istanbul ignore next */
      sb.emitOp(node, 'DROP');
    }
  }

  public emitNew(sb: ScriptBuilder, node: ts.NewExpression, options: VisitOptions): void {
    if (options.pushValue) {
      // [map]
      sb.emitOp(node, 'NEWMAP');
      // [val]
      createNewMapStorageLike(sb, node, options, MapSubType.MapStorage, (innerOptions) => {
        sb.emitHelper(node, innerOptions, sb.helpers.wrapMap);
      });
    }
  }
}
class MapConstructorInterface extends BuiltinInterface {}
class MapStorageConstructorInterface extends BuiltinInterface {}

const READ_COMMON: ReadonlyArray<[string, Builtin]> = [
  ['__@iterator', new MapIterator()],
  ['forEach', new MapForEach()],
  ['get', new MapGet()],
  ['has', new MapHas()],
  ['size', new MapSize()],
];

const WRITE_COMMON: ReadonlyArray<[string, Builtin]> = [
  ['clear', new MapClear()],
  ['delete', new MapDelete()],
  ['set', new MapSet()],
];

// tslint:disable-next-line export-name
export const add = (builtins: Builtins): void => {
  builtins.addInterface('Map', new MapInterface());
  builtins.addInterface('ReadonlyMap', new ReadonlyMapInterface());
  builtins.addInterface('MapStorage', new MapStorageInterface());
  builtins.addValue('Map', new MapValue());
  builtins.addValue('MapStorage', new MapStorageValue());
  READ_COMMON.forEach(([name, builtin]) => {
    builtins.addMember('Map', name, builtin);
    builtins.addMember('ReadonlyMap', name, builtin);
  });
  WRITE_COMMON.forEach(([name, builtin]) => {
    builtins.addMember('Map', name, builtin);
  });
  builtins.addInterface('MapConstructor', new MapConstructorInterface());
  builtins.addInterface('MapStorageConstructor', new MapStorageConstructorInterface());
};
