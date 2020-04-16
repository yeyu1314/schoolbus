import { queryCompany, modifyCompany, deleteCompany, addCompany } from '@/services/company';
import { transformDate } from '@/pages/Public/formdate';
import router from 'umi/router';
import { message } from 'antd';
export default {
  namespace: 'company',

  state: {
    ismodify: {},
    isadd: {}
  },

  effects: {
    *addcompays({payload}, {call, put}){
     const respones = yield call(addCompany,payload)
      console.log('看看modeal添加数据',respones)
     if(respones.status === 200){
      router.push({
        pathname:'/Company/List'
      })
    }
   },

    *modifycompays({payload}, {call, put}){
      const respones = yield call(modifyCompany,payload)
      if(respones.status === 200){
        router.push({
          pathname:'/Company/List'
        })
      }
    }, 
  },

  reducers: {
    save(state, action) {
        return {
          ...state,
          ...action.payload,
        };
    }
  },
};
