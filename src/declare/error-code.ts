/**
 * @author WMXPY
 * @namespace Declare
 * @description Error Code
 */

export enum ERROR_CODE {

    UNKNOWN_ERROR = 1000,
    SCRIPT_CANNOT_BE_NULL_OR_UNDEFINED = 1001,

    PARSE_ERROR = 1100,
    TYPESCRIPT_COMPILE_ERROR = 1101,

    MAXIMUM_CODE_LENGTH_LIMIT_EXCEED = 1911,
    MAXIMUM_EXPRESSION_LIMIT_EXCEED = 1912,
    MAXIMUM_FOR_LOOP_LIMIT_EXCEED = 1913,
    MAXIMUM_FOR_OF_LOOP_LIMIT_EXCEED = 1914,
    MAXIMUM_FOR_IN_LOOP_LIMIT_EXCEED = 1915,
    MAXIMUM_WHILE_LOOP_LIMITED_EXCEED = 1916,
    MAXIMUM_DO_WHILE_LOOP_LIMITED_EXCEED = 1917,

    ASSERT_EXIST_ELEMENT_NOT_EXIST = 2065,
    ASSERT_BOOLEAN_OPPOSITE = 2066,
    ASSERT_TYPE_NOT_MATCHED = 2067,

    NEW_STATEMENT_SHOULD_CALL_ON_CLASS_ONLY = 2100,

    FOR_OF_LOOP_ONLY_FOR_LIST = 2387,
    FOR_IN_LOOP_ONLY_FOR_MAP = 2388,

    ONLY_NUMBER_AVAILABLE_FOR_LIST = 2391,
    ONLY_STRING_AVAILABLE_FOR_MAP = 2392,
    ONLY_STRING_AVAILABLE_FOR_CLASS = 2393,
    ONLY_STRING_AVAILABLE_FOR_CLASS_INSTANCE = 2394,

    MAP_ARGUMENT_SHOULD_BE_A_FUNCTION = 2410,
    FILTER_ARGUMENT_SHOULD_BE_A_FUNCTION = 2411,

    VAR_DECLARATION_NOT_SUPPORT = 3003,
    BINARY_NOT_SUPPORT = 3004,
    UNARY_NOT_SUPPORT = 3005,
    LOGICAL_NOT_SUPPORT = 3006,
    ASSIGNMENT_NOT_SUPPORT = 3007,
    UNDEFINED_TEST_NOT_SUPPORT = 3008,
    BESIDES_DECLARATION_NOT_SUPPORT = 3009,
    UNDEFINED_BESIDES_DECLARATION_NOT_SUPPORT = 3010,

    BREAK_LABEL_IS_NOT_SUPPORT = 3061,
    CONTINUE_LABEL_IS_NOT_SUPPORT = 3062,

    CONSTANT_VARIABLE_CANNOT_BE_EDITED = 3081,
    IMMUTABLE_VARIABLE_CANNOT_BE_EDITED = 3082,

    EXPORT_NAMED_NOT_SUPPORT = 3107,
    EXPORT_TYPE_OTHER_THAN_N_S_B_NOT_SUPPORT = 3108,

    IMPORT_ONLY_AVAILABLE_IN_ROOT_SCOPE = 3112,
    IMPORT_OBJECT_NOT_FOUND = 3113,
    IMPORT_NAMESPACE_IS_NOT_AN_OBJECT = 3114,
    IMPORT_DEFAULT_OBJECT_HAVE_NO_DEFAULT_EXPORT = 3115,

    PROPERTY_KIND_NOT_INIT_NOT_SUPPORT = 3151,

    NEGATIVE_UNARY_ONLY_AVAILABLE_FOR_VALID_NUMBER = 3310,

    UNKNOWN_LANGUAGE = 4050,

    UNMOUNTED_AST_TYPE = 6001,
    DUPLICATED_PROVIDED_MODULE_NAME = 6002,
    MODULE_IS_NOT_PROVIDED = 6003,

    CANNOT_TRANSFER_CLASS_TO_NATIVE = 6100,
    CANNOT_TRANSFER_FUNCTION_TO_NATIVE = 6101,

    MEMBER_EXPRESSION_VALUE_CANNOT_BE_UNDEFINED = 6121,

    DECLARATION_INIT_TYPE_NOT_MATCHED = 6201,
    DECLARATION_INIT_SIZE_NOT_MATCHED = 6202,

    DUPLICATED_VARIABLE = 7005,

    VARIABLE_IS_NOT_DEFINED = 7102,

    TRACE_SHOULD_BE_CLASS_TRACE = 7201,

    PROPERTY_SHOULD_BE_IDENTIFIER = 7301,

    CATCH_NOT_FOUND = 7501,

    SANDBOX_IS_BROKE = 7800,

    CANNOT_CALL_MEMBER_FUNCTION_OF_UNDEFINED = 8001,

    CANNOT_SPREAD_OTHER_THAN_ARRAY = 8101,
    CANNOT_SPREAD_OTHER_THAN_MAP = 8102,

    INTERNAL_ERROR = 9001,
}
