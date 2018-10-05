/**
 * @author WMXPY
 * @namespace Variable
 * @description Trace
 */

import * as EST from "estree";

export class Trace {
    public static init(): Trace {
        return new Trace();
    }

    private readonly _stack: EST.Node[];

    public constructor(stack?: EST.Node[]) {
        this._stack = stack || [];
    }

    public stack(node: EST.Node): Trace {
        return new Trace([...this._stack, node]);
    }
}
