import ts from 'typescript';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { Helper } from '../Helper';

export interface ArrForEachHelperOptions {
  readonly each: (options: VisitOptions) => void;
  readonly withIndex?: boolean;
}

// Input: [array]
// Output: []
export class ArrForEachHelper extends Helper {
  private readonly each: (options: VisitOptions) => void;
  private readonly withIndex: boolean;

  public constructor(options: ArrForEachHelperOptions) {
    super();
    this.each = options.each;
    this.withIndex = options.withIndex || false;
  }

  public emit(sb: ScriptBuilder, node: ts.Node, optionsIn: VisitOptions): void {
    const options = sb.pushValueOptions(optionsIn);

    // [enumerator]
    sb.emitSysCall(node, 'Neo.Enumerator.Create');
    sb.emitHelper(
      node,
      options,
      sb.helpers.rawEnumeratorForEach({
        withIndex: this.withIndex,
        each: this.each,
      }),
    );
  }
}
