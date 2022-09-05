/**
 * @author WMXPY
 * @namespace Mock
 * @description Trace
 */

import * as EST from "estree";
import { ScriptLocation } from "../../src/declare/script-location";
import { ITrace } from "../../src/declare/variable";
import { IMockedClass } from "./node";

export class MockTrace implements ITrace, IMockedClass {

    public scriptLocation: ScriptLocation;

    private _mockStack: EST.Node[];

    public constructor() {

        this.scriptLocation = ScriptLocation.createRoot();

        this._mockStack = [];
    }

    public get length(): number {

        return this._mockStack.length;
    }

    public get result(): EST.Node[] {

        return this._mockStack;
    }

    public reset(): this {

        this._mockStack = [];
        return this;
    }

    public getNode(): null {

        return null;
    }

    public getParent(): null {

        return null;
    }

    public stack(node: EST.Node): MockTrace {

        this._mockStack.push(node);
        return this;
    }
}
