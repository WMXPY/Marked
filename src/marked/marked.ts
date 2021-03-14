/**
 * @author WMXPY
 * @description Simple
 */

import { ERROR_CODE } from '../declare/error';
import { END_SIGNAL, MarkedResult } from '../declare/evaluate';
import { IMarkedOptions, OptionName } from '../declare/sandbox';
import { useEverything } from '../evaluate/evaluate';
import { error } from '../util/error/error';
import { Sandbox } from './sandbox';

export const marked = async (script: string, options?: IMarkedOptions): Promise<MarkedResult> => {

    if (!script) {

        throw error(ERROR_CODE.SCRIPT_CANNOT_BE_NULL_OR_UNDEFINED);
    }

    const sandbox: Sandbox = Sandbox.create();
    useEverything(sandbox);

    if (options) {

        if (options.injects) {
            Object.keys(options.injects).forEach((key: string) =>
                sandbox.inject(key, (options.injects as any)[key]));
        }
        if (options.provides) {
            Object.keys(options.provides).forEach((key: string) =>
                sandbox.provide(key, (options.provides as any)[key]));
        }
        if (options.sandbox) {
            Object.keys(options.sandbox as any).forEach((key: any) =>
                sandbox.setOption(key as OptionName, (options.sandbox as any)[key]));
        }
    }

    return await sandbox.evaluate(script);
};
