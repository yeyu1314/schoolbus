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

@connect(({ companys }) => {
  const { companyList } = companys;
  return {
    companyList
  };
})
class CompanyList extends PureComponent {
  state = {
    columns: [
      { title: '名称', dataIndex: 'company_name', key: 'company_name' },
      { title: '创建时间', dataIndex: 'create_datetime', key: 'create_datetime' },
      { title: '修改时间', dataIndex: 'update_datetime', key: 'update_datetime' },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: (item,index,j) => (
          <div>
            <Button onClick={() => this.modifyItem(item)} icon="form">修改</Button>
            <Button onClick={() => this.deletelItem(item)} icon="delete">删除</Button>
            <Button onClick={() => this.toviewItem(item,index,j)} icon="delete">查看</Button>
          </div>
        ),
      },
    ],
    company_id: '',
    visible: false
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'companys/getCompanylist'
    })
  }
  modifyItem(item) {
    router.push({
      pathname:'/Company/Add',
      query: { item:item}
    })
  }

  deletelItem(item) {
    this.setState({
      company_id : item.id,
      visible: true
    })
  }

  toviewItem(item,index,j){
    // router.push({
    //   pathname:'/School/Home',
    //   query: { item:item , com_index: j}
    // })
    router.push({
      pathname:'/School/SchoolList',
    })
  }

  addcompay(){
    router.push({
      pathname:'/Company/Add'
    })
  }

  handleOk = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'companys/deletecompay',
      payload: this.state.company_id
    })
    this.setState({
      visible:false
    })
  }

  handleCancel = () =>{
    this.setState({
      visible: false
    })
  }

  Toschool(e){
    console.log('上课上课考试',e)
  }

  render() {
    const { companyList } = this.props;
    const { data, columns } = this.state;
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="companies.list.title" />}
      >
        <Modal
          title="提示"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>是否删除该公司？</p>
        </Modal>
        <Card>
            <Button icon="plus-circle" onClick={()=>this.addcompay()}>公司新增</Button>
        </Card>
        <Table
          className={styles.tabellist}
          columns={columns}
          onClick={(e) => this.Toschool(e)}
          expandedRowRender={record => <p style={{ margin: 0 }}>打开即可查看该公司的详细说明</p>}
          dataSource={companyList}
        />

      </PageHeaderWrapper>
    )
  }
}

export default CompanyList;
