export interface IAMGlobal {
    req: IAMGlobalRequest;
    res: IAMGlobalResponse;
    sys: IAMGlobalSys;
    logger: IAMGlobalLogger;
    shared: any;
}

export interface IAMGlobalLogger {
    debug(...data: any[]): void;
    log(...data: any[]): void;
    info(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
}

export interface IAMGlobalRequest {
    headers: any;
    params: any;
    query: any;
    body: any;
    eventData: any;
    auth: ISandboxReqAuthObj;
}

export interface ISandboxReqAuthObj {
    authAMUser?: any;
    authAMDB?: any;
    authGoogle?: any;
    authAWS?: any;
    authAzure?: any;
}

// duplicate with store-types
export enum EContentType {
    JSON = 'application/json',
    XML = 'text/xml',
    YAML = 'text/yaml',
    TEXT = 'text/plain',
    HTML = 'text/html',
    OCTET_STREAM = 'application/octet-stream',
}

// duplicate with store-types
export enum ERequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export interface IAMGlobalResponse {
    /** Status code of response. ex: 401, 500 */
    statusCode?: EStatusCode;

    /** Change content-type header of response. default is 'application/json' */
    contentType?: EContentType;

    /** It will be sent to user as response of api call. */
    output?: any;

    /** Shared object for user to use. */
    shared?: any;

    /** * List of errors. If any error occurs. It will be returned to user. */
    errors?: IResponseError[];

    /** List of errors. If any error occurs. It will be returned to user. */
    warnings?: IResponseError[];
}

export enum EType {
    string = 'string',
    number = 'number',
    boolean = 'boolean',
    date = 'date',
    objectId = 'objectId',

    // below are added because of third party request body
    file = 'file',
    files = 'files'
}

export enum EErrorType {
    required = 'required',
    min = 'min',
    max = 'max',
    minLength = 'minLength',
    maxLength = 'maxLength',
    unique = 'unique',
    uniqueCombination = 'uniqueCombination', // multiple keys unique violated
    invalidValue = 'invalidValue',
    schemaKeyNotFound = 'schemaKeyNotFound',
    schemaNotFound = 'schemaNotFound',
}

// Main interfaces
export interface ISchemaType {
    [key: string]: IAnySchemaPropertyType;
}

export type IAnySchemaPropertyType = EType | [EType] | ISchemaProperty | [ISchemaProperty] | ISchemaType | [ISchemaType];

export interface ISchemaProperty { // Add new schema property in ValidateDBSchema too
    __type?: EType;
    conversions?: IPropertyConversion;
    validations?: IPropertyValidation;

    instance?: string; // used as strings in _.get
    database?: string; // used as strings in _.get
    collection?: string; // used as strings in _.get
    table?: string;

    // this column value will be return after nested save.
    column?: string; // user can define column of target collection here. so no need to define t_key in deep property. Used in getDataForDeep // used as strings in _.get
    isPrimaryKey?: boolean;

    /** Database will take care of assigning incremental value for this field. */
    isAutoIncrementByDB?: boolean;

    /** API Maker will take care of assigning incremental value for this field. */
    isAutoIncrementByAM?: boolean | { start: number; step: number; };
    // defaultValue?: any; it can be very dynamic so skipping it right now.
}

export interface IPropertyValidation {
    required?: boolean; // Allowed Types : *
    min?: number; // Allowed Types : number | date
    max?: number; // Allowed Types : number | date
    minLength?: number; // Allowed Types : string
    maxLength?: number; // Allowed Types : string
    unique?: boolean;
    email?: boolean; // Allowed Types : string
    validatorFun?: Function;
}

export interface IPropertyConversion {
    trimStart?: boolean;
    trimEnd?: boolean;
    trim?: boolean;
    toLowerCase?: boolean;
    toUpperCase?: boolean;
    conversionFun?: Function;

    /** enable encryption for this property */
    encryption?: boolean | IEncryptionDescription;

    /** enable description for this property */
    decryption?: boolean | IEncryptionDescription;

    /** enable hashing for this property */
    hashing?: boolean | IPropertyHashing;
}

export interface IEncryptionDescription {
    /** by default is DB for encryption and User for decryption. value will be encrypted while sending to DB | User */
    sendingTo?: ESendingToSchema;

    /** algorithm path within secret object. default: common.encryptionAlgorithm */
    encryptionAlgorithm?: string;

