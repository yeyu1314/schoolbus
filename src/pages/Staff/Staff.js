import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
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
  Table,
  Modal
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormItem from 'antd/es/form/FormItem';
import styles from './style.less';
import Link from 'umi/link';

  @connect(({ staff ,companys}) => {
    // const { staffList } = staff;//从状态机中取数据
    const { companyList ,staffList} = companys;
    return {
      staffList,
      companyList
    };
  })
  @Form.create()
class Staff extends PureComponent {
    state = {
      columns: [
        { title: '员工姓名', dataIndex: 'staff_name', key: 'staff_name' },
        { title: '电话号码', dataIndex: 'phone_number', key: 'phone_number' },
        { title: '员工类型', dataIndex: 'staff_type', key: 'staff_type' },
        { title: '修改时间', dataIndex: 'update_datetime', key: 'update_datetime' },
        { title: '创建时间', dataIndex: 'create_datetime', key: 'create_datetime' },
        {
          title: '操作',
          dataIndex: '',
          key: 'x',
          render: (item,index,j) => (
            <div>
              <Button onClick={() => this.modifyStaff(item)} icon="form">修改</Button>
              <Button onClick={() => this.deletelItem(item)} icon="delete">删除</Button>
              <Button onClick={() => this.detailStaff(item,index)} icon="delete">查看</Button>
            </div>
          ),
        },
      ],
      visible: false,
      disabled : false,
      isShowDetail : false,
      title : '新增员工',
      staff_id: '',
      pageNum : 1,
      item : '',
      satffName : '',
      company_id: 2,
      isRequired : true,
      isDisplay : 'block',
      comIndex: 0,
    }

    componentDidMount() {
      const { dispatch } = this.props;
      dispatch({// 获取所有公司
        type: 'companys/getCompanylist',
      });
      dispatch({//获取员工信息
        type: 'companys/getStaffList',
        payload:this.state.company_id
      })
    }

    addStaff = () => {//新增员工弹窗
      this.setState({
        isShowModal: true,
        title : '新增员工',
        item : '',
        isDisplay : 'block',
        isRequired : true,
      })
      this.props.form.setFieldsValue({
        staffName: '',
        staffPhone : '',
        staffType : '',
      })
    }

    modifyStaff = (item) => {
      this.setState({
        item : item,
        staff_id : item.id,
        isShowModal: true,
        title : '修改员工',
        isDisplay : 'none',
        isRequired : false
      })
      this.props.form.setFieldsValue({
        staffName: item.staff_name,
        staffPhone: item.phone_number,
        staffType: item.staff_type,
      })
    }

    deletelItem = (item) => {
      // console.log(item)
      this.setState({
        staff_id : item.staff_id,
        visible: true
      })
    }

    detailStaff = (item) => {//员工信息详情
      this.setState({
        isShowDetail: true,
        satffName : item.staff_name
      })
    }

    delStaffContent = async() => {
      const { dispatch } = this.props;
      await dispatch({
        type: 'staff/deletestaff',
        payload: this.state.staff_id
      })
      this.setState({
        visible:false
      })
      await dispatch({
        type: 'companys/getStaffList',//重新获取
        payload: this.state.company_id
      })
    }

    handleSubmit= async(e) =>{//提交新添加 / 修改  的员工信息
      const { dispatch , form} = this.props;
      const {item ,staff_id} = this.state;
      // console.log('查查看',item)
      e.preventDefault();
      e.persist();
      form.validateFields( async(err, values) =>{
        if(!err){
          if(item){//如果item有值，即执行修改操作
            const obj = {
              // updateDatetime: new Date(),//更新时间
              id: staff_id,//员工id
              update_datetime: new Date(),
              staff_name: values.staffName,
              phone_number: values.staffPhone,
              staff_type: values.staffType,
            };
            console.log('看看修改数据',obj)
            await dispatch({
              type: 'staff/modifystaffs',//修改员工信息
              payload: obj
            })
            await dispatch({
              type: 'companys/getStaffList',//重新获取
              payload: this.state.company_id
            })
            this.setState({
              isShowModal: false,
            });
          }else {
            const obj = {
              // company_id : this.state.company_id,
              company_id : values.schoolbusCompany,
              create_datetime: new Date(),
              staff_name: values.staffName,
              phone_number: values.staffPhone,
              staff_type: values.staffType,
            };
            await dispatch({
              type: 'staff/addstaffs',
              payload: obj
            })
            await dispatch({
              type: 'companys/getStaffList',//重新获取
              payload: this.state.company_id
            })
            this.setState({
              isShowModal: false,
            });
          }


        }
      });
    }

