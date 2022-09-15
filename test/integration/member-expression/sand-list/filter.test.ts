/**
 * @author WMXPY
 * @namespace MemberExpression_SandList
 * @description Filter
 * @override Integration Test
 */

import { expect } from 'chai';
import * as Chance from 'chance';
import { MarkedResult, Sandbox } from '../../../../src';
import { New_Line_Character } from '../../../../src/host/declare';
import { assertSucceedMarkedResult } from '../../../util/assert-result';

describe('Given Integration Member Expression Sand List (Filter) Cases', (): void => {

    const chance = new Chance('integration-member-expression-sand-list-filter');

    const createSandbox = () => {
        const sandbox: Sandbox = Sandbox.fromAllEvaluators();
        return sandbox;
    };

    it('should be able to execute filter', async (): Promise<void> => {

        const sandbox: Sandbox = createSandbox();

        const result: MarkedResult = await sandbox.evaluate([
            `const list = [1, 2, 3, 4, 5];`,
            `const result = list.filter((each) => each > 3);`,
            `export default result;`,
        ].join(New_Line_Character));

        assertSucceedMarkedResult(result);

        expect(result.exports.default).to.be.deep.equal([4, 5]);
    });

    it('should be able to execute filter with string', async (): Promise<void> => {

        const sandbox: Sandbox = createSandbox();
        sandbox.inject('test', {
            "layer1": () => {
                return {
                    "layer2": () => {
                        return ["layer3"];
                    }
                };
            },
        });

        const result: MarkedResult = await sandbox.evaluate([
            `const result = test.layer1().layer2().filter((each) => true);`,
            `export default result;`,
        ].join(New_Line_Character));

        assertSucceedMarkedResult(result);

        expect(result.exports.default).to.be.deep.equal(["layer3"]);
    });

    it('should be able to execute filter with additional arguments', async (): Promise<void> => {

        const sandbox: Sandbox = createSandbox();
        sandbox.setAdditionalArgument(chance.string());

        const result: MarkedResult = await sandbox.evaluate([
            `const list = [1, 2, 3, 4, 5];`,
            `const result = list.filter((each) => each > 3);`,
            `export default result;`,
        ].join(New_Line_Character));

        assertSucceedMarkedResult(result);

        expect(result.exports.default).to.be.deep.equal([4, 5]);
    });
});
