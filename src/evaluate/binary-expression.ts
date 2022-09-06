/**
 * @author WMXPY
 * @namespace Evaluate
 * @description Binary Expression
 */

import * as EST from "estree";
import { ERROR_CODE } from "../declare/error-code";
import { Evaluator } from "../declare/evaluate";
import { ISandbox } from "../declare/sandbox";
import { Sandbox } from "../marked/sandbox";
import { getBinaryOperation } from "../operation/binary";
import { error } from "../util/error/error";
import { Scope } from "../variable/scope";
import { Trace } from "../variable/trace/trace";

export const mountBinaryExpression = (sandbox: ISandbox): void => {

    sandbox.mount('BinaryExpression', binaryExpressionEvaluator);
};

export const binaryExpressionEvaluator: Evaluator<'BinaryExpression'> =
    async function (this: Sandbox, node: EST.BinaryExpression, scope: Scope, trace: Trace): Promise<any> {

        const nextTrace: Trace = trace.stack(node);

        const evalLeft: () => Promise<any> = async () => await this.execute(node.left, scope, nextTrace);
        const evalRight: () => Promise<any> = async () => await this.execute(node.right, scope, nextTrace);

        const operation: ((left: any, right: any) => any) | null = getBinaryOperation(node.operator);

        if (!operation) {

            throw error(ERROR_CODE.BINARY_NOT_SUPPORT, node.operator, node, trace);
        }

        return operation(await evalLeft(), await evalRight());
    };
