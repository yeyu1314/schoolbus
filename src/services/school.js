import request from '@/utils/request';
import { String_url, BaseUrl } from '@/config';
import Student_Api from './examine';
import Staff_list from './staff';
import Company_list from './company';

export const School_Api = {
  School_list: `${BaseUrl}/cmn/schools/company/{companyId}/schools`,
  School_lineinfo: `${BaseUrl}/rot/lineinfo/`,

  StudentInfo: `${BaseUrl}/std/students/list?@pageNum@pageSize@status`,

  StudentCon: `${BaseUrl}/att/attendances/student/schoolid`,
  StuInfo: `${BaseUrl}/att/attendances/student/schoolid?@company_id@school_id@page@page_size@start_time@end_time`,
  //         /att/attendances/student/schoolid?company_id=2&start_time=2019-08-30&end_time=2019-08-31&page=1&page_size=1&school_id=7
  SchoolCon: `${BaseUrl}/cmn/schools/company/`,

  CompanyList: `${BaseUrl}/cmn/company/getAll`,
  LineList: `${BaseUrl}/rot/lineinfo/`,
  SiteList: `${BaseUrl}/rot/basicRouteStops/`,
  GrateList: `${BaseUrl}/cmn/schools/select/`,
  ClassList: `${BaseUrl}/cmn/schools/select/`,
  SearchStuInfo: `${BaseUrl}/std/students/studentlist?@school_id@page@page_size`,
  SearchStudent: `${BaseUrl}/std/students/students?@param`,
  addStudent: `${BaseUrl}/std/students/info`,
  modifStudent : `${BaseUrl}/std/students/studentinfo/`,
  updateStudent : `${BaseUrl}/std/students/`,
  updateParent : `${BaseUrl}/std/parent/list`,


  // 更新学校
  updateSchool : `${BaseUrl}/cmn/schools/company/{companyId}/schools`,
  // 删除学校
  delSchool : `${BaseUrl}/cmn/schools/company/`,
  // 添加学校
  addSchool : `${BaseUrl}/cmn/schools/company/`,
  // 获取所有区域
  getAllArea : `${BaseUrl}/cmn/area`,
};

export default School_Api;

//根据公司id查询学校
export async function schoolList({ company_id }) {
  const url = School_Api.School_list
    .replace('{companyId}', company_id ? `${company_id}` : '');
  return request(url);
}
// 更新学校
export async function updateSchoolInfo({company_id , body}) {
  console.log('公司id',company_id)
  console.log('body数据',body)
  const url = School_Api.updateSchool
    .replace('{companyId}', company_id ? `${company_id}` : '');
  // const url = School_Api.updateSchool + company_id + '/schools'
  console.log(url)
  return request(url, {
    method: 'PUT',
    data: {
      method: 'put',
      ...body,
    },
  });
}
// 删除学校
export async function delSchoolInfo({company_id,body}) {
  console.log('公司id',company_id)
  console.log('body数据',body)
  const url = School_Api.delSchool + company_id + '/schools'
  console.log(url)
  return request(url,{
    method:'POST',
    data:{
      method: 'delete',
      body
    }
  });
}
// 添加学校
export async function addSchoolInfo(body) {
  console.log('接收到的值',body)
  const url = School_Api.addSchool + body.company_id + '/schools'
  console.log('请求的地址',url)
  return request(url,{
    method:'POST',
    data:{
      method: 'post',
      ...body
    }
  });
}
//查询所有区域
export async function getAreaLists() {
  const url = School_Api.getAllArea;
  return request(url);
}





export async function lineInfo({ school_id }) {
  const url = School_Api.School_lineinfo + school_id;
  return request(url);
}

// export async function Studentcheck(body) {
//   console.log('22222',body)
//     return request(Student_Api.Studentcheck, {
//       method: 'POST',
//       data: [...body],
//     });
// }


export async function getStudentList(body) {
  return request(School_Api.updateSchool, {
    method: 'POST',
    data: {
      method: 'post',
      ...body,
    },
  });
}

export async function queryStudentInfo({ company_id, school_id, start_time, end_time, page, page_size }) {

  const url = School_Api.StuInfo
    .replace('@company_id', company_id ? `company_id=${company_id}&` : '')
    .replace('@school_id', school_id ? `school_id=${school_id}&` : '')
    .replace('@start_time', start_time ? `startTime=${start_time}&` : '')
    .replace('@end_time', end_time ? `end_time=${end_time}` : '')
    .replace('@page', page ? `page=${page}&` : '')
    .replace('@page_size', page_size ? `page_size=${page_size}&` : '');

  console.log('请求的地址', url);
  return request(url);
}

export async function getSchoolLists(company_id) {//请求学校
  const url = School_Api.SchoolCon + company_id + '/schools';
  return request(url);

}

export async function getLineLists(school_id) {//请求路线
  const url = School_Api.LineList + school_id;
  return request(url);
}

export async function getSiteLists(line_id) {//请求站点
  const url = School_Api.SiteList + line_id;
  return request(url);
}

export async function getGrateLists(school_id) {//获取年级
  const url = School_Api.GrateList + school_id + '/grade';
  return request(url);
}

export async function getClassLists({ school_id, grate }) {//查询班级
  const url = School_Api.ClassList + school_id + '/' + grate + '/class';
  return request(url);
}

export async function queryCompanys() {
  const url = School_Api.CompanyList;
  return request(url);
}

export async function getStudentInfos({ school_id, page, page_size }) {
  const url = School_Api.SearchStuInfo
    .replace('@school_id', school_id ? `school_id=${school_id}&` : '')
    .replace('@page', page ? `page=${page}&` : '')
    .replace('@page_size', page_size ? `page_size=${page_size}&` : '');
// console.log(url)
  return request(url);
}

export async function searchStudent({ search_text }) {
  const url = School_Api.SearchStudent
    .replace('@param', search_text ? `param=${search_text}&` : '');
  return request(url);
}

export async function addStudentInfo(body) {
  return request(School_Api.addStudent, {
    method: 'POST',
    data: {
      method: 'post',
      ...body,
    },
  });
}

export async function modifStuInfos(student_id) {
  const url = School_Api.modifStudent + student_id
  return request(url);
}

export async function updateStuInfos(body) {
  console.log(body)
  const url = `${School_Api.updateStudent + body.id  }/info`
  console.log(url)
  return request(url, {
    method: 'PUT',
    data: {
      method: 'put',
      ...body,
    },
  });
}

export async function modifParInfos(body) {
  console.log(body)
  return request(School_Api.updateParent, {
    method: 'PUT',
    data: {
      method: 'put',
      ...body,
    },
  });
}
