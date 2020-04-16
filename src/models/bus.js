import { getBusLists} from '@/services/equipment';
import { message } from 'antd';

export default {
  namespace: 'bus',
  state: {
    busLists: [],
  },

  effects: {
    // 根据公司id查询所对应的校车（下拉列表）
    * getBusList({ payload }, { call, put }) {
      const response = yield call(getBusLists, payload);
      console.log(response)
      if(response.status === 200){
        const { data } = response;
        const busArr = [];
        data.map((item) => {
          busArr.push({
            busId: item.id,
            busName: item.bus_name,
            busNumber: item.bus_number,
          });
        });
        yield put({
          type: 'setBusList',
          payload: busArr,
        });
      }
    },
  },

  reducers: {
    setBusList(state, action) {
      return {
        ...state,
        busLists: action.payload,
      };
    },
  },
};
