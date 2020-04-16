import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import {
  Form,
  Input,
  TimePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Checkbox,
  Icon,
  Tooltip,
  Upload,
  TreeSelect, Table,Modal
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormItem from 'antd/es/form/FormItem';
import moment from 'moment';
import styles from './style.less'
@connect(({ companys }) => ({
  companyList: companys.companyList,
  staffList: companys.staffList,
}))
@Form.create()
class AddCar extends PureComponent {

  state = {
    companyId : '',
    deiverId : '',
    carName : '',
    carNumber : '',
    capacity : '',
    maxCapacity : '',
    carType : ''
  };

  componentDidMount() {
    const {dispatch} = this.props
    dispatch({// 获取所有公司
      type: 'companys/getCompanylist',
    });
  }

  changeCompany = (value) => {
    const {dispatch} = this.props
    dispatch({// 获取员工列表
      type: 'companys/getStaffList',
      payload : value
    });
    this.setState({
      companyId : value
    })
  }

  changeStaff = (value) => {
    this.setState({
      deiverId : value
    })
  }

  changeType = (value) => {
    this.setState({
      carType : value
    })
  }

  onInputTextChange = e => {
    const InputName = e.target.name;
    const InputValue = e.target.value;
    this.setState({
      [InputName] : InputValue ,
    })
  }

  onInputNumChange = e => {
    const InputName = e.target.name;
    const InputValue = e.target.value;
    this.setState({
      [InputName] : InputValue ,
    })
  }

  submitInfo = () => {
    const {companyId,deiverId,carName,carNumber,capacity,maxCapacity,carType} = this.state
    const obj = {
      bus_number : carNumber,
      bus_name : carName,
      company_id : companyId,
      capacity ,
      max_capacity : maxCapacity,
      bus_type : carType
    }
    console.log(obj)
  }




  render(){
    const {companyList,staffList} = this.props
    const textArr = [
      {laber : '车辆名称 : ',placeholder:'请输入车辆名称',name:'carName',value : ''},
      {laber : '车牌号 : ',placeholder:'请输入车牌号',name:'carNumber',value : ''}
    ]
    const inputText = textArr.map((item,index) => {
      return (
        <div className={styles.equipmentBox} key={index}>
          <span>{item.laber}</span>
          <Input className={styles.equipmentInput} placeholder={item.placeholder} name={item.name} onChange={this.onInputTextChange} />
        </div>
      )
    })
    const numArr = [
      {laber : '限载人数 : ',placeholder:'请输入限载人数',name:'capacity',value : ''},
      {laber : '最大载客量 : ',placeholder:'请输入最大载客量',name:'maxCapacity',value : ''}
    ]
    const inputNum = numArr.map((item,index) => {
      return (
        <div className={styles.equipmentBox} key={index}>
          <span>{item.laber}</span>
          <Input className={styles.equipmentInput} type='number' placeholder={item.placeholder} name={item.name} onChange={this.onInputNumChange} />
        </div>
      )
    })

    return(
      <PageHeaderWrapper
        title={<FormattedMessage id="car.title.add" />}
      >
        <Card>
          <div className={styles.equipmentBox}>
            <span>{formatMessage({ id: 'student.schoolbusCompany.label' })} : </span>
            <Select className={styles.equipmentInput} placeholder={formatMessage({ id: 'student.schoolbusCompany.placeholder' })} onChange={this.changeCompany}>
              {
                companyList.map((item) =>
                  <Select.Option key={item.id} value={item.id}>{item.company_name} </Select.Option>)
              }
            </Select>
          </div>
          <div className={styles.equipmentBox}>
            <span>{formatMessage({ id: 'car.driver.laber' })} : </span>
            <Select className={styles.equipmentInput} placeholder={formatMessage({ id: 'car.driver.placeholder' })} onChange={this.changeStaff}>
              {
                staffList.map((item) =>
                  <Select.Option key={item.staff_id} value={item.staff_id}>{item.staff_name} </Select.Option>)
              }
            </Select>
          </div>
          {inputText}
          {inputNum}
          <div className={styles.equipmentBox}>
            <span>{formatMessage({ id: 'car.type.laber' })} : </span>
            <Select className={styles.equipmentInput} placeholder={formatMessage({ id: 'car.type.placeholder' })} onChange={this.changeType}>
              <Select.Option value="DEV">东风牌EQ6880STV</Select.Option>
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

export default AddCar;