    /** secret path within secret object. default: common.secret */
    secret?: string;

    /** nonce path within secret object. default: common.nonce, common.secret */
    nonce?: string;
}

export interface IPropertyHashing {

    /** by default is DB for encryption and User for decryption. value will be encrypted while sending to DB | User */
    sendingTo?: ESendingToSchema;

    /** algorithm path within secret object. default: common.hashingAlgorithm */
    hashingAlgorithm?: string;

    /** secret path within secret object. default: common.secret */
    secret?: string;
}

export enum ESendingToSchema {
    DB = 'DB',
    USER = 'USER',
}

export interface IDownloadResponse {
    __am__downloadFilePath?: string;
    __am__downloadFolderPaths?: string[];
    __am__downloadFolderFileName?: string;
}

export enum ESpecialParamKeyNames {
    path = 'path', // it will be used in file upload or download in ftp/s3/azure and engine will try to fetch file name with extension to throw for download with name & extension
}

// Below interface is used in Secret Management.
export interface ISecretType {
    common?: ISecretTypeCommon; // it is general purpose secret key section.
}

export interface ISecretTypeCommon extends Pick<IAuthTokenInfoCommon, 'authTokenInfo'> {
    hashingAlgorithm?: 'SHA256'; // change in IPropertyHashing also
    encryptionAlgorithm?: 'AES' | 'RC4' | 'TRIPLEDES';
    secret?: string;
    nonce?: string; // if it is available, it will be used for hashing, if not available secret will be used for hashing
    connectionString: {
        mongodb?: string;
        mysql?: string;
        mariadb?: string;
        sqlServer?: string;
        postgreSQL?: string;
        oracle?: string;
    }
}

export interface IAuthTokenInfo {
    authTokenType?: EAuthTokenType;
    authTokenAM?: IAuthTokenAM;
    authTokenAMDB?: IAuthTokenAMDB | IAuthTokenAMDB[];

    authTokenAWS?: IAuthTokenAWS | IAuthTokenAWS[];
    authTokenAzureAD?: IAuthTokenAzureAD | IAuthTokenAzureAD[];
    authTokenGoogle?: IAuthTokenGoogle | IAuthTokenGoogle[];
    testObj?: any;
}

export interface IAuthTokenAM {
    u: string;
    p: string;
}

export interface IAuthTokenAMDB extends Partial<IAuthTokenAM> {
    instance?: string;
    database?: string;
    collection?: string;
    table?: string;
    usernameColumn?: string;
    passwordColumn?: string;
    countOfUsersForTesting: number; // load these much users in dropdown.

    condition?: any;
    sortUsersForTesting: any; // sorting condition for dropdown
    select?: any;
}

export interface IAuthTokenAWS {
    cognitoUserPoolId: string;
    region: string;
    tokenUse: 'access' | 'id'; // Possible Values: access | id
    tokenExpiration: number; // Up to default expiration of 1 hour (3600000 ms)
}

export interface IAuthTokenAzureAD {
    audience: string;
    issuer: string;

    tenant: string;
    appId: string;
    maxRetries: number;
}

export interface IAuthTokenGoogle {
    clientId: string;
}

export interface IConnectionOptions {
    title: '', // title of the option
    text?: '', // description of the connection option
    sample?: '' // sample connection string of that option
}

export interface IResponseError {
    type?: EErrorType;
    field?: string;
    message?: string;
    action?: string; // we can give message in this to solve this error or issue.
    value?: any;
    code?: EStatusCode;
    systemMessage?: string;
    dataIndex?: number;
    stack?: any; // it might be present.
}

export enum EApiPaths {
    API = '/api',
    GEN = '/gen',
    SCHEMA = '/schema',
    THIRD_PARTY = '/third-party',
    THIRD_PARTY_STORE = '/third-party-store',
    CUSTOM_API = '/custom-api',
    SYSTEM_API = '/system-api',
    SITES = '/sites',