    handleCancel = e => {//关闭弹窗
      this.setState({
        isShowModal: false,
        visible: false,
        isShowDetail : false
      });
    }

    changeCompany = (value) => {
      const { dispatch } = this.props;
      dispatch({// 请求员工列表
        type: 'companys/getStaffList',
        payload: value
      })
    }


  render() {
    const { data, columns ,satffName,isRequired,isDisplay,comIndex} = this.state;
    const {staffList,submitting,form,companyList} = this.props
    const {getFieldDecorator,getFieldValue}= this.props.form
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
    // console.log('eeeeeeeeeeeeee',staffList)
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="menu.Companies.Staff" />}
      >
        <Modal
          title={this.state.title}
          visible={this.state.isShowModal}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit}>
            <Form.Item {...formItemLayout} label={<FormattedMessage id="student.schoolbusCompany.label" />} style={{display:isDisplay}}>
              {getFieldDecorator('schoolbusCompany', {
                rules: [{ required: isRequired, message: formatMessage({ id: 'student.schoolbusCompany.placeholder' }) }],
              })(
                <Select
                  placeholder={formatMessage({ id: 'student.schoolbusCompany.placeholder' })}
                >
                  {
                    companyList.map((item) =>
                      <Select.Option key={item.id}>{item.company_name} </Select.Option>)
                  }
                </Select>,
              )}
            </Form.Item>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="companies.staffName.label" />}
            >
              {getFieldDecorator('staffName', {
                rules: [
                  {required: true,
                    message: formatMessage({ id: 'companies.staffName.placeholder' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'companies.staffName.placeholder' })} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="companies.staffPhone.label" />}
            >
              {getFieldDecorator('staffPhone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'companies.staffPhone.placeholder' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'companies.staffPhone.placeholder' })} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="companies.staffType.label" />}
            >
              {getFieldDecorator('staffType', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'companies.staffType.placeholder' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'companies.staffType.placeholder' })} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleCancel}>
                <FormattedMessage id="form.cancel" />
              </Button>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="提示"
          visible={this.state.visible}
          onOk={this.delStaffContent}
          onCancel={this.handleCancel}
        >
          <p>是否删除该员工？</p>
        </Modal>
        <Modal
          title="员工信息详情"
          visible={this.state.isShowDetail}
          footer={null}
          onCancel={this.handleCancel}
        >
          <p>员工姓名：{satffName}</p>
        </Modal>

        <Card>
          <Button icon="plus-circle" onClick={this.addStaff}>新增员工</Button> <br />
          校车公司:
          <Select
            defaultValue={companyList.length > 0 ? companyList[comIndex].company_name: ''}
            onSelect={this.changeCompany}
            style={{marginBottom: 10,width:200}}
          >
            {
              companyList.map((item) =>
                <Select.Option key={item.key} value={item.id}>{item.company_name} </Select.Option>)
            }
          </Select>
        </Card>
        <Table
          className={styles.tabellist}
          columns={columns}
          // onClick={(e) => this.Toschool(e)}
          // expandedRowRender={record => <p style={{ margin: 0 }}>打开即可查看该公司的详细说明</p>}
          dataSource={staffList}
        />

      </PageHeaderWrapper>
    )
  }
}

export default Staff;
