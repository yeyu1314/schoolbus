import request from '@/utils/request';
import { String_url, BaseUrl} from '@/config';
export const Student_Api = {
    StudentInfo: `${BaseUrl}/std/students/list?@pageNum@pageSize@status`,
    Studentcheck: `${BaseUrl}/std/students/check`,
    
}

export default Student_Api;

export async function queryStudentInfo({pageSize,pageNum,status}) {
    const url = Student_Api.StudentInfo
    .replace('@pageSize', pageSize ? `pageSize=${pageSize}&`: '')
    .replace('@pageNum', pageNum ? `pageNum=${pageNum}&` : '')
    .replace('@status', status ? `status=${status}&`: 'status=0&')
  return request(url);
}

export async function Studentcheck(body) {
  console.log('22222',body)
    return request(Student_Api.Studentcheck, {
      method: 'POST',
      data: [...body],
    });
}