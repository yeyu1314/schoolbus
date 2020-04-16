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
import styles from './style.less';
@connect(({ equipment , companys ,schools,bus }) => ({
  equipmentLists: equipment.equipmentLists,
  companyList: companys.companyList,
  schoolList : schools.schoolList,
  busLists : bus.busLists,
}))
@Form.create()
class EquipmentList extends PureComponent {

  state = {
    isShowUpdate : false,
    page : '1',
    pageSize : '10',
    eqId : '',
    eqname: '',
    eqnumber: '',
    eqtype : '',
    companyId : '',
    schoolId : '',
    busId : ''
  };

  componentDidMount() {
    const {dispatch} = this.props
    const {page,pageSize} = this.state
    dispatch({// 获取所有设备
      type: 'equipment/getEquipmentlist',
      payload : {page,pageSize}
    });
    dispatch({// 获取所有公司
      type: 'companys/getCompanylist',
    });
  }

  onShowChange = (page, pageSize) => {
    const { dispatch } = this.props;
    dispatch({// 获取所有设备
      type: 'equipment/getEquipmentlist',
      payload : {page,pageSize}
    });
    this.setState({
      page,
      pageSize,
    });
  }

  eqInfos  = (item) => {// 设备详细信息
    console.log(item)
    Modal.info({
      title: '设备详细信息',
      content: (
        <div>
          <p>设备名称: {item.equipmentName}</p>
          <p>设备编号: {item.equipmentNnumber}</p>
          <p>设备类型: {item.equipmentType}</p>
        </div>
      ),
      onOk() {},
    });
  }

  eqUpdate = (item) => {// 修改的弹窗
    console.log(item)
    const {form} = this.props
    this.setState({
      isShowUpdate : true,
      eqId : item.id,
      equipmentInfo : item,
      eqname: item.equipmentName,
      eqnumber: item.equipmentNnumber,
      eqtype : item.equipmentType,
      companyId : item.companyId,
      schoolId : item.schoolId,
      busId : item.busId
    })
    form.setFieldsValue({
      eqName: item.equipmentName,
      type: item.equipmentType,
      schoolbusCompany: item.companyName,
      school: item.schoolName,
      bus : item.busName
    })
  }

  handleUpdateEq = async (e) => {// 确认修改
    e.preventDefault();
    e.persist();
    const {eqId,eqname,eqtype,eqnumber,companyId,schoolId,busId,page,pageSize} = this.state
    const {dispatch,form} = this.props
    const obj = {
      id : eqId,
      device_id : eqnumber,
      device_name : eqname,
      school_id : schoolId,
      company_id : companyId,
      bus_id : busId,
      gps_type : eqtype,
    }

    form.validateFields( async(err, values) => {
      if (!err) {
        console.log(values)
        console.log(obj)
      }
    })
    await dispatch({// 修改设备信息
      type: 'equipment/updateEquipmentlist',
      payload : obj
    });
    await dispatch({// 获取所有设备
      type: 'equipment/getEquipmentlist',
      payload : {page,pageSize}
    });
    this.setState({
      isShowUpdate : false,
    })
  }

  eqDelete = async (value) =>{
    console.log(value)
    const obj = {
      id : value.id,
      device_id : value.equipmentNnumber,
    }
    const { confirm } = Modal;
    const {dispatch} = this.props
    const {page,pageSize} = this.state
    confirm({
      title: '你确定要删除此设备吗?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
       onOk() {
        dispatch({// 删除设备
          type: 'equipment/delEquipment',
          payload : obj
        });
       dispatch({// 获取所有设备
         type: 'equipment/getEquipmentlist',
         payload : {page,pageSize}
       });
      },
      onCancel() {
        // console.log('Cancel');
      },
    })
  }

  changeName = (e) => {// 修改设备名称
    console.log(e.target.value)
    this.setState({
      eqname : e.target.value
    })
  }

  changeType = (value) => {// 修改设备获取方式
    console.log(value)
    this.setState({
      eqtype : value
    })
  }

  changeCompany = (value) => {// 修改公司
    const {dispatch,form} = this.props
    console.log(value)
    form.setFieldsValue({
      school: '',
      bus : ''
    })
    dispatch({// 获取所有学校
      type: 'schools/getSchoolList',
      payload : value
    });
    dispatch({// 获取所有车辆
      type: 'bus/getBusList',
      payload : value
    });
    this.setState({
      companyId : value,
    })
  }

  changeSchool = (value) => {// 修改学校
    console.log(value)
    this.setState({
      schoolId : value
    })
  }

  changeBus = (value) => {// 修改车辆
    this.setState({
      busId : value
    })
  }

  handleCancel = () => {// 取消弹窗
    this.setState({
      isShowUpdate : false,
      equipmentInfo : ''
    })
  }

