/**
 * @author WMXPY
 * @namespace Parse_Emit
 * @description Transform
 */

import * as TS from "typescript";
import { createTypeScriptComplierHost } from "../../host/complier";
import { Host_Target_File, New_Line_Character } from "../../host/declare";
import { TransformSourceMap } from "../../source-map/declare";

export type EmitTypeScriptTransformResult = {

    source: string;
    sourceMap: TransformSourceMap;
    declaration: string;
};

const sourceMapEnding: string = '//# sourceMappingURL=__$marked-target.js.map';

export const emitTypeScriptTransform = async (
    sourceCode: string,
): Promise<EmitTypeScriptTransformResult> => {


    const results: EmitTypeScriptTransformResult = {
        source: '',
        sourceMap: null as any,
        declaration: '',
    };

    const host: TS.CompilerHost = createTypeScriptComplierHost(
        sourceCode,
        (sourceCompiledCode: string) => {

            results.source = sourceCompiledCode;
            if (results.source.endsWith(sourceMapEnding)) {
                results.source = results.source.substring(
                    0,
                    results.source.length - sourceMapEnding.length
                );
            }
            if (results.source.endsWith(New_Line_Character)) {
                results.source = results.source.substring(
                    0,
                    results.source.length - New_Line_Character.length
                );
            }
        },
        (sourceMapCode: string) => {

            const parsed: any = JSON.parse(sourceMapCode);
            results.sourceMap = {
                sourceRoot: parsed.sourceRoot,
                mappings: parsed.mappings,
            };
        },
        (declarationCode: string) => {

            results.declaration = declarationCode;
            if (results.declaration.endsWith(New_Line_Character)) {
                results.declaration = results.declaration.substring(
                    0,
                    results.declaration.length - New_Line_Character.length
                );
            }
        },
    );
    const program: TS.Program = TS.createProgram({
        rootNames: [Host_Target_File],
        options: {
            declaration: true,
            sourceMap: true,
            strict: false,
            alwaysStrict: false,
            skipLibCheck: true,
            removeComments: true,
            skipDefaultLibCheck: true,
            target: TS.ScriptTarget.ESNext,
            newLine: TS.NewLineKind.LineFeed,
        },
        host,
    });
    program.emit();

    return results;
};
