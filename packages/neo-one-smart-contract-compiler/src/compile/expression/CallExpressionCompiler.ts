import ts from 'typescript';
import { NodeCompiler } from '../NodeCompiler';
import { ScriptBuilder } from '../sb';
import { VisitOptions } from '../types';

export class CallExpressionCompiler extends NodeCompiler<ts.CallExpression> {
  public readonly kind = ts.SyntaxKind.CallExpression;

  public visitNode(sb: ScriptBuilder, node: ts.CallExpression, options: VisitOptions): void {
    sb.emitHelper(node, options, sb.helpers.callLike);
  }
}
