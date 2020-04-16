import { getSchoolLists,getAreaLists} from '@/services/school';
import { message } from 'antd';

export default {
  namespace: 'schools',
  state: {
    schoolList: [],
    areaList : []
  },

  effects: {
    // 根据公司id查询所对应的学校（下拉列表）
    * getSchoolList({ payload }, { call, put }) {
      const response = yield call(getSchoolLists, payload);
      if(response.status === 200){
          const { data } = response;
          const schoolArr = [];
          data.map((item) => {
            schoolArr.push({
              schoolId: item.id,
              schoolName: item.school_name,
            });
          });
          yield put({
            type: 'setSchoolContent',
            payload: schoolArr,
          });
      }
    },
    // 获取所有区域
    * getSrealist({ payload }, { call, put }){
      const response = yield call(getAreaLists, payload);
      if(response.status === 200) {
        const { data } = response;
        const areaArr = [];
        data.map((item) => {
          areaArr.push({
            areaId: item.id,
            areaName: item.area_name,
          });
        });
        yield put({
          type: 'setAreaContent',
          payload: areaArr,
        });
      }
    }
  },

  reducers: {
    setSchoolContent(state, action) {
      return {
        ...state,
        schoolList: action.payload,
      };
    },
    setAreaContent(state, action) {
      return {
        ...state,
        areaList: action.payload,
      };
    },
  },
};
