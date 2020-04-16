import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Upload,
  List,
  Layout, Table, Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import moment from 'moment';

@connect(({ rule }) => {
  const { studentList ,schoolList} = rule;//从状态机中取数据
  return {
    studentList,
    schoolList
  };
})
class StudentList extends PureComponent{
    state = {//初始值
     /* columns : [//  onMouseEnter={this.handleCheckImg}
        {title: '底库照片 | 识别图像',dataIndex: 'img',
          render: (item,index) =>
            <div style={{position: 'relative'}} onMouseEnter={() => this.handleCheckImg(index)}>
              <div>
                <img src={index.photo} width="50px"/>
                <img src={index.face_image} style={{width:50,marginLeft:10}} />
              </div>
              <div style={{background: 'gray',display:'none', width: 350,height: 200,position: 'absolute',left: 120,top: -65,}}>
                <img src={index.photo} style={{width:150,marginLeft:20,marginTop:20}}/>
                <img src={index.face_image} style={{width:150,marginLeft:10,marginTop:20}} />
              </div>
            </div>
          },
        {title: '姓名',dataIndex: 'student_name',key : 'student_name'},
        {title: '路线名称',dataIndex: 'location_name',key : 'location_name'},
        // {title: '班级',dataIndex: 'class_name',key : 'class_name'},
        {title: '设备编号',dataIndex: 'distinguish_equipment',key : 'distinguish_equipment'},
        {title: '识别类型',dataIndex: 'distinguish_type',key : 'distinguish_type'},
        {title: '识别时间',dataIndex: 'distinguish_time',key : 'distinguish_time'},
        {title: '操作',dataIndex: '',key: 'x',
          render: (item,index) => (
            <div>
              <Button onClick={() => this.detailStu(item,index)} icon="delete">查看</Button>
            </div>
          ),
        },
      ],*/
      page:1,
      page_size:10,
      CheckStatus:0,
      isShowDetail : false,
      company_id : 2,
      school_id : '',
      end_time : moment().format('YYYY-MM-DD'),
      start_time : moment().subtract(30, 'days').format('YYYY-MM-DD'),
      allowClear : false,
      stuDetail : '',
      selectedRowKeys:[],
      stuDerail : {},
      seleIndex: null
}

    componentDidMount = () => {
      const { dispatch } = this.props;
      const { company_id ,school_id, start_time, end_time,page,page_size} = this.state;
     /* const obj = {
        companyId : companyId,
        schoolId : schoolId,
        startTime : startTime,
        endTime : endTime
      }
      dispatch({
        type: 'rule/getStudentList',
        payload: obj,
      });*/

      dispatch({
        type: 'rule/getStudentContent',
        payload: { company_id ,school_id, start_time, end_time,page,page_size},
      });
      dispatch({//根据公司id请求对应的学校
        type: 'rule/getSchoolList',
        payload: this.state.company_id,
      });
    }
    onShowChange = (page, newPageSize) => {//翻页
      const { dispatch } = this.props;
      const { company_id ,school_id, start_time, end_time} = this.state;
      console.log('翻页了',page, newPageSize);
      dispatch({
        type: 'rule/getStudentContent',
        payload: {company_id ,page:page,page_size:newPageSize},
      });
      this.setState({page:page,page_size:newPageSize});
    }
    handleCheckImg =(index) => {//鼠标移入，放大图片 事件
      this.setState({
        seleIndex: index
      })
    }
    handleLeaveImg =(index) => {//图片隐藏
    this.setState({
      seleIndex: null
    })
  }

    detailStu = (item) => {//查看学生详细信息
      this.setState({
        isShowDetail : true,
        stuDerail : {
          name : item.student_name,
          location_name : item.location_name,
          distinguish_type : item.distinguish_type,// 识别类型
          distinguish_time : item.distinguish_time,// 识别时间
          distinguish_equipment : item.distinguish_equipment,// 设备编号
          equipment_name : item.equipment_name,// 设备名称
          face_image : item.face_image,// 识别照片
          photo : item.photo,// 底库照片
          bus_name : item.bus_name,
          bus_number : item.bus_number,
          car_name : item.car_name
        }
      })
      console.log(item)
    }

    handleCancel = e => {//关闭弹窗
      this.setState({
        isShowDetail: false
      });
    }

    onSearchSchool = (val) => {//搜索
      console.log('search:', val);
    }

    onChangeSchool = (value) => {
      const { dispatch } = this.props;
      const { company_id , start_time, end_time,page,page_size} = this.state;
      dispatch({
        type: 'rule/getStudentContent',
        payload: { company_id ,school_id:value, start_time, end_time,page,page_size},
      });
      this.setState ({
        school_id : value
      })
    }

