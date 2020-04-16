import request from '@/utils/request';
import { String_url, BaseUrl} from '@/config';
export const Staff_list = {
  Staffurl: `${BaseUrl}/cmn/staff/getall/`,
  Staffadd: `${BaseUrl}/cmn/staff/addstaff`,
  Staffmodify:  `${BaseUrl}/cmn/staff/updatestaffinfo`,
  Staffdelete: `${BaseUrl}/cmn/staff/deletestaff/`
}
export default Staff_list;

export async function queryStaff(body) {//发异步请求
  // return request(Staff_list.Staffurl);
  const url = Staff_list.Staffurl + body;
  return request(url)
  // console.log('请求的地址',url)
  /*return request(url,{
    method: 'POST',
    data:{
      method: 'post',
      ...body,
    }
  });*/
}

export async function addStaff(body) {//添加员工
console.log('新增',body)
  return request(Staff_list.Staffadd,{
    method: 'POST',
    data:{
      method: 'post',
      ...body,
    }
  })
}

export async function deleteStaff(id) {//删除员工
  const url = Staff_list.Staffdelete + id;
  console.log('请求的地址',url)
  // return request(url)
  return request(url,{
    method:'DELETE',
    data:{
      method: 'delete'
    }
  });
}
export async function modifyStaff(body) {//修改员工
  console.log('server',body)
    return request(Staff_list.Staffmodify,{
      method: 'PUT',
      data:{
        method: 'put',
        ...body,
      }
    });
  }

