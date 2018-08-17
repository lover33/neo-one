import { ABIFunction } from '@neo-one/client-core';
import _ from 'lodash';
import { toTypeScriptType } from '../utils';

interface ParamAcc {
  readonly hasRequired: boolean;
  readonly acc: ReadonlyArray<string>;
}

export const genFunctionParameters = (abi: ABIFunction): string =>
  _.reverse(
    _.reverse([...(abi.parameters === undefined ? [] : abi.parameters)]).reduce<ParamAcc>(
      (acc, param) => ({
        hasRequired: acc.hasRequired || !param.optional,
        acc: acc.acc.concat(
          `${param.name}${!acc.hasRequired && param.optional ? '?' : ''}: ${toTypeScriptType(param, false)}`,
        ),
      }),
      { hasRequired: false, acc: [] },
    ).acc,
  )
    .concat(abi.constant ? [] : ['options?: InvokeTransactionOptions'])
    .join(', ');
