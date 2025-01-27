/**
 * @author WMXPY
 * @namespace Util
 * @description Import
 */

import * as EST from "estree";
import { MarkedDebugBreakPoint } from "../debug/break-point/break-point";
import { ERROR_CODE } from "../declare/error-code";
import { END_SIGNAL, MarkedResult } from "../declare/evaluate";
import { ModuleResolveResult } from "../declare/sandbox";
import { IExposed, IScope, ITrace, VARIABLE_TYPE } from "../declare/variable";
import { EVALUATE_RESOURCE_END_SIGNAL, EvaluateResourceResult } from "../marked/declare";
import { Sandbox } from "../marked/sandbox";
import { parseNativeToSand } from "../parse/native-to-sand";
import { Flag } from "../variable/flag";
import { SandMap } from "../variable/sand-map";
import { error } from "./error/error";

const resolveModuleImport = async function (this: Sandbox, source: string, node: EST.ImportDeclaration, scope: IScope, currentTrace: ITrace, nextTrace: ITrace): Promise<boolean | Flag> {

    const targetModule: any | null = this.module(source);

    if (!Boolean(targetModule)) {
        return false;
    }

    for (const specifier of node.specifiers) {

        const target: any = await this.execute(specifier, scope, nextTrace);
        const register: (name: string, value: any) => void = scope.register(VARIABLE_TYPE.CONSTANT);

        switch (specifier.type) {

            case "ImportDefaultSpecifier": {

                if (!(typeof targetModule === "object" && Boolean(targetModule.default))) {

                    throw error(
                        ERROR_CODE.IMPORT_DEFAULT_OBJECT_HAVE_NO_DEFAULT_EXPORT,
                        target,
                        node,
                        currentTrace,
                    );
                }

                const moduleContent: any = targetModule.default;
                const parsedContent = parseNativeToSand(moduleContent);

                register(target, parsedContent);
                break;
            }
            case "ImportNamespaceSpecifier": {

                if (!(typeof targetModule === "object")) {
                    throw error(ERROR_CODE.IMPORT_OBJECT_NOT_FOUND, target, node, currentTrace);
                }

                const parsedContent = parseNativeToSand(targetModule);

                register(target, parsedContent);
                break;
            }
            case "ImportSpecifier": {

                const imported: string = specifier.imported.type === "Literal"
                    ? await this.execute(specifier.imported, scope, nextTrace)
                    : specifier.imported.name;

                if (!Boolean(targetModule[imported])) {
                    throw error(ERROR_CODE.IMPORT_OBJECT_NOT_FOUND, imported, node, currentTrace);
                }

                const moduleContent: any = targetModule[imported];
                const parsedContent = parseNativeToSand(moduleContent);

                register(target, parsedContent);
                break;
            }
            default: {

                throw error(ERROR_CODE.UNKNOWN_ERROR, (specifier as any).type, node, currentTrace);
            }
        }
    }

    return true;
};

const resolveDynamicImport = async function (this: Sandbox, source: string, node: EST.ImportDeclaration, scope: IScope, currentTrace: ITrace, nextTrace: ITrace): Promise<boolean | Flag> {

    const targetModule: ModuleResolveResult | null = await this.resolveResource(source, currentTrace);

    if (typeof targetModule !== "object"
        || !targetModule) {
        return false;
    }

    const breakPoints: Iterable<MarkedDebugBreakPoint> | undefined = currentTrace.hasBreakPointController()
        ? currentTrace.ensureBreakPointController().getBreakPoints()
        : undefined;

    const executer: EvaluateResourceResult = await this.evaluateResource(targetModule, breakPoints);
    if (executer.signal === EVALUATE_RESOURCE_END_SIGNAL.CYCLED_IMPORT) {

        const flag: Flag = Flag.fromFatal(currentTrace);
        const sourceScript: string = currentTrace.scriptLocation.hash();
        const targetScript: string = targetModule.scriptLocation.hash();

        flag.setValue(
            error(
                ERROR_CODE.CYCLED_IMPORT,
                `source: [${sourceScript}], target: [${targetScript}]`,
                node,
                currentTrace,
            ),
        );
        return flag;
    }

    if (executer.signal === EVALUATE_RESOURCE_END_SIGNAL.EVALUATE_FAILED) {

        const result: MarkedResult = executer.result;

        if (result.signal === END_SIGNAL.FAILED) {

            throw result.error;
        }

        const flag: Flag = Flag.fromThrow(currentTrace);
        flag.setValue(executer.result);
        return flag;
    }

    for (const specifier of node.specifiers) {

        const target: any = await this.execute(specifier, scope, nextTrace);
        const register: (name: string, value: any) => void = scope.register(VARIABLE_TYPE.CONSTANT);

        const exposed: IExposed = executer.executer.exposed;

        switch (specifier.type) {

            case "ImportDefaultSpecifier": {

                if (!Boolean(exposed.default)) {
                    throw error(

                        ERROR_CODE.IMPORT_DEFAULT_OBJECT_HAVE_NO_DEFAULT_EXPORT,
                        target,
                        node,
                        currentTrace,
                    );
                }

                register(target, exposed.default);
                break;
            }
            case "ImportNamespaceSpecifier": {

                const namedKeys: string[] = Object.keys(exposed.named);

                const importObject: Record<string, any> = {};
                namedKeys.forEach((key: string) => {
                    importObject[key] = exposed.named[key];
                });

                const map: SandMap<any> = SandMap.fromRawRecord(importObject);
                register(target, map);
                break;
            }
            case "ImportSpecifier": {

                const namedMap: Map<string, any> = new Map();
                const namedKeys: string[] = Object.keys(exposed.named);

                for (const namedKey of namedKeys) {
                    namedMap.set(namedKey, exposed.named[namedKey]);
                }

                const imported: string = specifier.imported.type === "Literal"
                    ? await this.execute(specifier.imported, scope, nextTrace)
                    : specifier.imported.name;

                if (!namedMap.has(imported)) {
                    throw error(ERROR_CODE.IMPORT_OBJECT_NOT_FOUND, imported, node, currentTrace);
                }

                register(target, namedMap.get(imported));
                break;
            }
            default: {

                throw error(ERROR_CODE.UNKNOWN_ERROR, (specifier as any).type, node, currentTrace);
            }
        }
    }

    return true;
};

export const resolveImport = async function (this: Sandbox, source: string, node: EST.ImportDeclaration, scope: IScope, currentTrace: ITrace, nextTrace: ITrace): Promise<boolean | Flag> {

    const bindResolveModuleImport = resolveModuleImport.bind(this);
    const result: boolean | Flag = await bindResolveModuleImport(source, node, scope, currentTrace, nextTrace);

    if (result instanceof Flag) {
        return result;
    }

    if (result) {
        return result;
    }

    const bindResolveDynamicImport = resolveDynamicImport.bind(this);
    return await bindResolveDynamicImport(source, node, scope, currentTrace, nextTrace);
};