    // test--hook is hard coded in eval utils so please change that also if changing.
    TEST_HOOK = '/test--hook', // it is special url for custom api for hook to test hook code.
    ENCRYPT_DATA = '/encrypt-data',
    DECRYPT_DATA = '/decrypt-data',
    HASH_DATA = '/hash-data',
    GET_TOKEN = '/token',
    CALL_EXTERNAL_API = '/call-external-api',
    EXECUTE_PLAIN_QUERY = '/execute-plain-query', // it is special url for executing
    GET_SECRET_BY_NAME = '/get-secret-by-name', // it is special url for executing
    GET_REDIS_KEY = '/get-redis-key',
    SET_REDIS_KEY = '/set-redis-key',
    REMOVE_REDIS_KEY = '/remove-redis-key',
    RESET_REDIS_CACHE_DB = '/reset-redis-cache-db',
    RESET_REDIS_CACHE_CUSTOM_APIS = '/reset-redis-cache-custom-apis',
    RESET_REDIS_CACHE_SYSTEM_APIS = '/reset-redis-cache-system-apis',
    RESET_REDIS_CACHE_TP_APIS = '/reset-redis-cache-third-party-apis',

    GET_TABLE_META = '/get-table-meta', // get table meta data for sql databases in some common format.
    EMIT_EVENT = '/emit-event',
    EMIT_EVENT_WS = '/emit-event-ws',

    // validations
    IS_VALID_DATA_FOR_TABLE = '/is-valid-data-for-table',
    IS_VALID_DATA_FOR_CUSTOM_API = '/is-valid-data-for-custom-api',
    IS_VALID_DATA_FOR_THIRD_PARTY_API = '/is-valid-data-for-third-party-api',
}

export interface IQueryFormat {
    find?: any;
    find_join?: IFindJoinFormat[];
    sort?: any;
    skip?: number;
    limit?: number;
    select?: any;
    deep?: IDeepFormat[]; // do not use it, it will return old cached obj because of caching so do not use it.
    set?: any; // It will be used for bulk update.
    groupBy?: any; // it is used in mysql query
    updateData?: any; // it is used in updateMany API
    getTotalCount?: boolean; // return total count if it's value is true.
}

export interface IDeepFormat {
    s_key: string;
    // t_apiPath?: string;
    t_instance?: string;
    t_db?: string;
    t_col?: string;
    t_key?: string;
    deep?: IDeepFormat[];
    select?: any;

    // below are additional feature properties newly added to give more flexibility in populate.
    isMultiple?: boolean;
    find?: any;
    sort?: any;

    // skip & limit can not be supported directly in query, because query is in query with all the ids of array.
    // We process skip & limit while setting multiple data.
    skip?: number;
    limit?: number;

    // below is used in deep
    selectFromNextDeep?: any;
}

export interface IFindJoinFormat {
    t_instance?: string;
    t_db?: string;
    t_col: string;
    find: any;

    find_key_target?: string; // after find, put list of ids in this key of find // ex: address.country, address
    find_id_source?: string; // get ids from this source key instead of find property // ex: address.country
    sourceTablePrimaryKey?: string; // it will be present when user defines column in source/parent table schema. We will use it instead of child table primary key.
}

// It is used internally & for users also.
/**
 * Create array of this interface in schema.
 * It will be validated on every update/save
 */
export interface IDataValidation {
    name?: string;
    paths: string[];
    type: EDataValidationType;
    errorMessage?: string | any; // This string will be return to user if it is available.
}

export enum EDataValidationType {
    SUPER_KEY = 'SUPER_KEY', // this combination of keys should be unique, Make sure they are required field.
}

export enum EStatusCode {
    OK = 200,
    NO_CONTENT = 204, // do not use this because it will not send our data with null.
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403, // client is authenticated but doesn't have access.
    RESOURCE_NOT_FOUND = 404, // convert 405(Method not allowed) in this 404.
    INTERNAL_SERVER_ERROR = 500,
}

export interface ICallApiFromBackend {
    url: string;
    method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
    timeout?: number;
    body?: any;
    queryParams?: any;
    headers?: any;
    id?: string;
    preProcess?: ICallApiFromBackendDataProcess[];
    postProcess?: ICallApiFromBackendDataProcess[];
    output?: any;
}

export interface ICallApiFromBackendDataProcess {
    from?: string; // '1.resp.id'
    to?: string; // 'body.orderId'
}

export interface ICallApiFromBackendProcess {
    type: EApiCallType,
    data: ICallApiFromBackendProcess | ICallApiFromBackend[];
}

export enum EApiCallType {
    parallel = 'parallel',
    sequential = 'sequential',
}

export interface IArrayOperationBody {
    find: any;
    select?: any;
    operations: IArrayOperation[];
}

export interface IArrayOperation {
    operation?: EArrayOperation;
    path?: string;
    dataToPush?: any[]; // $push, used for push operation. Array/Object of data to pushe in array.
    queryToRemove?: any; // $pull, query to remove docs from array.
    dataToPull?: any[]; // $pullAll, array of items which will be removed from array.
    direction?: -1 | 1; // $pop, -1 remove first, 1 remove last.
    position?: number; // $push, used in push. If dataToPush is array we can use it with $each operator.
    slice?: number; // $push, must use with $each, used in push. positive = remove that much elements from front of array. negative = remove items from end of array
    sort?: number; // $push, must use with $each, used in push.
    dataToSet?: any; // object to be passed in $set operator
    arrayFilters?: any[]; // array of objects, to be used to filter array items and set values of $set operator.
    upsert?: boolean; // if value not found in $set operation it will insert new value there.
}

export interface IGetTokenResponse {
    token: string;
}

export interface IAuthTokenInfoCommon {
    apiAccessType?: EAPIAccessType; // api level setting
    authTokenInfo?: IAuthTokenInfo[];
}

export interface IInstanceApiSettingsTypes extends IAuthTokenInfoCommon {
    enableCaching?: boolean; // collection level setting
    amCanUseQueryApi?: boolean; // common setting
}

export interface IThirdPartyApiSettingsTypes extends IAuthTokenInfoCommon {
    enableCaching?: boolean; // collection level setting
}

export interface ICustomApiSettingsTypes extends IAuthTokenInfoCommon {
    name: string;
    label: string;
    path: string;
    methodType: ERequestMethod;
    enableCaching?: boolean; // collection level setting

