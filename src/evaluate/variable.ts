/**
 * @author WMXPY
 * @namespace Evaluate
 * @description Variable
 */

import * as EST from "estree";
import { ERROR_CODE } from "marked#declare/error";
import { Evaluator } from "marked#declare/node";
import { VARIABLE_TYPE } from "marked#declare/variable";
import { error } from "marked#util/error/error";
import { SandList } from "marked#variable/sandlist";
import { Scope } from "marked#variable/scope";
import { Trace } from "marked#variable/trace";
import { Sandbox } from "../sandbox";

export const arrayExpressionEvaluator: Evaluator<'ArrayExpression'> =
    async function (this: Sandbox, node: EST.ArrayExpression, scope: Scope, trace: Trace): Promise<any> {

        const nextTrace: Trace = trace.stack(node);
        const mapped: any[] = [];
        for (const element of node.elements) {
            const evaluated: any = await this.execute(element, scope, nextTrace);
            mapped.push(evaluated);
        }

        return new SandList(mapped);
    };

export const memberEvaluator: Evaluator<'MemberExpression'> =
    async function (this: Sandbox, node: EST.MemberExpression, scope: Scope, trace: Trace): Promise<any> {

        const nextTrace: Trace = trace.stack(node);
        const computed: boolean = node.computed;
        const object: any = await this.execute(node.object, scope, nextTrace);
        if (computed) {

            const member: any = await this.execute(node.property, scope, nextTrace);

            if (object instanceof SandList) {
                return object.get(member);
            }
            return await object[member];
        } else {
            return object[(node.property as EST.Identifier).name];
        }
    };

export const variableDeclarationEvaluator: Evaluator<'VariableDeclaration'> =
    async function (this: Sandbox, node: EST.VariableDeclaration, scope: Scope, trace: Trace): Promise<any> {

        const nextTrace: Trace = trace.stack(node);
        const type: VARIABLE_TYPE = node.kind as VARIABLE_TYPE;

        for (const declaration of node.declarations) {

            const pattern: EST.Pattern = declaration.id;
            const identifier: EST.Identifier = pattern as EST.Identifier;
            if (scope.exist(identifier.name)) {
                throw error(ERROR_CODE.DUPLICATED_VARIABLE, identifier.name, node);
            }
            const value = declaration.init ?
                await this.execute(declaration.init, scope, nextTrace) : undefined;

            scope.register(type)(identifier.name, value);
        }

        return;
    };
