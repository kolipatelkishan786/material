import * as T from 'types';

/**
 * moment, _ are global objects available.
 */
let customApi: T.ICustomApiSettingsTypes = {
    name: 'Hello World', // Name can be set once.
    label: 'Hello World',
    path: '/hello-world',
    enableCaching: false,
    methodType: T.ERequestMethod.POST,
    apiAccessType: T.EAPIAccessType.TOKEN_ACCESS,
    
    // No value = pickup authTokenInfo from default secret
    // Empty Array = Only AM authorization required because we are overriding default secret's authTokenInfo
    // authTokenInfo: <T.IAuthTokenInfo[]>[],

};
module.exports = customApi;