  render(){
    const columns = [
      { title: '设备名称', dataIndex: 'equipmentName', key: 'equipmentName' },
      { title: '设备编号', dataIndex: 'equipmentNnumber', key: 'equipmentNnumber' },
      { title: '设备类型', dataIndex: 'equipmentType', key: 'equipmentType' },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: (item,index) => (
          <div>
            <Button onClick={() => this.eqUpdate(item)} icon="edit">修改</Button>
            <Button onClick={() => this.eqDelete(item)} icon="delete">删除</Button>
            <Button onClick={() => this.eqInfos(item,index)} icon="unordered-list">查看</Button>
          </div>
        ),
      },
    ]
    const {isShowUpdate} = this.state
    const {equipmentLists,companyList,schoolList,busLists} = this.props
    const {getFieldDecorator}= this.props.form
    const pagination = {
      page_size: equipmentLists.page_size,
      onChange: this.onShowChange,
      defaultCurrent: 1,
      total: equipmentLists.total,
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return(
      <PageHeaderWrapper
        title={<FormattedMessage id="equipment.title.list" />}
      >
        <Card>
          <Table
            className={styles.tabellist}
            columns={columns}
            dataSource={equipmentLists.data}
            pagination={pagination}
          />
        </Card>
        <Modal
          title="修改设备信息"
          visible={isShowUpdate}
          onCancel={this.handleCancel}
          footer={null}
        >
          {/*设备名称*/}
          {/*<div className={styles.modalBox}>
            <span className={styles.modalLaber}>{formatMessage({ id: 'equipment.name.laber' })}</span>
            <Input className={styles.modalInput} placeholder={formatMessage({ id: 'equipment.name.placeholder' })} defaultValue={equipmentInfo.equipmentName} onChange={this.changeEqName} />
          </div>
           设备类型
          <div className={styles.modalBox}>
            <span className={styles.modalLaber}>{formatMessage({ id: 'equipment.type.laber' })}</span>
            <Select className={styles.modalInput} placeholder={formatMessage({ id: 'equipment.type.placeholder' })} defaultValue={equipmentInfo.equipmentType} onChange={this.changeEqType}>
              <Select.Option value="DEV">设备号</Select.Option>
              <Select.Option value="PONE">电话号码获取</Select.Option>
            </Select>
          </div>
           公司
          <div className={styles.modalBox}>
            <span className={styles.modalLaber}>{formatMessage({ id: 'student.schoolbusCompany.label' })} : </span>
            <Select className={styles.modalInput} placeholder={formatMessage({ id: 'student.schoolbusCompany.placeholder' })} defaultValue={equipmentInfo.comapanyName} onChange={this.changeCompany}>
              {
                companyList.map((item) =>
                  <Select.Option key={item.id} value={item.id}>{item.company_name} </Select.Option>)
              }
            </Select>
          </div>
           学校
          <div className={styles.modalBox}>
            <span className={styles.modalLaber}>{formatMessage({ id: 'student.school.label' })} : </span>
            <Select className={styles.modalInput} placeholder={formatMessage({ id: 'student.school.placeholder' })} defaultValue={equipmentInfo.schoolName?equipmentInfo.schoolName : ''} onChange={this.changeSchool}>
              {
                schoolList.map((item) =>
                  <Select.Option key={item.schoolId} value={item.schoolId}>{item.schoolName} </Select.Option>)
              }
            </Select>
          </div>
          车辆
          <div className={styles.modalBox}>
            <span className={styles.modalLaber}>{formatMessage({ id: 'equipment.bus.laber' })}</span>
            <Select className={styles.modalInput} placeholder={formatMessage({ id: 'equipment.bus.placeholder' })} defaultValue={equipmentInfo.busName} onChange={this.changeBus}>
              {
                busLists.map((item) =>
                  <Select.Option key={item.busId} value={item.busId}>{item.busNumber}------{item.busName} </Select.Option>)
              }
            </Select>
          </div>*/}


          <Form onSubmit={this.handleUpdateEq}>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="equipment.name.laber" />}
            >
              {getFieldDecorator('eqName', {
                rules: [
                  {required: false,
                    message: formatMessage({ id: 'equipment.name.laber' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'equipment.name.placeholder' })} onChange={this.changeName} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="equipment.type.laber" />}
            >
              {getFieldDecorator('type')(
                <Select placeholder={formatMessage({ id: 'equipment.type.placeholder' })} onChange={this.changeType}>
                  <Select.Option value="DEV">设备号</Select.Option>
                  <Select.Option value="PONE">电话号码获取</Select.Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="student.schoolbusCompany.label" />}
            >
              {getFieldDecorator('schoolbusCompany')(
                <Select placeholder={formatMessage({ id: 'student.schoolbusCompany.placeholder' })} onChange={this.changeCompany}>
                  {
                    companyList.map((item) =>
                      <Select.Option key={item.id} value={item.id}>{item.company_name} </Select.Option>)
                  }
                </Select>
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="student.school.label" />}
            >
              {getFieldDecorator('school')(
                <Select placeholder={formatMessage({ id: 'student.school.placeholder' })} onChange={this.changeSchool}>
                  {
                    schoolList.map((item) =>
                      <Select.Option key={item.schoolId} value={item.schoolId}>{item.schoolName} </Select.Option>)
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="equipment.bus.laber" />}
            >
              {getFieldDecorator('bus')(
                <Select placeholder={formatMessage({ id: 'equipment.bus.placeholder' })} onChange={this.changeBus}>
                  {
                    busLists.map((item) =>
                      <Select.Option key={item.busId} value={item.busId}>{item.busNumber}------{item.busName} </Select.Option>)
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleCancel}>
                <FormattedMessage id="form.cancel" />
              </Button>
            </FormItem>
          </Form>

        </Modal>
      </PageHeaderWrapper>
    )
  }
}

export default EquipmentList;
