/**
 * @author WMXPY
 * @namespace Util
 * @description Error
 */

import * as EST from "estree";

export enum ERROR_CODE {
    UNKNOWN_ERROR = 1000,
    ASSERT_EXIST_ELEMENT_NOT_EXIST = 2065,
    ASSERT_BOOLEAN_OPPOSITE = 2066,
    ASSERT_TYPE_NOT_MATCHED = 2067,
    VAR_DECLARATION_NOT_SUPPORT = 3003,
    BINARY_NOT_SUPPORT = 3004,
    UNARY_NOT_SUPPORT = 3005,
    UNMOUNTED_AST_TYPE = 6001,
    DUPLICATED_VARIABLE = 7005,
    VARIABLE_IS_NOT_DEFINED = 7102,
    INTERNAL_ERROR = 9001,
}

export const errorList: {
    [key: number]: string;
} = {
    1000: 'Unknown error',
    2065: 'Assert exist element not exist',
    2066: 'Assert boolean opposite',
    2067: 'Assert type not matched',
    3003: 'Declaration with [var] is not supported',
    3004: 'Binary is not supported',
    3005: 'Unary is not supported',
    6001: 'Unmounted ast type',
    7001: 'Duplicated variable declaration',
    7102: 'Variable is not defined',
    9001: 'Internal error',
};

/**
 * return new error string object of target error code
 *
 * @param {number} code
 * @returns {Error}
 */
export const error = (code: ERROR_CODE, info?: string, node?: EST.Node): Error => {
    const newError: Error = new Error();
    if (errorList[code]) {
        newError.message = code + ': ' + errorList[code] + (info ? (' - ' + info) : '' + (node || ''));
        newError.name = errorList[code];
        (newError as any).code = code;

        return newError;
    }
    newError.message = code + ': ' + errorList[code] + (info ? (' - ' + info) : '' + (node || ''));
    newError.name = errorList[9001];
    (newError as any).code = 9001;

    if ((newError as any).code > 9001) {
        console.log(newError);
    }

    return newError;
};