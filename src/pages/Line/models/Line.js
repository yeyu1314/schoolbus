import { queryLine , getSchoolListContent,modifyLinesContent} from '@/services/line';
import { transformDate } from '@/pages/Public/formdate';
import router from 'umi/router';
import { message } from 'antd';
export default {
  namespace: 'line',

  state: {
    routerList : [],
    modalDataLines : [],
    schoolList : [],
    num: 0
  },

  effects: {
    *seleclLine({payload}, { call, put}) {//勾选路线
      payload.map((item,key)=>{
        item.school = item.school
        item.line = item.line
      })
      yield put({
        type: 'setLineContent',
        payload: payload,
      });
    },

    *getRouterList({payload}, { call, put}) {
      const  data  = yield call(queryLine,payload)
      data.map((item,key)=>{
        item.key = key + 1
        item.school = item.school
        item.line = item.line
      })
      yield put({
        type: 'setRouterContent',
        payload: data,
      });
    },

    *getSchoolList({payload}, { call, put}){
      const data = yield call(getSchoolListContent,payload)
      // console.log('学校啦啦啦啦',data)
      data.map((item,key)=>{
        item.school_name = item.school_name
      })
      yield put({
        type: 'setSchoolContent',
        payload: data,
      });
    },

    *modifylines({payload}, { call, put}){
      const data = yield call(modifyLinesContent,payload)

      yield put({
        type: 'modifyLine',
        payload: data,
      })
    }
  },

  reducers: {
    setLineContent(state, action){
      return {
        ...state,
        routerList:action.payload
      };
    },
    setRouterContent(state, action){
      return {
        ...state,
        modalDataLines:action.payload
      };
    },
    setSchoolContent(state, action){
      return {
        ...state,
        schoolList:action.payload
      };
    },
    modifyLine(state, action){
      let routerListArr = state.routerList;
      let lineConArr = action.payload

      // console.log('原来的',routerListArr)
      // console.log('新的',lineConArr)
      for (let i = 0; i < routerListArr.length; i++){
        if(routerListArr[i].key === lineConArr[0].id){
          routerListArr[i].school = lineConArr[0].school
          routerListArr[i].line = lineConArr[0].line
        }
        // return routerListArr
      }

      /*let arr = state.routerList;
      arr[0].school = '你是啥！！！！'*/
      // console.log('newArr',routerListArr)
      return {
        ...state,
        routerList: routerListArr
      }
    }
  },
};
