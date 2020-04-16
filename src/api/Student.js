import { String_url, BaseUrl} from '@/config';
export const Student_Api = {
    StudentInfoTemplate: `${String_url}${BaseUrl}/std/students/info/template`,
}

export default Student_Api;

export const StudentInfoTemplate = () => {
    const url = Student_Api.StudentInfoTemplate
    const a = document.createElement('a');
    a.href = url;
    a.click();
  }