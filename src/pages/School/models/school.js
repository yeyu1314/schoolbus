import { schoolList, lineInfo ,updateSchoolInfo,delSchoolInfo,addSchoolInfo} from '@/services/school';
import { transformDate } from '@/pages/Public/formdate';
import router from 'umi/router';
import { message } from 'antd';
export default {
  namespace: 'school',

  state: {
    schoolList: [],
    lineinfolist: [],
    schoolLists : []
  },

  effects: {
    // 获取学校列表(新增学校界面)
    *getSchools({payload}, { call, put}){
      const respones = yield call(schoolList,payload);
      if(respones.status === 200){
        const { data } = respones;
        yield put({
          type: 'getschool',
          payload: data,
        })
      }
    },
    // 获取学校对应的站点列表
    *getLineinfo({payload}, { call, put}){
        const respones = yield call(lineInfo,payload);
        console.log('站点列表的信息',respones)
        const { data } = respones;
        yield put({
            type: 'getlineinfo',
            payload: data,
        })
      },

    // 根据下拉框请求学校列表（学校列表界面）
    *getSchoolList({payload}, { call, put}){
      const respones = yield call(schoolList,payload);
      // console.log('请求回来的学下列表数据',respones)
      if(respones.status === 200){
        const { data } = respones;
        const arr = data.map((item,index) => {
          return {
            key : index,
            schoolId : item.id,
            schoolName : item.school_name,
            createTime : transformDate(item.create_datetime),
            updateTime : transformDate(item.update_datetime),
            companyId : item.company_id
          }
        })
        yield put({
          type: 'setschoolList',
          payload: arr,
        })
      }
    },

    // 修改学校
    *updateSchool({payload}, { call, put}){
      const respones = yield call(updateSchoolInfo,payload);
      console.log(respones)
      if(respones.status === 200) {
        message.success('修改学校成功')
      }
    },
    //删除学校
    *deleteSchool({payload}, { call, put}){
      const respones = yield call(delSchoolInfo,payload);
      console.log(respones)
    },
    //添加学校
    *addSchool({payload}, { call}){
      const respones = yield call(addSchoolInfo,payload);
      console.log(respones)
      if(respones.status === 200) {
        message.success('添加学校成功')
        router.push({
          pathname : '/School/SchoolList'
        })
      }
    },


  },

  reducers: {
    getschool(state, action){
        return {
            ...state,
            schoolList: action.payload
      };
    },
    getlineinfo(state, action){
        return {
            ...state,
            lineinfolist: action.payload
        };
    },
    setschoolList(state, action){
      return {
        ...state,
        schoolLists: action.payload
      };
    },
  },
};
