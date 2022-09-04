/**
 * @author WMXPY
 * @namespace Marked
 * @description Marked
 */

import { ERROR_CODE } from '../declare/error-code';
import { MarkedResult } from '../declare/evaluate';
import { IMarkedOptions, OptionName } from '../declare/sandbox';
import { error } from '../util/error/error';
import { Sandbox } from './sandbox';

export const marked = async (
    script: string,
    options?: IMarkedOptions,
): Promise<MarkedResult> => {

    if (!script) {

        throw error(ERROR_CODE.SCRIPT_CANNOT_BE_NULL_OR_UNDEFINED);
    }

    const fixedOptions: IMarkedOptions = options ?? {};

    const sandbox: Sandbox = Sandbox.fromAllEvaluators(fixedOptions.language);

    if (typeof fixedOptions.injects !== 'undefined') {
        Object.keys(fixedOptions.injects).forEach((key: string) =>
            sandbox.inject(key, (fixedOptions.injects as any)[key]));
    }
    if (typeof fixedOptions.provides !== 'undefined') {
        Object.keys(fixedOptions.provides).forEach((key: string) =>
            sandbox.provide(key, (fixedOptions.provides as any)[key]));
    }
    if (typeof fixedOptions.resolvers !== 'undefined') {
        for (const resolver of fixedOptions.resolvers) {
            sandbox.resolver(resolver);
        }
    }
    if (typeof fixedOptions.sandbox !== 'undefined') {
        Object.keys(fixedOptions.sandbox as any).forEach((key: any) =>
            sandbox.setOption(key as OptionName, (fixedOptions.sandbox as any)[key]));
    }
    if (typeof fixedOptions.debugInterceptor !== 'undefined') {
        sandbox.setDebugInterceptor(fixedOptions.debugInterceptor);
    }

    return await sandbox.evaluate(script);
};
