/**
 * @author WMXPY
 * @namespace Evaluate
 * @description Variable
 */

import * as EST from "estree";
import { ERROR_CODE } from "marked#declare/error";
import { Evaluator } from "marked#declare/node";
import { VARIABLE_TYPE } from "marked#declare/variable";
import { assert } from "marked#util/error/assert";
import { error } from "marked#util/error/error";
import { validateLiteralOrIdentifier, validateObjectIsSandboxStructure } from "marked#util/node/validator";
import { getAssignmentOperation } from "marked#util/operation";
import { SandList } from "marked#variable/sandlist";
import { SandMap } from "marked#variable/sandmap";
import { Scope } from "marked#variable/scope";
import { Trace } from "marked#variable/trace";
import { Variable } from "marked#variable/variable";
import { isNumber, isString } from "util";
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

export const assignmentExpressionEvaluator: Evaluator<'AssignmentExpression'> =
    async function (this: Sandbox, node: EST.AssignmentExpression, scope: Scope, trace: Trace): Promise<any> {

        const nextTrace: Trace = trace.stack(node);

        const variable = await (async ()
            : Promise<Variable<any>> => {

            if (node.left.type === 'Identifier') { // fixme: const can be assigned now

                const name: string = node.left.name;
                return assert(scope.rummage(name) as Variable<any>)
                    .to.be
                    .exist(ERROR_CODE.VARIABLE_IS_NOT_DEFINED)
                    .firstValue();
            } else if (node.left.type === 'MemberExpression') {

                const object: SandList<any> | SandMap<any>
                    = await this.execute(node.left.object, scope, nextTrace);
                const member: string | number = node.left.computed
                    ? await this.execute(node.left.property, scope, nextTrace)
                    : (node.left.property as EST.Identifier).name;

                if (!validateObjectIsSandboxStructure(object))
                    throw error(ERROR_CODE.UNKNOWN_ERROR, (object as any).toString(), node);

                const memberVariable: Variable<any> | undefined = object instanceof SandList
                    ? object.getRaw(assert(member as number).to.be.number(ERROR_CODE.ONLY_NUMBER_AVAILABLE_FOR_LIST).firstValue())
                    : object.getRaw(assert(member as string).to.be.string(ERROR_CODE.ONLY_STRING_AVAILABLE_FOR_MAP).firstValue());

                if (!memberVariable)
                    throw error(ERROR_CODE.MEMBER_EXPRESSION_VALUE_CANNOT_BE_UNDEFINED, memberVariable, node);
                return memberVariable;
            } else {

                throw error(ERROR_CODE.INTERNAL_ERROR);
            }
        })();

        const operation: ((variable: Variable<any>, value: any) => any) | null = getAssignmentOperation(node.operator);

        if (!operation) {

            throw error(ERROR_CODE.ASSIGNMENT_NOT_SUPPORT, node.operator, node);
        }

        const assignee: any = await this.execute(node.right, scope, nextTrace);
        return operation(variable, assignee);
    };

export const memberEvaluator: Evaluator<'MemberExpression'> =
    async function (this: Sandbox, node: EST.MemberExpression, scope: Scope, trace: Trace): Promise<any> {

        const nextTrace: Trace = trace.stack(node);

        const computed: boolean = node.computed;
        const object: any = await this.execute(node.object, scope, nextTrace);
        const key: string | number = computed
            ? await this.execute(node.property, scope, nextTrace)
            : (node.property as EST.Identifier).name;

        if (object instanceof SandList) {

            if (isNumber(key)) return object.get(key);
            else throw error(ERROR_CODE.ONLY_NUMBER_AVAILABLE_FOR_LIST);
        } else if (object instanceof SandMap) {

            if (isString(key)) return object.get(key);
            else throw error(ERROR_CODE.ONLY_STRING_AVAILABLE_FOR_MAP);
        } else {

            return object[key];
        }
    };

export const objectExpressionEvaluator: Evaluator<'ObjectExpression'> =
    async function (this: Sandbox, node: EST.ObjectExpression, scope: Scope, trace: Trace): Promise<any> {

        const nextTrace: Trace = trace.stack(node);

        const map: SandMap<any> = new SandMap();
        for (const property of node.properties) {

            const keyNode: EST.Literal | EST.Identifier
                = property.key as EST.Literal | EST.Identifier;
            if (!validateLiteralOrIdentifier(keyNode))
                throw error(ERROR_CODE.UNKNOWN_ERROR, keyNode.type, keyNode);
            const key: string = keyNode.type === 'Literal'
                ? await this.execute(keyNode, scope, nextTrace)
                : keyNode.name;

            if (property.kind !== 'init')
                throw error(ERROR_CODE.PROPERTY_KIND_NOT_INIT_NOT_SUPPORT, property.kind, property);
            map.set(key, await this.execute(property.value, scope, nextTrace));
        }

        return map;
    };

export const variableDeclarationEvaluator: Evaluator<'VariableDeclaration'> =
    async function (this: Sandbox, node: EST.VariableDeclaration, scope: Scope, trace: Trace): Promise<any> {

        const nextTrace: Trace = trace.stack(node);

        const type: VARIABLE_TYPE = node.kind as VARIABLE_TYPE;
        for (const declaration of node.declarations) {

            const pattern: EST.Pattern = declaration.id;
            const identifier: EST.Identifier = pattern as EST.Identifier;
            if (scope.exist(identifier.name))
                throw error(ERROR_CODE.DUPLICATED_VARIABLE, identifier.name, node);
            const value = declaration.init
                ? await this.execute(declaration.init, scope, nextTrace)
                : undefined;

            scope.register(type)(identifier.name, value);
        }

        return;
    };
