import ts from 'typescript';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { BuiltinInterface } from '../BuiltinInterface';
import { Builtins } from '../Builtins';
import { BuiltinValue } from '../BuiltinValue';

class SetInterface extends BuiltinInterface {
  public readonly canImplement = true;
}
class ReadonlySetInterface extends BuiltinInterface {
  public readonly canImplement = true;
}
class SetValue extends BuiltinValue {
  public emit(sb: ScriptBuilder, node: ts.Identifier, options: VisitOptions): void {
    // [classVal]
    sb.emitHelper(node, options, sb.helpers.getSetClass);
  }
}
class SetConstructorInterface extends BuiltinInterface {}

// tslint:disable-next-line export-name
export const add = (builtins: Builtins): void => {
  builtins.addInterface('Set', new SetInterface());
  builtins.addInterface('ReadonlySet', new ReadonlySetInterface());
  builtins.addValue('Set', new SetValue());
  builtins.addInterface('SetConstructor', new SetConstructorInterface());
};
