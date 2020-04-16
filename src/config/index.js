
//timeout
const timeout = 30000;
const BaseUrl = '/api';
const String_url =  process.env.NODE_ENV === 'development' ? 'https://schooldev.zaiso.net' : '';  //为了开发时下载报表
const luod = String_url+BaseUrl;
export {
    timeout,
    BaseUrl,
    String_url,
    luod,
}

export default '';