    reqBodySchema?: ISchemaType;
    reqQueryParametersSchema?: ISchemaType;
}

export interface ISystemApiSettingsTypes extends IAuthTokenInfoCommon {
    enableCaching?: boolean; // collection level setting
}

export enum EAuthTokenType {
    AM = 'AM', // API Maker user token
    AM_DB = 'AM_DB', // User database entry
    GOOGLE = 'GOOGLE',
    AWS = 'AWS',
    AZURE = 'AZURE',
    // GITHUB = 'GITHUB',
    // FACEBOOK = 'FACEBOOK',
    // TWITTER = 'TWITTER',
}

export enum EArrayOperation {
    push = 'push',
    addToSet = 'addToSet',
    pull = 'pull',
    pullAll = 'pullAll',
    pop = 'pop',
    set = 'set',
}

export enum EAPIAccessType {
    IS_PUBLIC = 'IS_PUBLIC',
    TOKEN_ACCESS = 'TOKEN_ACCESS',
}

export interface IAMGlobalSys {
    db: ICommonApisSchema;
    system: IAMGlobalSysSystem;
    cache: IAMGlobalSysCache;
}

export interface ICommonApisSchema {
    gen: ICommonApisGen;
    /**
     * => Returns [an array of objects].
     */
    getAll<T>(query: IApiParamsGetAll): Promise<T[] | null>;
    getAll<T>(query: IApiParamsGetAll, getFullResponse: boolean): Promise<IAPIResponse<T[] | null>>;

    getAllByStream<T>(query: IApiParamsGetAll, callback: (data: T) => void): Promise<void>;
    /**
     * => Returns [a single object].
     */
    getById<T>(query: IApiParamsGetById): Promise<T>;
    getById<T>(query: IApiParamsGetById, getFullResponse: boolean): Promise<IAPIResponse<T>>;
    /**
     * => Returns [a object] or [an array of objects].
     */
    saveSingleOrMultiple<T>(query: IApiParamsSave): Promise<T | T[]>;
    saveSingleOrMultiple<T>(query: IApiParamsSave, getFullResponse: boolean): Promise<IAPIResponse<T | T[]>>;
    /**
     * => Returns [a object] or [an array of objects].
     */
    masterSave<T>(query: IApiParamsSave): Promise<T | T[]>;
    masterSave<T>(query: IApiParamsSave, getFullResponse: boolean): Promise<IAPIResponse<T | T[]>>;

