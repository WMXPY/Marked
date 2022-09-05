/**
 * @author WMXPY
 * @namespace CrossFile
 * @description Class
 * @override Integration Test
 */

import { expect } from 'chai';
import * as Chance from 'chance';
import { MarkedResult, Sandbox, ScriptLocation } from '../../../src';
import { assertSucceedMarkedResult } from '../../util/assert-result';

describe('Given Integration Cross File (Class) Cases', (): void => {

    const chance = new Chance('integration-cross-file-class');

    const createSandbox = () => {
        const sandbox: Sandbox = Sandbox.fromAllEvaluators();
        return sandbox;
    };

    it('should be able to execute cross file class instantiate', async (): Promise<void> => {

        const sandbox: Sandbox = createSandbox();

        const aValue: number = chance.integer({ min: 0, max: 100 });

        sandbox.resolver(() => {
            return {
                script: [
                    `class A{a=${aValue}}`,
                    `export default A;`,
                ].join('\n'),
                scriptLocation: ScriptLocation.create('mock', 'test'),
            };
        });

        const result: MarkedResult = await sandbox.evaluate(`import A from 'test';const a = new A();export default a.a;`);

        assertSucceedMarkedResult(result);

        expect(result.exports.default).to.be.equal(aValue);
    });
});
