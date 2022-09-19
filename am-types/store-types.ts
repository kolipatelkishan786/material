import { ISchemaType } from './types';

export interface IApiSchema {
    name: string;
    path: string;
    requestType: ERequestMethod;
    categoryRedis: EAPICategoryRedis;

    headers?: ISupportedAPIParam[];
    autoAddHeaders?: boolean;
    queryParams?: ISupportedAPIParam[];
    autoAddQueryParams?: boolean;
    requestBodyTypeSupported?: EApiRequestBodyType[];
    reqBodySchema?: ISchemaType;
    reqQueryParametersSchema?: ISchemaType;
}

export interface ISupportedAPIParam {
    type: ESupportedAPIParamType;
    name: string;
    required: boolean;
    readonlyKey: boolean;
    readonlyValue: boolean;

    valueArr?: any[]; // to provide list for dropdown
    defaultValue?: any; // actual value
    value?: any,
    valueTemp?: any;
    nonRemovable?: boolean; // if it is true then it will not be removable from UI.

    // calculated UI properties
    isChecked?: boolean; // left side checkbox value
    id?: number; // left side checkbox value
}

export enum EAPICategoryRedis {
    GET_DATA = 'GET_DATA',
    MODIFY_DATA = 'MODIFY_DATA',
}

export enum EApiRequestBodyType {
    FORM_DATA = 'FORM_DATA',
    JSON = 'JSON',
    TEXT = 'TEXT',
}

export enum ERequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export enum ESupportedAPIParamType {
    // input supported types
    text = 'text',
    number = 'number',

    // custom types
    secret = 'secret',
    am_authorization = 'am_authorization',
    user_authorization = 'user_authorization',

    aws_authorization = 'aws_authorization',
    google_authorization = 'google_authorization',
    azure_authorization = 'azure_authorization',

    i18n = 'i18n',
    boolean = 'boolean',
    dropdown = 'dropdown',
    file = 'file',
    files = 'files',
}

// if new entry added, please add in headers.json5 also.
// If new entry added. Need to set in getStatusCodeFromResponseString also.
// duplicate with types.ts
export enum EContentType {
    JSON = 'application/json',
    XML = 'text/xml',
    YAML = 'text/yaml',
    TEXT = 'text/plain',
    HTML = 'text/html',
    OCTET_STREAM = 'application/octet-stream',
}

// keep all header values in lower case.
// find in considerHeadersInRedisKey = [ and adjust also
export enum EHeader {
    CONTENT_TYPE = 'content-type',
    ACCEPT_ENCODING = 'accept-encoding', // default br compression, identity = no compression, if accept-encoding header is not found br will be used. user can any of these values ['br', 'deflate', 'gzip', 'identity']
    NO_COMPRESSION_STD = 'x-no-compression', // standard compression header is supported by us.

    AUTHORIZATION_AM = 'x-am-authorization', // if API is not public then this token is mandatory.
    AUTHORIZATION_AM_USER = 'x-am-user-authorization', // used tor EAuthTokenType.AM_DB
    AUTHORIZATION_AWS = 'x-aws-authorization', // used tor EAuthTokenType.AWS
    AUTHORIZATION_GOOGLE = 'x-google-authorization', // used tor EAuthTokenType.AWS
    AUTHORIZATION_AZURE = 'x-azure-authorization', // used tor EAuthTokenType.AWS
    RUN_IN_SANDBOX = 'x-am-run-in-sandbox', // used tor EAuthTokenType.AWS

    ORIGIN = 'origin',
    AUTHORIZATION = 'authorization',
    META = 'x-am-meta', // true, false
    SECRET = 'x-am-secret',
    CONTENT_TYPE_RESPONSE = 'x-am-content-type-response', // EContentType
    CACHE_CONTROL = 'x-am-cache-control', // ECacheControl
    CODE_HASH = 'x-am-code-hash',
    SANDBOX_TIMEOUT = 'x-am-sandbox-timeout',
    GET_ENCRYPTED_DATA = 'x-am-get-encrypted-data', // EGetEncryptedData
    RESPONSE_CASE = 'x-am-response-case', // EResponseCase
    RESPONSE_OBJECT_TYPE = 'x-am-response-object-type', // EResponseObjectType
    AM_I18N = 'x-am-internationalization', // user's I18N data

    // response headers
    DATA_SOURCE = 'x-am-data-source', // api, cache

    // not for end users.
    TEST_HOOK = 'x-am-test-hook', // while testing hook, send this as true so only that code will be executed and other hooks will not be executed.
    TEST_EVENT = 'x-am-test-event', // it will be sent from UI when user is testing event code.
    SEND_ONLY_OBJECTS = 'x-am-send-only-objects-in-stream', // used by sandbox API calls internally.
    AM_FE_REQUEST = 'x-am-fe-request',
    AM_REQUEST_ID = 'x-am-request-id', // used to send requestId in response headers.
}

export enum ECacheControl {
    reset_cache = 'reset_cache',
    no_action = 'no_action',
}

// Duplicate with types.ts
export enum EDataSource {
    api = 'api',
    cache = 'cache',
}

export enum EGetEncryptedData {
    no_encryption = 'no_encryption',
    get_only_encryption = 'get_only_encryption',
    get_data_and_encryption = 'get_data_and_encryption',
}

export enum EResponseCase {
    noChange = 'noChange', // default, do not change user response
    camelCase = 'camelCase',
    capitalCase = 'capitalCase',
    constantCase = 'constantCase',
    dotCase = 'dotCase',
    headerCase = 'headerCase',
    noCase = 'noCase',
    paramCase = 'paramCase',
    pascalCase = 'pascalCase',
    pathCase = 'pathCase',
    sentenceCase = 'sentenceCase',
    snakeCase = 'snakeCase',
}