    arrayOperations<T>(query: IArrayOperationBody & IAMGlobalBaseParams): Promise<T>;
    arrayOperations<T>(query: IArrayOperationBody & IAMGlobalBaseParams, getFullResponse: boolean): Promise<IAPIResponse<T>>;
    /**
     * => Returns [a single object].
     */
    updateById<T>(query: IApiParamsUpdate): Promise<T>;
    updateById<T>(query: IApiParamsUpdate, getFullResponse: boolean): Promise<IAPIResponse<T>>;
    /**
     * => Returns [updatedRowsCount].
     */
    updateMany(query: IApiParamsUpdateMany): Promise<IUpdateManyAPIResponse>;
    updateMany(query: IApiParamsUpdateMany, getFullResponse: boolean): Promise<IAPIResponse<IUpdateManyAPIResponse>>;
    /**
     * => Returns [a single object].
     */
    replaceById<T>(query: IApiParamsUpdate): Promise<T>;
    replaceById<T>(query: IApiParamsUpdate, getFullResponse: boolean): Promise<IAPIResponse<T>>;
    /**
     * => Returns [a single object].
     */
    removeById<T>(query: IApiParamsRemove): Promise<T>;
    removeById<T>(query: IApiParamsRemove, getFullResponse: boolean): Promise<IAPIResponse<T>>;
    removeByQuery<T>(query: Pick<IApiParamsQuery, 'instance' | 'database' | 'collection' | 'find'>): Promise<T>;
    removeByQuery<T>(query: Pick<IApiParamsQuery, 'instance' | 'database' | 'collection' | 'find'>, getFullResponse: boolean): Promise<IAPIResponse<T>>;
    /**
     * => Returns [an array of objects].
     */
    query<T>(query: IApiParamsQuery): Promise<T[]>;
    query<T>(query: IApiParamsQuery, getFullResponse: boolean): Promise<IAPIResponse<T[]>>;

    queryByStream<T>(query: IApiParamsQuery, callback: (data: T) => void): Promise<void>;

    aggregate(query: IApiParamsAggregate): Promise<any>;
    aggregate(query: IApiParamsAggregate, getFullResponse: boolean): Promise<IAPIResponse<any>>;

    count(query: IApiParamsCount): Promise<number>;
    count(query: IApiParamsCount, getFullResponse: boolean): IAPIResponse<number>;

    distinct(query: Omit<IApiParamsDistinct, 'find'>): Promise<any[]>;
    distinct(query: Omit<IApiParamsDistinct, 'find'>, getFullResponse: boolean): Promise<IAPIResponse<any[]>>;

    distinctQuery(query: IApiParamsDistinct): Promise<any[]>;
    distinctQuery(query: IApiParamsDistinct, getFullResponse: boolean): Promise<IAPIResponse<any[]>>;
}

export interface ICommonApisGen {
    /**
     * => Returns [an array of objects].
     */
    getAllGen<T>(query: IApiParamsGetAll): Promise<T[] | null>;
    getAllGen<T>(query: IApiParamsGetAll, getFullResponse: boolean): Promise<IAPIResponse<T[] | null>>;

    getAllByStreamGen<T>(query: IApiParamsGetAll, callback: (data: T) => void): Promise<void>;
    /**
     * => Returns [a single object].
     */
    getByIdGen<T>(query: IApiParamsGetById): Promise<T>;
    getByIdGen<T>(query: IApiParamsGetById, getFullResponse: boolean): Promise<IAPIResponse<T>>;
    /**
     * => Returns [a object] or [an array of objects].
     */
    saveSingleOrMultipleGen<T>(query: IApiParamsSave): Promise<T | T[]>;
    saveSingleOrMultipleGen<T>(query: IApiParamsSave, getFullResponse: boolean): Promise<IAPIResponse<T | T[]>>;
    /**
     * => Returns [a object] or [an array of objects].
     */
    masterSaveGen<T>(query: IApiParamsSave): Promise<T | T[]>;
    masterSaveGen<T>(query: IApiParamsSave, getFullResponse: boolean): Promise<IAPIResponse<T | T[]>>;

