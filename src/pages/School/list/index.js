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
import Link from 'umi/link';
import styles from './style.less';

@connect(({ school ,companys}) => {
  const { schoolLists } = school;
  const { companyList } = companys;
  return {
    schoolLists, companyList,
  };
})
@Form.create()
class SchoolList extends PureComponent {
  state = {
    isShowModal: false,
    isShowDelModal : false,
    isShowDalModal : false,
    comIndex: 0,
    companyId : '',
    schoolId : '',
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'companys/getCompanylist'
    })
    dispatch({// 请求学校列表
      type: 'school/getSchoolList',
      payload: { company_id: 2 }
    })
  }

  changeCompany = (value) => {// 根据选择的公司更新学校列表
    const { dispatch } = this.props;
    dispatch({// 请求学校列表
      type: 'school/getSchoolList',
      payload: { company_id: value }
    })
    this.setState({
      companyId : value
    })
  }

  // 添加按钮
  addSchool = () => {
    router.push({
      pathname : '/School/AddSchool'
    })
  }

  // 取消弹窗
  handleCancel = () => {// 取消弹窗
    this.setState({
      isShowModal : false,
      isShowDelModal : false,
      isShowDalModal : false
    })
  }

  // 修改按钮的痰喘
  modifyItem = (item) => {// 修改学校
    this.setState({
      isShowModal : true,
      companyId : item.companyId,
      schoolId : item.schoolId
    })
    console.log(item)
    this.props.form.setFieldsValue({
      schoolName: item.schoolName,
    })
  }

  // 删除按钮的弹窗
  deletelItem = (item) => {// 删除学校
    console.log(item)
    this.setState({
      schoolId : item.schoolId,
      companyId : item.companyId,
      isShowDelModal: true
    })
  }

  // 确认删除
  delSchool = async() => {
    const { dispatch } = this.props;
    const {schoolId,companyId} = this.state
    const obj = {id : schoolId}
    await dispatch({// 删除学校
      type: 'school/deleteSchool',
      payload: { company_id: companyId,body : [obj] }
    })
    await dispatch({// 请求学校列表
      type: 'school/getSchoolList',
      payload: { company_id: companyId }
    })
  }

  // 查看信息
  toviewItem = (item) => {
    this.setState({
      isShowDalModal : true,
    })
    console.log(item)
    this.props.form.setFieldsValue({
      schoolName: item.schoolName,
    })
}

  // 确认修改
  submitSchoolChangeInfo = e => {// 确认修改
    const { dispatch , form} = this.props;
    const {companyId,schoolId} = this.state
    e.preventDefault();
    e.persist();
    form.validateFields( async(err, values) =>{
      if(!err){
        const obj = {
          company_id : companyId,
          // updateDatetime :new Date(),
          school_name : values.schoolName,
          id : schoolId
        }
        await dispatch({// 修改学校
          type: 'school/updateSchool',
          payload: { company_id : companyId,body : obj }
        })
        this.setState({
          isShowModal : false
        })
        await dispatch({// 请求学校列表
          type: 'school/getSchoolList',
          payload: { company_id: companyId }
        })
      }
    })
  }


  render() {
    const {submitting,schoolLists,companyList} = this.props
    const {isShowModal,comIndex,isShowDelModal,isShowDalModal} = this.state
    const {getFieldDecorator}= this.props.form
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
    const columns = [
        { title: '学校名称', dataIndex: 'schoolName', key: 'schoolName' },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
        { title: '修改时间', dataIndex: 'updateTime', key: 'updateTime' },
        {title: '操作',dataIndex: '',key: 'x',
          render: (item,index) => (
            <div>
              <Button onClick={() => this.modifyItem(item)} icon="form">修改</Button>
              {/*<Button onClick={() => this.deletelItem(item)} icon="delete">删除</Button>*/}
              <Button onClick={() => this.toviewItem(item,index)} icon="delete">查看</Button>
            </div>
          ),
        },
        ]
    return (
      <PageHeaderWrapper
        // title={<FormattedMessage id="companies.list.title" />}
        title='学校列表'
      >
        <Modal
          title='修改学校'
          visible={isShowModal}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.submitSchoolChangeInfo}>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="school.add.laber" />}
            >
              {getFieldDecorator('schoolName', {
                rules: [
                  {required: true,
                    message: formatMessage({ id: 'school.add.placeholder' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'school.add.placeholder' })} />)}
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
          visible={isShowDelModal}
          onOk={this.delSchool}
          onCancel={this.handleCancel}
        >
          <p>是否删除该学校？</p>
        </Modal>
        <Modal
          title='查看学校'
          visible={isShowDalModal}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="school.add.laber" />}
            >
              {getFieldDecorator('schoolName', {
                rules: [
                  {
                    message: formatMessage({ id: 'school.add.placeholder' }),
                  },
                ],
              })(<Input disabled placeholder={formatMessage({ id: 'school.add.placeholder' })} />)}
            </FormItem>
          </Form>
        </Modal>
        <Card>
          <Button icon="plus-circle" onClick={this.addSchool}>学校新增</Button><br />
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
          dataSource={schoolLists}
        />
      </PageHeaderWrapper>
    )
  }
}

export default SchoolList;
