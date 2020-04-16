import request from '@/utils/request';
import { String_url, BaseUrl} from '@/config';
export const Company_list = {
    Companyurl: `${BaseUrl}/cmn/company/getAll`,//获取公司列表
    Companymodify:  `${BaseUrl}/cmn/company`,//修改公司相关信息
    Companydelete: `${BaseUrl}/cmn/company/`
}
export default Company_list;

export async function queryCompany() {
    const url = Company_list.Companyurl;
    return request(url);
}

export async function modifyCompany(body) {
    return request(Company_list.Companymodify,{
        method: 'PUT',
        data:{
            method: 'put',
            ...body,
        }
    });
}

export async function addCompany(body) {
  console.log('Company_list.Companymodify,',Company_list.Companymodify)
    return request(Company_list.Companymodify,{
        method: 'POST',
        data:{
            method: 'post',
            ...body,
        }
    });
}

export async function deleteCompany(id) {
    const url = Company_list.Companydelete + id;
    return request(url,{
        method:'DELETE',
        data:{
            method: 'delete',
            ...id,
        }
    });
}
