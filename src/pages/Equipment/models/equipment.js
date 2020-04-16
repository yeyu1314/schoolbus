import { addEquipments,getEquipmentlists,delEquipments,updateEquipmentlists} from '@/services/equipment';
import { message } from 'antd';
import router from 'umi/router';

export default {
  namespace: 'equipment',
  state: {
    busLists: [],
    equipmentLists : [],
  },

  effects: {
    // 添加设备
    * addEquipment({ payload }, { call }) {
      const response = yield call(addEquipments, payload);
      console.log(response)
      if(response.status === 200){
        message.success('添加设备成功')
        router.push({
          pathname:'/Equipment/ListEquipment'
        })
      }
    },
    // 查询设备
    * getEquipmentlist({ payload }, { call ,put }){
      const response = yield call(getEquipmentlists, payload);
      console.log(response)
      if(response.status === 200){
        const {rows} = response.data
        const equipmentArr = [];
        rows.map((item,index) => {
          equipmentArr.push({
            key : index,
            id : item.id,
            equipmentName: item.device_name,// 设备名称
            equipmentNnumber: item.device_id,// 设备序列号/id
            equipmentType: item.gps_type,// 设备类型
            companyId : item.company_id,
            companyName : item.company_name,
            schoolId : item.school_id,
            schoolName : item.school_name,
            busId : item.bus_id,
            busName : item.bus_name,
          });
        });
        const obj = {
          data : equipmentArr,
          page_size : response.data.page_size,
          total : response.data.total
        }
        yield put({
          type: 'setEquipmentList',
          payload: obj,
        });
      }
    },
    // 删除设备
    * delEquipment({ payload }, { call }){
      const response = yield call(delEquipments, payload);
      console.log(response)
      if(response.status === 200){
        message.success('删除设备成功')
      }
    },
    // 修改设备
    * updateEquipmentlist({ payload }, { call }){
      const response = yield call(updateEquipmentlists, payload);
      console.log(response)
      if(response.status === 200){
        message.success('修改设备成功')
      }
    }
  },

  reducers: {
    setBusList(state, action) {
      return {
        ...state,
        busLists: action.payload,
      };
    },
    setEquipmentList(state, action) {
      return {
        ...state,
        equipmentLists: action.payload,
      };
    },
  },
};