    onChangeTime = (value) => {
    const selectStartTime = moment(value[0]._d).format('YYYY-MM-DD');
    const selectEndTime = moment(value[1]._d).format('YYYY-MM-DD');
    const { dispatch } = this.props;
    const { company_id , school_id,page,page_size} = this.state;
    dispatch({
      type: 'rule/getStudentContent',
      payload: {company_id , school_id,page,page_size,start_time:selectStartTime,end_time:selectEndTime},
    });
    this.setState ({
      start_time : selectStartTime,
      end_time : selectEndTime
    })
  }



  render(){
    const columns = [
      {title: '底库照片 | 识别图像',dataIndex: 'img',
        render: (item,index) =>
          <div style={{position: 'relative'}}>
            <div onMouseEnter={() => this.handleCheckImg(index)} onMouseLeave={() => this.handleLeaveImg(index)}>
              <img src={index.photo}  style={{width:50,height:50,}}/>
              <img src={index.face_image} style={{width:50,height:50,marginLeft:10}} />
            </div>
            {/*{*/}
              {/*this.state.seleIndex === index ? (*/}
                <div style={{background: '#fff',display:this.state.seleIndex === index ? 'block':'none',  width: 450,height: 240,position: 'absolute',left: 120,top: -65,}}>
                  <img src={index.photo} style={{width:200,height:200, marginLeft:20,marginTop:20}}/>
                  <img src={index.face_image} style={{width:200,height:200,marginLeft:10,marginTop:20}} />
                </div>
              {/*): null*/}
            {/*}*/}

          </div>
      },
      {title: '姓名',dataIndex: 'student_name',key : 'student_name'},
      {title: '路线站点',dataIndex: 'location_name',key : 'location_name'},
      // {title: '班级',dataIndex: 'class_name',key : 'class_name'},
      // {title: '设备编号',dataIndex: 'distinguish_equipment',key : 'distinguish_equipment'},
      {title: '设备名称',dataIndex: 'equipment_name',key : 'equipment_name'},
      {title: '识别类型',dataIndex: 'distinguish_type',key : 'distinguish_type'},
      {title: '识别时间',dataIndex: 'distinguish_time',key : 'distinguish_time'},
      {title: '操作',dataIndex: '',key: 'x',
        render: (item,index) => (
          <div>
            <Button onClick={() => this.detailStu(item,index)} icon="delete">查看</Button>
          </div>
        ),
      },
    ];
    const {start_time,end_time,allowClear,stuDerail,isShowDetail} = this.state
    const {studentList,schoolList} = this.props
    const { Option } = Select;
    const dateFormat = 'YYYY/MM/DD';
    const { MonthPicker, RangePicker } = DatePicker;
    const pagination = {
      page_size:studentList.page_size,
      onChange: this.onShowChange,
      defaultCurrent:1,
      total : studentList.total
    }
    // console.log('看看数据',pagination)
    return(
      <PageHeaderWrapper
        title={<FormattedMessage id='student.faceRecord' />}
      >
        <Modal
          title="学生刷脸信息详情"
          visible={isShowDetail}
          footer={null}
          onCancel={this.handleCancel}
        >
          <p>姓名：{stuDerail.name}</p>
          <p><span>底库照片 : </span><img src={`${stuDerail.photo}`} alt="底库照片" style={{width:100,height:100,}} /></p>
          <p><span>识别照片 : </span><img src={`${stuDerail.face_image}`} alt="识别照片" style={{width:100,height:100,}} /></p>
          <p>识别时间：{stuDerail.distinguish_time}</p>
          <p>设备编号：{stuDerail.distinguish_equipment}</p>
          <p>设备名称：{stuDerail.equipment_name}</p>
          <p>识别类型：{stuDerail.distinguish_type}</p>
          <p>路线站点：{stuDerail.location_name}</p>
          <p>车牌号：{stuDerail.bus_number}</p>
          <p>车辆名称：{stuDerail.bus_name}</p>
          {/*<p>汽车类型：{stuDerail.car_name}</p>*/}
          <p>请假类型：{stuDerail.specialType}</p>
          <p>相似度：{stuDerail.similarity}</p>
          <p>刷脸时段类型：{stuDerail.round_trip_type}</p>
          <Button type="primary" onClick={this.handleCancel} style={{marginLeft: "40%"}}>关闭</Button>
        </Modal>
        <Card>
          识别时间:
          <RangePicker
            defaultValue={[moment(start_time,dateFormat), moment(end_time,dateFormat)]}
            onChange={this.onChangeTime}
            allowClear={allowClear}
          />
          学校:
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a school"
            onChange={this.onChangeSchool}
            onSearch={this.onSearchSchool}
          >
            {
              schoolList.map((schoolList) =><Option key={schoolList.schoolId}>{schoolList.schoolName}</Option>)
            }

          </Select>

          <Table className={styles.tabellist} columns={columns} dataSource={studentList.data} pagination={pagination}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}
export default StudentList;