    arrayOperationsGen<T>(query: IArrayOperationBody & IAMGlobalBaseParams): Promise<T>;
    arrayOperationsGen<T>(query: IArrayOperationBody & IAMGlobalBaseParams, getFullResponse: boolean): Promise<IAPIResponse<T>>;
    /**
     * => Returns [a single object].
     */
    updateByIdGen<T>(query: IApiParamsUpdate): Promise<T>;
    updateByIdGen<T>(query: IApiParamsUpdate, getFullResponse: boolean): Promise<IAPIResponse<T>>;
    /**
     * => Returns [updatedRowsCount].
     */
    updateManyGen(query: IApiParamsUpdateMany): Promise<IUpdateManyAPIResponse>;
    updateManyGen(query: IApiParamsUpdateMany, getFullResponse: boolean): Promise<IAPIResponse<IUpdateManyAPIResponse>>;
    /**
     * => Returns [a single object].
     */
    replaceByIdGen<T>(query: IApiParamsUpdate): Promise<T>;
    replaceByIdGen<T>(query: IApiParamsUpdate, getFullResponse: boolean): Promise<IAPIResponse<T>>;
    /**
     * => Returns [a single object].
     */
    removeByIdGen<T>(query: IApiParamsRemove): Promise<T>;
    removeByIdGen<T>(query: IApiParamsRemove, getFullResponse: boolean): Promise<IAPIResponse<T>>;
    removeByQueryGen<T>(query: Pick<IApiParamsQuery, 'instance' | 'database' | 'collection' | 'find'>): Promise<T>;
    removeByQueryGen<T>(query: Pick<IApiParamsQuery, 'instance' | 'database' | 'collection' | 'find'>, getFullResponse: boolean): Promise<IAPIResponse<T>>;
    /**
     * => Returns [an array of objects].
     */
    queryGen<T>(query: IApiParamsQuery): Promise<T[]>;
    queryGen<T>(query: IApiParamsQuery, getFullResponse: boolean): Promise<IAPIResponse<T[]>>;

    queryByStreamGen<T>(query: IApiParamsQuery, callback: (data: T) => void): Promise<void>;

    aggregateGen(query: IApiParamsAggregate): Promise<any>;
    aggregateGen(query: IApiParamsAggregate, getFullResponse: boolean): Promise<IAPIResponse<any>>;

    countGen(query: IApiParamsCount): Promise<number>;
    countGen(query: IApiParamsCount, getFullResponse: boolean): IAPIResponse<number>;

    distinctGen(query: Omit<IApiParamsDistinct, 'find'>): Promise<any[]>;
    distinctGen(query: Omit<IApiParamsDistinct, 'find'>, getFullResponse: boolean): Promise<IAPIResponse<any[]>>;

    distinctQueryGen(query: IApiParamsDistinct): Promise<any[]>;
    distinctQueryGen(query: IApiParamsDistinct, getFullResponse: boolean): Promise<IAPIResponse<any[]>>;
}

export interface IAMGlobalSysSystem {
    encrypt(body: any): Promise<string>;
    decrypt(body: string): Promise<any>;
    hash(body: any);
    getSecret(name: string | string[]);
    callExternalApi(data: ICallApiFromBackend | ICallApiFromBackend[] | ICallApiFromBackendProcess | ICallApiFromBackendProcess[] | (ICallApiFromBackend | ICallApiFromBackendProcess)[]);
    getToken(data: IAuthTokenInfo | IAuthTokenInfo[]),
    executeQuery(query: IExecuteQuery);
    /**
     * It should be used SQL based databases only.
     * In MongoDB You can just modify schema. but we can use for mongo also.
     */
    getTableMeta(data: Omit<IAMGlobalBaseParams, 'headers'>);
    emitEvent<D>(eventName: string, eventData?: D, executeListeners?: string[]): Promise<IEmitEvent<D>>;
    emitEventWS<D>(eventName: string, eventData?: D): Promise<void>;

    // data validation
    isValidDataForTable(data: IIsValidDataForTable): Promise<IResponseError[]>;
    isValidDataForTable(data: IIsValidDataForTable[]): Promise<IResponseError[][]>;
    isValidDataForTable(data: IIsValidDataForTable, getFullResponse: boolean): Promise<IResponseError[]>;
    isValidDataForTable(data: IIsValidDataForTable[], getFullResponse: boolean): Promise<IResponseError[][]>;

    isValidDataForCustomAPI(data: IIsValidDataForCustomAPI): Promise<IResponseError[]>;
    isValidDataForCustomAPI(data: IIsValidDataForCustomAPI[]): Promise<IResponseError[][]>;
    isValidDataForCustomAPI(data: IIsValidDataForCustomAPI, getFullResponse: boolean): Promise<IResponseError[]>;
    isValidDataForCustomAPI(data: IIsValidDataForCustomAPI[], getFullResponse: boolean): Promise<IResponseError[][]>;

