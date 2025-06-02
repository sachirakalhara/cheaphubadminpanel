const IS_DEV = true;
const BE_SERVER_URL = IS_DEV ? "https://dev-api.cheaphub.io" : "https://api.cheaphub.io";

const conf = {
    serverUrl: BE_SERVER_URL,
    basePath: 'api/v1',
    redirect: ``
}

export default conf
