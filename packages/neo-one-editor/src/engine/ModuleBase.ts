import { Engine } from './Engine';
import { evaluate } from './eval';
import { Exports } from './types';

const NEEDS_EVAL = Symbol.for('needsEval');

export interface EvaluateOptions {
  readonly initiator?: ModuleBase;
  readonly force?: boolean;
}

export abstract class ModuleBase {
  private readonly mutableDependents = new Set<ModuleBase>();
  private mutableExports: Exports = NEEDS_EVAL;

  public constructor(protected readonly engine: Engine, public readonly path: string) {}

  public evaluate({ force = false, initiator }: EvaluateOptions = {}): Exports {
    if (initiator !== undefined) {
      this.mutableDependents.add(initiator);
    }

    if (force || this.mutableExports === NEEDS_EVAL) {
      this.mutableExports = evaluate(this.engine, this);
    }

    return this.mutableExports;
  }

  public abstract getCode(): string;

  public clearExports(): void {
    this.mutableExports = NEEDS_EVAL;
    this.mutableDependents.forEach((dep) => {
      dep.clearExports();
    });
  }
}