    isValidDataForThirdPartyAPI(data: IIsValidDataForThirdPartyAPI): Promise<IResponseError[]>;
    isValidDataForThirdPartyAPI(data: IIsValidDataForThirdPartyAPI[]): Promise<IResponseError[][]>;
    isValidDataForThirdPartyAPI(data: IIsValidDataForThirdPartyAPI, getFullResponse: boolean): Promise<IResponseError[]>;
    isValidDataForThirdPartyAPI(data: IIsValidDataForThirdPartyAPI[], getFullResponse: boolean): Promise<IResponseError[][]>;
}

export interface IAMGlobalSysCache {
    getKey(name: string | string[]);
    setKey(name: string | ISetRedisInternalRequestObj[], value?: string, ttl?: number);
    removeKey(name: string | string[]);
    resetCacheDB(params: IResetRedisCacheDB);
    resetCacheCustomApis(name: string);
    resetCacheSystemApis(name: string);
    resetCacheThirdPartyApis(params: IResetRedisCacheTP);
}

export interface IThirdPartyAPIIdentity {
    npmPackageName: string;
    developedByUsername: string;
    apiVersionName: string;
    name: string;
}

export interface ICollectionIdentity {
    instance: string;
    database?: string;
    collection?: string;
    table?: string;
}

export interface IAMGlobalBaseParams extends ICollectionIdentity {
    headers?: any;
}

export interface IApiParamsGetAll extends IAMGlobalBaseParams {
    queryParams?: any;
    getTotalCount?: boolean;
}

export interface IApiParamsGetById extends IAMGlobalBaseParams {
    id: any;
    primaryKey?: string;
    select?: any;
}

export interface IApiParamsSave extends IAMGlobalBaseParams {
    saveData?: any; // used to save data in db.
}

export interface IApiParamsQuery extends IAMGlobalBaseParams {
    find?: any;
    sort?: any;
    skip?: number;
    limit?: number;
    select?: any;
    deep?: IApiParamsDeepFormat[]; // do not use it, it will return old cached obj because of caching so do not use it.
    groupBy?: any; // it is used in mysql query
    updateData?: any;
    headers?: any;
    getTotalCount?: boolean;
}

export interface IApiParamsCount extends IAMGlobalBaseParams {
    find?: any;
}

export interface IApiParamsUpdate extends IAMGlobalBaseParams {
    id?: any;
    updateData?: any; // It will be used for bulk update.
    primaryKey?: string;
    upsert?: boolean; // insert if item not available.
    returnDocument?: boolean; // return old doc if true
    select?: any; // to select which rows will return in response.
}

export interface IApiParamsUpdateMany extends IAMGlobalBaseParams {
    find: any;
    updateData: any;
}

export interface IApiParamsAggregate extends IAMGlobalBaseParams {
    aggregateQuery?: any; // It will be used for aggregate body
}

export interface IApiParamsRemove extends IAMGlobalBaseParams {
    id?: any;
    primaryKey?: string;
    select?: any;
}

export interface IApiParamsDistinct extends IAMGlobalBaseParams {
    distinctField: string;
    order?: 'asc' | 'desc' | any; // asc/desc/dsc , true/false, yes/no, 1/0
    find?: any; // not supported by mongoDB, and supported in SQL dbs.
}

export interface IApiParamsDeepFormat {
    s_key: string;
    // t_apiPath?: string;
    t_instance?: string;
    t_db?: string;
    t_col?: string;
    t_key?: string;
    deep?: IApiParamsDeepFormat[];
    select?: any;
}

export interface IExecuteQuery {
    instance: string;
    database?: string; // required for postgresql, mongodb only
    collection?: string; // required for mongodb only
    query: string | {
        find: any;
        sort?: any;
        skip?: number;
        limit?: number;
        select?: any;
    };
    headers?: any;
}

export interface IDecryptData {
    data: string;
}

// it can be value or TTL
export interface ISetRedisInternalRequestObj {
    key: string;
    value?: string;
    ttl?: number; // in seconds
}

export interface IResetRedisCacheDB extends ICollectionIdentity {
}

export interface IResetRedisCacheTP {
    npmPackageName: string;
    developedByUsername?: string;
    apiVersionName?: string;
}

export interface IGetSecretInternalRequestBody {
    keys: string | string[];
    parentParams?: IAMGlobalBaseParams; // it will be present
}

export interface IEmitEvent<D> {
    name: string;
    eventData?: D;
    executeListeners?: string[];
    outputArr?: [{ listenerName: string; output: any; }];
    executedEvents?: IExecutedEvents;
}

export interface IEmitEventWS<D> {
    name: string;
    eventData?: D;
}

export interface IUpdateManyAPIResponse {
    updatedRowsCount: number;
}

export interface IAPIResponse<T> {
    data?: T;
    totalCount?: number;
    encryptedData?: string;
    errors?: IResponseError[];
    logs?: any[];
    meta?: IAPIResponseMeta;
    stackTraceErrors?: any[];
    statusCode: EStatusCode;
    success: boolean;
    warnings?: IResponseError[];
}

export interface IAPIResponseMeta {
    executionTime?: string;
    executionPlan?: any[]; // IMongodbExplainPlan[];
    apiAccessGroups?: IAPIAccessGroupMeta[];
    apiAccessDeep?: IResponseError[];
    runBy?: ICodeRunByResponse[];
}

export interface ICodeRunByResponse {
    apiCategory: any; // EAPICategory enum value.
    serverId: string;
    processId: string;
    workerId: string;
    port: number;
    publishToRedis?: boolean; // true = if request received by redis.
}

export interface IAPIAccessGroupMeta {
    groupId?: string;
    groupName?: string;
    hasAccess?: boolean;
}

export interface IDeleteAPIResponse {
    deletedRows: any[];
    deletedRowsCount: number;
    ids: any[];
}

export interface IExecutedEvents {
    eventNameArr: string[];
    eventNameMap: any;
}

export interface IIsValidDataForTable extends ICollectionIdentity {
    data: any;
    sendingTo?: 'SAVE' | 'UPDATE';
    isArray?: boolean;
}

export type IIsValidDataForTable_KA = (keyof IIsValidDataForTable)[];

export enum ECustomAPIDataValidationType {
    BODY = 'BODY',
    QUERY_PARAMS = 'QUERY_PARAMS',
}

export interface IIsValidDataForCustomAPI {
    name: string;
    data: any;
    type: ECustomAPIDataValidationType;
    isArray?: boolean;
}

export interface IIsValidDataForThirdPartyAPI extends IThirdPartyAPIIdentity {
    data: any;
    type: ECustomAPIDataValidationType;
    isArray?: boolean;
}

export enum EWSEventType {
    INSTANCES = 'INSTANCES',
    THIRD_PARTY_APIS = 'THIRD_PARTY_APIS',
    CUSTOM_APIS = 'CUSTOM_APIS',
    SYSTEM_APIS = 'SYSTEM_APIS',
    CUSTOM_WS_EVENTS = 'CUSTOM_WS_EVENTS',
}

export enum EWSObjectType {
    REGISTER = 'REGISTER',
    UNREGISTER = 'UNREGISTER',
}

export interface IWSObject {
    guid: string;
    objType: EWSObjectType;
    onEvents: IWSRegisterOnEvent[];
}

export type IWSObject_P = Partial<IWSObject>;

export interface IWSRegisterOnEvent {
    eventType: EWSEventType;
    apiPath: string; // to get adminId;

    // instance apis
    instance?: string;
    database?: string;
    collection?: string;
    table?: string;

    // third party apis
    library?: string;
    apiVersion?: string;
    developedBy?: string;

    apiName: string;
    requestMethod?: ERequestMethod; // mandatory for custom API & third party API

    condition?: IWSCondition; // receive event when this condition match.
    select?: any; // select fields from objects after condition matched.

    // calculated field. // user will not provide it.
    eventData?: any;
}

export type IWSRegisterOnEvent_P = Partial<IWSRegisterOnEvent>;

export interface IWSCondition {
    conditionType: EWSConditionType;
    criteria: any;
}

export enum EWSConditionType {
    RESPONSE = 'RESPONSE',
}

export interface ITestCaseSuccess {
    testCasePass: true;
}

export interface ITestCaseFail {
    testCasePass: false;
    message: string;
    actual: any; // variable value.
    expected: any; // variable value should be this expected value.
}

export type ITestCaseResult = ITestCaseSuccess | ITestCaseFail; // _id is test case _id.
