
import React, { PureComponent, Fragment, useState, useEffect } from 'react';
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
  message,
  Table,
  Modal,
  Row,
  Col
} from 'antd';

import { luod } from '@/config'
import { StudentInfoTemplate } from '@/api/Student';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading, form, user, examine }) => ({
  GetStudentInfo: loading.effects['examine/GetStudentInfo'],
  studentsCheck: loading.effects['examine/studentsCheck'],
  TableData: examine.data,

}))
@Form.create()
class ImportAndExport extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {//初始值
      arr : [
        {
          title: '头像',
          dataIndex: 'img',
          render: (item,index) => <img src={index.photo} width="50px"/>
        },
        {
          title: '姓名',
          dataIndex: 'name',
        },
        {
          title: '学校',
          dataIndex: 'school',
        },
        {
          title: '班级',
          dataIndex: 'class',
        },
        {
          title: '购买学校/路线',
          dataIndex: 'pay_school',
        },
        {
          title: '是否付费',
          dataIndex: 'pay_stype',
        },
        {
          title: '操作',
          dataIndex: 'btn',
          render: (item,index) => (
            <div>
              <Button onClick={() => this.onAudit(item,index)} style={{marginRight: 5}}>审核</Button>
              <Button onClick={() => this.onDetails(item,index)}>详情</Button>
            </div>
          )
        },
      ],
      data:[],
      selectedRowKeys:[],
      loading: false,
      audit: false,
      details: false,
      obj: {},
      ...props,
      pageNum:1,
      pageSize:10,
      remark:'',
      BatchOrOne:true,
      CheckStatus:0, //学生状态，-1 审核不通过， 0 待审核 ， 1 审核通过
    }
}

componentDidMount(){//componentDidMount() 方法会在组件已经被渲染到 DOM 中后运行
  const { dispatch } = this.props;
  const { pageNum, pageSize, CheckStatus} = this.state;
  dispatch({
    type: 'examine/GetStudentInfo',
    payload: {pageNum,pageSize,status:CheckStatus},
  });
}

onSelectChange= (rowindex,row) => {//传行id  行内容
  this.setState({ selectedRowKeys : rowindex, BatchOrOne: false });
}

onAudit = (index,item) => {
  // this.setState({
  //   audit: true
  // })
  this.setState({
    obj: {
      name: item.name,
      school: item.school,
      class: item.class,
      pay_school: item.pay_school,
      pay_stype: item.pay_stype,
      photo: item.photo,
      key: item.key,
    },
    audit: true,
    BatchOrOne: true,
  })
}

onBatchAudit = () => {//控制审核按钮   弹窗的显示隐藏
  // console.log('点击每一行的审核',item,index)
  // this.setState({
  //   audit: true
  // })
  this.setState({
    audit: true
  })
}

auditcancelModal = () => {//弹窗中点击 取消审核
  this.setState({
    audit: false
  })
}

onStudentsCheck = async() => {//审核通过
  const { dispatch } = this.props;
  const { obj, pageNum, pageSize, remark, BatchOrOne, selectedRowKeys, CheckStatus} = this.state;
  let body;
  if(BatchOrOne){
     body = [{
      id: obj.key,
      status:1,
      remark:remark,
    }]
  }else{
   body = selectedRowKeys.map((v,i)=>{
    return {id: v,status:1,remark:remark}
    })
  }
  console.log(body)
  
 await dispatch({
    type: 'examine/studentsCheck',
    payload: body,
  });

  await dispatch({
    type: 'examine/GetStudentInfo',
    payload: {pageNum,pageSize,status:CheckStatus},
  });

  this.setState({
    audit: false
  })
}

onStudentsNoCheck= async() => {//审核不通过
  const { dispatch } = this.props;
  const { obj, pageNum, pageSize, remark, BatchOrOne, selectedRowKeys, CheckStatus} = this.state;
  let body;
  if(BatchOrOne){
     body = [{
      id: obj.key,
      status:-1,
      remark:remark,
    }]
  }else{
   body = selectedRowKeys.map((v,i)=>{
    return {id: v,status:-1,remark:remark}
    })
  }
  console.log(body)
  
 await dispatch({
    type: 'examine/studentsCheck',
    payload: body,
  });

  await dispatch({
    type: 'examine/GetStudentInfo',
    payload: {pageNum,pageSize,status:CheckStatus},
  });

  this.setState({
    audit: false
  })
}

onDetails = (index,item) => {//详情
  this.setState({
    obj: {
      name: item.name,
      school: item.school,
      class: item.class,
      pay_school: item.pay_school,
      pay_stype: item.pay_stype,
      photo: item.photo
    },
    details: true
  })
}


detailscancelModal = () => {
  this.setState({
    details: false
  })
}
// onShowSizeChange = (current, pageSize) => {
//   console.log(current, pageSize);
//   this.setState({pageNum:page,pageSize:pageSize});
// }
onShowChange = (page, newPageSize) => {
  const { dispatch } = this.props;
  console.log(page, newPageSize);
  const { pageNum, pageSize} = this.state;

  dispatch({
    type: 'examine/GetStudentInfo',
    payload: {pageNum:page,pageSize:newPageSize},
  });
  this.setState({pageNum:page,pageSize:newPageSize});
}
  

  render() {
    const { submitting, TableData } = this.props;
    console.log('TableData',TableData)
    const { obj, remark } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const rowSelection = {//选择行上面的数据
      selectedRowKeys: this.state.selectedRowKeys,//获取selectedRowKeys
      onChange: this.onSelectChange,//定义onChange方法    onSelectChange
    };
    const pagination = {
      pageSize:TableData.pageSize,
      // showSizeChanger:true,
      onChange: this.onShowChange,
      // onShowSizeChange: this.onShowSizeChange,
      defaultCurrent:1,
      total:TableData.total,
    }
    const hasSelected = this.state.selectedRowKeys.length > 0;
    
    
    return (
      <PageHeaderWrapper
        title='审核列表'
        // conent={<FormattedMessage id="app.forms.basic.description" />}
      >
        <Modal
            title="审核"
            visible={this.state.audit}
            footer={null}
            onCancel={this.auditcancelModal}
          >
            <p>是否通过审核？</p>
            <Input placeholder="如若不通过请备注说明" value={remark} onChange={(e)=>this.setState({remark:e.target.value})}/>
            <div className={styles.modalbtn_box}>
              <Button onClick={this.auditcancelModal}>取消</Button>
              <Button onClick={this.onStudentsNoCheck}>审核不通过</Button>
              <Button onClick={this.onStudentsCheck}>审核通过</Button>
            </div>
        </Modal>

        <Modal
            title="详细"
            visible={this.state.details}
            footer={null}
            onCancel={()=>this.setState({details:!this.state.details})}
          >
            <img src={obj.photo} width="88px"/>
            <p>{obj.name}</p>
            <p>{obj.school}</p>
            <p>{obj.class}</p>
            <p>{obj.pay_school}</p>
        </Modal>

        <Card title="模板" className={styles.card} bordered={false}>
          <Button type="primary" onClick={this.onBatchAudit} disabled={!hasSelected} loading={this.state.loading} style={{marginBottom : 10}}>
             审核
          </Button>
          <Table rowSelection={rowSelection} columns={this.state.arr} dataSource={TableData.data} pagination={pagination}
            />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ImportAndExport;
