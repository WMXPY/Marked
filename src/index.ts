/**
 * @author WMXPY
 * @description Index
 */

require('./binding');
import * as FS from 'fs';
import { useEverything } from 'marked#evaluate/evaluate';
import { internalPrint, internalSleep } from 'marked#extension/internal';
import { Sandbox } from './sandbox';

export const marked = async (script: string): Promise<number> => {
    console.time('execute');
    const sandbox = new Sandbox();
    useEverything(sandbox);
    sandbox.inject('print', internalPrint);
    sandbox.inject('sleep', internalSleep);
    try {
        await sandbox.evaluate(script);
    } catch (err) {
        throw err;
    }
    console.timeEnd('execute');
    return 0;
};

marked(FS.readFileSync('example/test.js', 'utf8')).then((result) => {
    console.log('result:', result);
}).catch((err) => {
    console.log('error:', err);
});