import { deleteCompany , queryCompany} from '@/services/company';
import { queryStaff } from '@/services/staff';
import { transformDate } from '@/pages/Public/formdate';
import router from 'umi/router';
import { message } from 'antd';
export default {
  namespace: 'companys',

  state: {
    companyList: [],
    staffList : [],
  },

  effects: {
    *getCompanylist(_, { call, put}){
      const respones = yield call(queryCompany)
      const { data } = respones;
      // console.log(data)
      data.map((item,index)=>{
        item.key = index
        item.create_datetime = transformDate(item.create_datetime)
        item.update_datetime = transformDate(item.update_datetime)
      })
      yield put({
        type: 'getcomlist',
        payload: data,
      });
    },

    *deletecompay({payload}, {call, put}){
        const respones = yield call(deleteCompany,payload)

        const res = yield call(queryCompany)
        const { data } = res;
        message.success('删除成功');
         data.map((item,index)=>{
          item.key = index
          item.create_datetime = transformDate(item.create_datetime)
          item.update_datetime = transformDate(item.update_datetime)
        })
        yield put({
          type: 'getcomlist',
          payload: data,
        });
      },

    *getStaffList({payload}, { call, put}) {//获取员工信息
      const respones = yield call(queryStaff, payload)//调用services / queryStaff方法
      const { data } = respones;
      const staffArr = []
      data.map((item,index)=>{
        staffArr.push({
          key : index,
          staff_id : item.id,
          phone_number : item.phone_number,
          staff_name : item.staff_name,
          staff_type : item.staff_type,
          create_datetime : transformDate(item.create_datetime),
          update_datetime : transformDate(item.update_datetime)
        })
      })
      yield put({
        type: 'getStaffContent',
        payload: staffArr,
      });
    },

  },

  reducers: {
    getcomlist(state, action){
      return {
        ...state,
        companyList: action.payload
      };
    },
    getStaffContent(state, action){
      return {
        ...state,
        staffList: action.payload
      };
    }
  },
};
