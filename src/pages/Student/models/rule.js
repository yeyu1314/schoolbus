import { queryRule, removeRule, addRule, updateRule } from '@/services/api';
import {
  getStudentList, getSchoolLists, getLineLists, getSiteLists, getGrateLists, getClassLists,updateStuInfos,
  queryStudentInfo, queryStuInfo, queryCompanys, getStudentInfos, searchStudent, addStudentInfo,modifStuInfos,modifParInfos
} from '@/services/school';
import { message } from 'antd';
import { String_url, BaseUrl } from '@/config';
import router from 'umi/router';

export default {
  namespace: 'rule',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    studentList: {},
    schoolList: [],
    stuInfoList: [],
    companyList: [],
    lineList: [],
    siteList: [],
    grateList: [],
    classList: [],
    serachStuList: {},
    // key id,value 为请求到的数组
    allSiteList: {},
    showStuInfoList : {}
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    /*
        *getStudentList({ payload }, { call, put }){
          console.log('bbb',payload)
          const response = yield call(getStudentList, payload);
          const { data  } = response;
          const stuData = data.map((value,index)=>{
              return {
                  key: value.id,
                  student_name: value.name,
                  location_name: value.location_name ? value.location_name  : '暂未填写',
                  distinguish_equipment: value.device_id ? value.device_id  : '',//设备编号
                  distinguish_time: value.recognize_time ? value.recognize_time  : '',//识别时间
                  distinguish_type: value.identification_type ? value.identification_type  : '',//识别类型
                  // class_name: value.class_name ? value.class_name  : '暂未填写',
                  photo: `${String_url}${BaseUrl}/${value.face_image}`,
                }
          })
          const obj = {
            data:stuData
          }
          yield put({
            type: 'getStuData',
            payload: obj,
          });

        },*/

    * getSchoolList({ payload }, { call, put }) {
      const response = yield call(getSchoolLists, payload);
      const { data } = response;
      const schoolArr = [];
      data.map((item, key) => {
        schoolArr.push({
          schoolId: item.id,
          schoolName: item.school_name,
        });
      });
      yield put({
        type: 'setSchoolContent',
        payload: schoolArr,
      });
    },

    * getLineList({ payload }, { call, put }) {
      const response = yield call(getLineLists, payload);
      const { data } = response;
      const LineArr = [];
      data.map((item, key) => {
        LineArr.push({
          lineId: item.schedule_list[0].basic_route_id,
          lineName: item.line_name,
        });
      });
      yield put({
        type: 'setLineContent',
        payload: LineArr,
      });
    },
    * getSiteList({ payload }, { call, put }) {
      const response = yield call(getSiteLists, payload);
      const { data } = response;
      const stoplist = data.stop_list;
      const SiteArr = [];
      stoplist.map((item, key) => {
        SiteArr.push({
          siteId: item.id,
          siteName: item.location_name,
        });
      });
      yield put({
        type: 'setSiteContent',
        payload: SiteArr,
      });
    },

    * getGrateList({ payload }, { call, put }) {
      const response = yield call(getGrateLists, payload);
      const { data } = response;
      const GrateArr = [];
      data.map((item, key) => {
        GrateArr.push({
          grateId: key,
          grateName: item.grade,
        });
      });
      yield put({
        type: 'setGrateContent',
        payload: GrateArr,
      });
    },
    * getClassList({ payload }, { call, put }) {
      const response = yield call(getClassLists, payload);
      const { data } = response;
      const ClassArr = [];
      data.map((item) => {
        ClassArr.push({
          classId: item.id,
          className: item.student_class,
        });
      });
      yield put({
        type: 'setClassContent',
        payload: ClassArr,
      });
    },

    * getStudentContent({ payload }, { call, put }) {//请求刷脸信息
      const response = yield call(queryStudentInfo, payload);
      const { data } = response;
      const { rows, page_size, total } = data;
      console.log('请求回来刷脸的学生的数据', rows);
      let specialType;
      const arr = rows.map((value, index) => {
        if(value.special_type === "A"){
          specialType = '请假'
        }if(value.special_type === "B"){
          specialType = '值日'
        }if(value.special_type === "C"){
          specialType = '社团'
        }else {
          specialType = ' '
        }
        return {
          key: index,
          student_name: value.name,
          location_name: value.location_name ? value.location_name : '暂未填写',
          distinguish_equipment: value.device_id ? value.device_id : '',//设备编号
          equipment_name: value.device_name ? value.device_name : '',//设备名称
          distinguish_time: value.recognize_time ? value.recognize_time : '',//识别时间
          distinguish_type: value.identification_type === 'A' ? '人脸识别' : '手动签到',//识别类型
          face_image: value.face_image ? `${String_url}${BaseUrl}/${value.face_image}` : '',//识别照片
          photo: value.photo_url ? `${String_url}${BaseUrl}/${value.photo_url}` : '',//底库照片

          bus_name : value.bus_name?value.bus_name:'暂未填写',
          bus_number : value.bus_number?value.bus_number:'暂未填写',
          car_name : value.car_name?value.car_name:'暂未填写',

          specialType,// 请假类型
          similarity : value.similarity?value.similarity:'暂未填写',// 相似度

          round_trip_type : value.round_trip_type?value.round_trip_type:'暂未填写',// 上学 / 放学

        };
      });
      console.log(arr)
      const obj = {
        data: arr,
        total,
        page_size,
      };
      yield put({
        type: 'getStuData',
        payload: obj,
      });
    },


    * getCompanys({ payload }, { call, put }) {
      const response = yield call(queryCompanys, payload);
      const { data } = response;
      // console.log('传递回来的公司数据',response)
      const CompanyInfo = data.map((value, index) => {
        return {
          key: value.id,
          company_name: value.company_name,
        };
      });
      yield put({
        type: 'getComInfo',
        payload: CompanyInfo,
      });
    },

    * getStudentList({ payload }, { call, put }) {// 根据学校搜索
      const response = yield call(getStudentInfos, payload);
      console.log('根据学校id请求得到的数据',response)
      const { data } = response;
      const { rows, page_size, total } = data;
      const arr = rows.map((value, index) => {
        return {
          key: index,
          name: value.student_name,
          avatar: value.photo ? `${String_url}${BaseUrl}/${value.photo}` : '',
          student_id : value.id,
          school: value.school_name,
          grate: value.student_grade,
          class_name: value.student_class,
          phone: value.parent_mobile_number,

          sex: value.student_gender,
          grade: value.student_grade,
          birth: value.date_of_birth,
          parent: value.parents,
          // aaa : parent.name,
          // relationship: value.parents[0].relation,
          address: value.address,
          sate: value.location_id,
        };
      });
      const obj = {
        data: arr,
        total,
        page_size,
      };
      yield put({
        type: 'setSearchInfo',
        payload: obj,
      });
    },
    * searchStuInfos({ payload }, { call, put }) {// 根据输入框搜索
      const response = yield call(searchStudent, payload);
      console.log(response)
      const { data } = response;
      const arr = data.map((value, index) => {
        return {
          key: index,
          name: value.student_name,
          avatar: value.photo ? `${String_url}${BaseUrl}/${value.photo}` : '',
          student_id : value.id,
          school: value.school_name,
          grate: value.student_grade,
          class_name: value.student_class,
          phone: value.parent_mobile_number,

          sex: value.student_gender,
          grade: value.student_grade,
          birth: value.date_of_birth,
          parent: value.parents,
          // aaa : parent.name,
          // relationship: value.parents[0].relation,
          address: value.address,
          sate: value.location_id,
        };
      });
      const obj = {
        data: arr,
      };
      yield put({
        type: 'setSearchInfo',
        payload: obj,
      });
    },

    * submitStuInfo({ payload }, { call }) {// 添加学生
      const respones = yield call(addStudentInfo, payload);
      console.log(respones)
      if(respones.status === 200){
        message.success('添加成功');
        router.push({
          pathname : '/School/StudentInfo'
        })
      }else {
        message.error(respones.message);
      }
    },

    /**
     * 复制原来方法修改,避免直接修改原方法导致引用报错
     * 根据id获取,将值放入 allSiteList 对象中
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    * onceGetSiteListById({ id }, { call, put }) {
      const response = yield call(getSiteLists, id);
      const { data } = response;
      yield put({
        type: 'onceSetSiteListById',
        id: id,
        data: data.stop_list,
      });
    },

    * modeifStuInfo({ payload }, { call }){// 点击修改时根据学生id查询信息
      const response = yield call(modifStuInfos, payload.student_id);
      const { data } = response;
      const arr = {
          studentId : data.id,
          school_name: data.school_name,
          student_code : data.student_code,
          school_id : data.school_id,
          basic_route_list : data.basic_route_list,
          student_grade: data.student_grade,
          student_class: data.student_class,
          student_name: data.student_name,
          student_gender: data.student_gender,
          date_of_birth: data.date_of_birth,
          parent_name: data.parent_name,
          parent_mobile_number: data.parent_mobile_number,
          relation : data.relation,
          address: data.address,
          companyName : payload.companyName,
          class_id : data.class_id,
          photoUrl : data.photo ? `${String_url}${BaseUrl}/${data.photo}` : '',
          // photoUrl : data.photo ? [{
          //   url: `${String_url}${BaseUrl}/${data.photo}`,
          //   uid: '-1',
          //   name: 'image.png',
          //   status: 'done',
          // }] : '',

      };
      if(response.status === 200){
        router.push({
          pathname:'/School/AddStudent',
          // query: { item:arr}
          state: { item:arr}
        })
      }

    },

    * updateStuInfo({ payload }, { call }){// 确认修改
      const response = yield call(updateStuInfos, payload);
      if(response.status === 200){
        message.success('修改成功');
        router.push({
          pathname:'/School/StudentInfo'
        })
      }
    },

    * updateParentsInfos({ payload }, { call }){
      const response = yield call(modifParInfos, payload);
      if(response.status === 200){
        message.success('修改成功');
      }
    },

    * showStuInfo({ payload }, { call , put}){
      const response = yield call(modifStuInfos, payload.student_id);
      console.log('点击查看请求的数据',response)
      const { data } = response;
      yield put({
        type: 'setShowStuInfo',
        payload: data,
      });
    },
  },

  reducers: {
    onceSetSiteListById(state, { id, data }) {
      const { allSiteList } = state;
      return {
        ...state,
        allSiteList: {
          ...allSiteList,
          [id]: data,
        },
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    getStuData(state, action) {
      return {
        ...state,
        studentList: action.payload,
      };
    },
    setSchoolContent(state, action) {
      return {
        ...state,
        schoolList: action.payload,
      };
    },
    getStuInfo(state, action) {
      return {
        ...state,
        stuInfoList: action.payload,
      };
    },
    getComInfo(state, action) {
      return {
        ...state,
        companyList: action.payload,
      };
    },
    setLineContent(state, action) {
      return {
        ...state,
        lineList: action.payload,
      };
    },
    setSiteContent(state, action) {
      return {
        ...state,
        siteList: action.payload,
      };
    },
    setGrateContent(state, action) {
      return {
        ...state,
        grateList: action.payload,
      };
    },
    setClassContent(state, action) {
      return {
        ...state,
        classList: action.payload,
      };
    },
    setSearchInfo(state, action) {
      return {
        ...state,
        serachStuList: action.payload,
      };
    },
    setShowStuInfo(state, action) {
      return {
        ...state,
        showStuInfoList: action.payload,
      };
    },
  },
};