export enum EResponseObjectType {
    no_action = 'no_action',
    make_flat = 'make_flat',
}

export const HeadersPreBuilt = {
    Meta: <ISupportedAPIParam>{ name: EHeader.META, type: ESupportedAPIParamType.boolean, readonlyKey: true, readonlyValue: false, required: false, value: 'false', nonRemovable: true },
    ContentTypeResponseText: <ISupportedAPIParam>{
        name: EHeader.CONTENT_TYPE_RESPONSE,
        type: ESupportedAPIParamType.dropdown,
        readonlyKey: true,
        readonlyValue: false,
        required: false,
        valueArr: [
            EContentType.JSON,
            EContentType.XML,
            EContentType.YAML,
            // EContentType.TEXT,
            // EContentType.HTML,
            EContentType.OCTET_STREAM,
        ],
        value: EContentType.JSON,
        nonRemovable: true,
    },
    ResponseCase: <ISupportedAPIParam>{
        name: EHeader.RESPONSE_CASE,
        type: ESupportedAPIParamType.dropdown,
        readonlyKey: true,
        readonlyValue: false,
        required: false,
        valueArr: [
            EResponseCase.noChange, EResponseCase.camelCase, EResponseCase.capitalCase, EResponseCase.constantCase,
            EResponseCase.dotCase, EResponseCase.headerCase, EResponseCase.noCase, EResponseCase.paramCase,
            EResponseCase.pascalCase, EResponseCase.pathCase, EResponseCase.sentenceCase, EResponseCase.snakeCase,
        ],
        value: EResponseCase.noChange,
        nonRemovable: true,
    },
    ResponseObjectType: <ISupportedAPIParam>{
        name: EHeader.RESPONSE_OBJECT_TYPE,
        type: ESupportedAPIParamType.dropdown,
        readonlyKey: true,
        readonlyValue: false,
        required: false,
        valueArr: [EResponseObjectType.no_action, EResponseObjectType.make_flat],
        value: EResponseObjectType.no_action,
        nonRemovable: true,
    },
    ContentTypeResponseOctetStream: <ISupportedAPIParam>{ name: EHeader.CONTENT_TYPE_RESPONSE, type: ESupportedAPIParamType.dropdown, readonlyKey: true, readonlyValue: false, required: true, valueArr: [EContentType.OCTET_STREAM], value: EContentType.OCTET_STREAM, nonRemovable: true },
    CacheControl: <ISupportedAPIParam>{ name: EHeader.CACHE_CONTROL, type: ESupportedAPIParamType.dropdown, readonlyKey: true, readonlyValue: false, required: false, valueArr: [ECacheControl.no_action, ECacheControl.reset_cache], value: ECacheControl.no_action, nonRemovable: true },
    Secret: <ISupportedAPIParam>{ name: EHeader.SECRET, type: ESupportedAPIParamType.secret, readonlyKey: true, readonlyValue: false, required: false, value: '', nonRemovable: true },
    I18N: <ISupportedAPIParam>{ name: EHeader.AM_I18N, type: ESupportedAPIParamType.i18n, readonlyKey: true, readonlyValue: false, required: false, value: '', nonRemovable: true },
    SandboxRequestTimeout: <ISupportedAPIParam>{ name: EHeader.SANDBOX_TIMEOUT, type: ESupportedAPIParamType.number, readonlyKey: true, readonlyValue: false, required: false, value: 13000, nonRemovable: true },
    GetEncryptedData: <ISupportedAPIParam>{ name: EHeader.GET_ENCRYPTED_DATA, type: ESupportedAPIParamType.dropdown, readonlyKey: true, readonlyValue: false, required: false, valueArr: [EGetEncryptedData.no_encryption, EGetEncryptedData.get_only_encryption, EGetEncryptedData.get_data_and_encryption], value: EGetEncryptedData.no_encryption, nonRemovable: true },

    AuthorizationAM: <ISupportedAPIParam>{ name: EHeader.AUTHORIZATION_AM, type: ESupportedAPIParamType.am_authorization, readonlyKey: true, readonlyValue: true, required: true, nonRemovable: true },
    AuthorizationAMUser: <ISupportedAPIParam>{ name: EHeader.AUTHORIZATION_AM_USER, type: ESupportedAPIParamType.user_authorization, readonlyKey: true, readonlyValue: false, required: true, nonRemovable: true, value: '' },

    AuthorizationAWS: <ISupportedAPIParam>{ name: EHeader.AUTHORIZATION_AWS, type: ESupportedAPIParamType.aws_authorization, readonlyKey: true, readonlyValue: false, required: true, nonRemovable: true, value: '' },
    AuthorizationGoogle: <ISupportedAPIParam>{ name: EHeader.AUTHORIZATION_GOOGLE, type: ESupportedAPIParamType.google_authorization, readonlyKey: true, readonlyValue: false, required: true, nonRemovable: true, value: '' },
    AuthorizationAzure: <ISupportedAPIParam>{ name: EHeader.AUTHORIZATION_AZURE, type: ESupportedAPIParamType.azure_authorization, readonlyKey: true, readonlyValue: false, required: true, nonRemovable: true, value: '' },
    RunInSandbox: <ISupportedAPIParam>{ name: EHeader.RUN_IN_SANDBOX, type: ESupportedAPIParamType.number, readonlyKey: true, readonlyValue: false, required: false, nonRemovable: true, value: 0 },
};
