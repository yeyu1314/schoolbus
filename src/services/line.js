import request from '@/utils/request';
import { String_url, BaseUrl} from '@/config';
/*export const Staff_list = {

  Staffurl: `${BaseUrl}/cmn/company/getAll`,
  Staffmodify:  `${BaseUrl}/cmn/company`,
  Staffdelete: `${BaseUrl}/cmn/company/`
}
export default Staff_list;*/

export async function queryLine() {//请求路线
  // return request(Staff_list.Staffurl);
  return [
    {key : 1, school : '深圳小学001', line : '杨美一号线dddd'},
    {key : 2, school : '深圳小学002', line : '杨美一号线dssss'},
    {key : 3, school : '深圳小学003', line : '杨美一号线fefke'}
  ]
}

export async function getSchoolListContent() {//请求学校
  // return request(Staff_list.Staffurl);
  return [
    {id : 1, school_name : '深圳小学1'},
    {id : 2, school_name : '深圳小学2'},
    {id : 3, school_name : '深圳小学3'},
  ]
}

export async function modifyLinesContent() {//修改
  // return request(Staff_list.Staffurl);
  return [
    {id : 2, school : '修改后深圳小学1',line : '环中5号线'}
  ]
}
