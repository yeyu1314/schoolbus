import {modifyStaff, deleteStaff, addStaff } from '@/services/staff';

import router from 'umi/router';
import { message } from 'antd';
export default {
  namespace: 'staff',

  state: {
    staffList : [],
    isbool: false
  },

  effects: {

    *deletestaff({payload}, {call, put}){
      const respones = yield call(deleteStaff,payload)
      if(respones.status === 200){
        message.success('删除成功');
      }else {
        message.error(respones.message);
      }

    },

    *addstaffs({payload}, {call}) {//新增员工信息
      const respones = yield call(addStaff, payload)
      if(respones.status === 200){
        message.success('添加成功');
      }else {
        message.error(respones.message);
      }
    },

    *modifystaffs({payload}, {call}){//修改员工信息
      const respones = yield call(modifyStaff,payload)
      if(respones.status === 200){
        message.success('修改成功');
      }else {
        message.error(respones.message);
      }


    },

  },

  reducers: {
    getStaffContent(state, action){
      return {
        ...state,
        staffList: action.payload
      };
    }
  },
};
