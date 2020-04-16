import { message } from 'antd';

import { queryStudentInfo, Studentcheck } from '@/services/examine';
import { String_url, BaseUrl} from '@/config';


function hehe(params) {
    if(params){
       return '已支付'
    }else{
        return '未支付'
    }
}
export default {
  namespace: 'examine',

  state: {
    data: {},
  },

  effects: {
    *GetStudentInfo({ payload }, { call, put }) {
      const response = yield call(queryStudentInfo, payload);
      const { data  } = response;
      const { rows, total, pageSize } = data;
      message.success('獲取成功');
     const arr = rows.map((value,index)=>{
        return {
                key: value.id,
                name: value.student_name,
                school: value.school_name ? value.school_name  : '暂未填写',
                class: value.class_name ? value.class_name  : '暂未填写',
                pay_school: value.pay_school_name ? value.pay_school_name  : '暂未选购',
                pay_stype: hehe(value.order_status),
                photo: `${String_url}${BaseUrl}/${value.photo}`,
              }
      })
      const obj = {
          data:arr,
          total,
          pageSize,
      }
      yield put({
        type: 'data',
        payload: obj,
      });

    },
    *studentsCheck({ payload, callback }, { call, put }) {
      console.log('22999222',payload)
      const response = yield call(Studentcheck, payload);
      message.success('Check成功');
      if (callback) callback();
    },
    // *remove({ payload, callback }, { call, put }) {
    //   const response = yield call(removeRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },
    // *update({ payload, callback }, { call, put }) {
    //   const response = yield call(updateRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },
  },

  reducers: {
    data(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
