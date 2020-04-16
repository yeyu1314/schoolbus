import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import {
  Form,
  Input,
  TimePicker ,
  Select,
  Button,
  Card,
  message,
  InputNumber,
  Checkbox,
  Icon,
  Tooltip,
  Upload,
  TreeSelect
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormItem from 'antd/es/form/FormItem';
import moment from 'moment';
import styles from './style.less'
import bus from '../../../models/bus';

@connect(({ companys ,schools , bus}) => ({
  companyList: companys.companyList,
  schoolList : schools.schoolList,
  busLists : bus.busLists,
}))
@Form.create()
class EquipmentAdd extends PureComponent {

  state = {
    eqname: '',
    eqnumber: '',
    eqtype : '',
    companyId : '',
    schoolId : '',
    busId : ''
  };

  componentDidMount() {
    const {dispatch} = this.props
    dispatch({// 获取所有公司
      type: 'companys/getCompanylist',
    });
  }

  changeCompany = (value) => {
    console.log(value)
    const {dispatch} = this.props
    dispatch({// 获取所有学校
      type: 'schools/getSchoolList',
      payload : value
    });
    dispatch({// 获取所有车辆
      type: 'bus/getBusList',
      payload : value
    });
    this.setState({
      companyId : value
    })
  }

  changeSchool = (value) => {
    console.log(value)
    this.setState({
      schoolId : value
    })
  }

  changeBus = (value) => {
    this.setState({
      busId : value
    })
  }

  onInputChange = e =>{
    const InputName = e.target.name;
    const InputValue = e.target.value;
    this.setState({
      [InputName] : InputValue ,
    })
  }

  changeTupe = (value) => {
    this.setState({
      eqtype : value
    })
  }

  submitInfo = () => {
    const {eqname,eqnumber,eqtype,companyId,schoolId,busId} = this.state
    const {dispatch} = this.props
    if(!eqnumber || !eqnumber){
      message.error('请输入设备名称/设备编号')
      return false
    }
      const obj = {
        device_id : eqnumber,
        device_name : eqname,
        school_id : schoolId,
        company_id : companyId,
        bus_id : busId,
        gps_type : eqtype,
      }
    dispatch({// 添加设备
      type: 'equipment/addEquipment',
      payload : obj
    });

    console.log(obj)
  }



  render(){

    const arr = [
      {laber : '设备名称 : ',placeholder:'请输入设备名称',name:'eqname',value : ''},
      {laber : '设备编号 : ',placeholder:'请输入设备编号',name:'eqnumber',value : ''}
    ]
    const equipmentList = arr.map((item,index) => {
      return (
        <div className={styles.equipmentBox} key={index}>
          <span>{item.laber}</span>
          <Input className={styles.equipmentInput} placeholder={item.placeholder} name={item.name} onChange={this.onInputChange} />
        </div>
      )
    })

    const {companyList,schoolList,busLists} = this.props

    return(
      <PageHeaderWrapper
        title={<FormattedMessage id="equipment.title.add" />}
      >
        <Card>

          {/* 设备名称
          <div className={styles.equipmentBox}>
            <span>{formatMessage({ id: 'equipment.name.laber' })}</span>
            <Input className={styles.equipmentInput} placeholder={formatMessage({ id: 'equipment.name.placeholder' })} />
          </div>
           设备编号
          <div className={styles.equipmentBox}>
            <span>{formatMessage({ id: 'equipment.number.laber' })}</span>
            <Input className={styles.equipmentInput} placeholder={formatMessage({ id: 'equipment.number.placeholder' })} />
          </div>*/}

          {equipmentList}

          {/* 公司 */}
          <div className={styles.equipmentBox}>
            <span>{formatMessage({ id: 'student.schoolbusCompany.label' })} : </span>
            <Select className={styles.equipmentInput} placeholder={formatMessage({ id: 'student.schoolbusCompany.placeholder' })} onChange={this.changeCompany}>
              {
                companyList.map((item) =>
                  <Select.Option key={item.id} value={item.id}>{item.company_name} </Select.Option>)
              }
            </Select>
          </div>
          {/*学校*/}
          <div className={styles.equipmentBox}>
            <span>{formatMessage({ id: 'student.school.label' })} : </span>
            <Select className={styles.equipmentInput} placeholder={formatMessage({ id: 'student.school.placeholder' })} onChange={this.changeSchool}>
              {
                schoolList.map((item) =>
                  <Select.Option key={item.schoolId} value={item.schoolId}>{item.schoolName} </Select.Option>)
              }
            </Select>
          </div>
          {/*车辆*/}
          <div className={styles.equipmentBox}>
            <span>{formatMessage({ id: 'equipment.bus.laber' })} : </span>
            <Select className={styles.equipmentInput} placeholder={formatMessage({ id: 'equipment.bus.placeholder' })} onChange={this.changeBus}>
              {
                busLists.map((item) =>
                  <Select.Option key={item.busId} value={item.busId}>{item.busNumber}------{item.busName} </Select.Option>)
              }
            </Select>
          </div>
          {/* 设备类型 */}
          <div className={styles.equipmentBox}>
            <span>{formatMessage({ id: 'equipment.type.laber' })} : </span>
            <Select className={styles.equipmentInput} placeholder={formatMessage({ id: 'equipment.type.placeholder' })} onChange={this.changeTupe}>
              <Select.Option value="DEV">设备号</Select.Option>
              <Select.Option value="PONE">电话号码获取</Select.Option>
            </Select>
          </div>
          <div className={styles.equipmentButton}>
            <Button type="primary" onClick={this.submitInfo}>提交</Button>
            <Button>取消</Button>
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default EquipmentAdd;
