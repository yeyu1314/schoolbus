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
import FormItem from 'antd/es/form/FormItem';
import styles from '../Examine/style.less';


@connect(({ line }) => {
  const { routerList,modalDataLines,schoolList} = line;//从状态机中取数据
  return {
    routerList,
    modalDataLines,
    schoolList
  };
})
@Form.create()
class Line extends PureComponent{
  state = {
    columns: [
      { title: '学校', dataIndex: 'school', key: 'school' },
      { title: '路线', dataIndex: 'line', key: 'line' },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: (item,index,j) => (
          <div>
            <Button onClick={() => this.modifyLine(item)} icon="form">修改</Button>
          </div>
        ),
      },
    ],
    modalColumns : [
      {title: 'modal学校',dataIndex: 'school',key: 'school'},
      {title: 'modal路线',dataIndex: 'line',key: 'line'}
    ],
    selectedRowKeys : '',//弹窗中选中列的key
    selectedRows : '',//弹窗中选中列的内容
    school_id : '',//下拉框学校id
    startTime : '',//开始时间
    endTime : '',//结束时间
    isShowModal : false,//显示修改弹窗
    item : '',
    schoolName : '',
    lineName : '',
    itemId : '',
    modalLineCon : [],
    newRoutelist: []
  }
  componentDidMount(){
    const { dispatch } = this.props;
    const company_id = '001'
    dispatch({//根据公司id请求对应的学校
      type: 'line/getSchoolList',
      payload: company_id,
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    console.log('model层发生变化',nextProps,nextContext)
    this.setState({
      newRoutelist : nextProps.routerList
    })
  }

  selectRoute = () => {//点击选择路线弹窗
    const {modalDataLines} = this.props
    this.setState({
      audit: true,
      modalLineCon : [],
      school_id : '',//下拉框学校id
      startTime : '',//开始时间
      endTime : '',//结束时间
    })

    console.log('想清空的数据',modalDataLines)
  }

  getSchoolValue = (value) =>{//获取下拉框中学校id
    this.setState({
      school_id : value
    })
  }

  getTimes = (value) => {
    const starTime = value[0]._d
    const endTime = value[1]._d
    this.setState({
      startTime : starTime,
      endTime : endTime
    })
  }

  getRouters = () => {//根据选择请求各路线
    const { dispatch ,modalDataLines} = this.props;
    const {school_id,startTime,endTime} = this.state
    const obj = {school_id,startTime,endTime}
    dispatch({//获取路线信息
      type: 'line/getRouterList',
      payload: obj
    })
    this.setState({
      audit: true,
      modalLineCon : modalDataLines
    })
  }

  selectLine = () => {//确定选择所勾选的路线
    const { dispatch } = this.props;
    const {selectedRows} = this.state
    const obj = selectedRows

    dispatch({
      type: 'line/seleclLine',
      payload: obj
    })
    this.setState({
      audit:false
    })
  }
  handleCancel = e => {//取消弹窗
    // console.log(e);
    this.setState({
      audit: false,
      isShowModal : false
    });
  };

  modifyLine = (item) => {//修改
    this.setState({
      isShowModal: true,
      item : item,
      itemId : item.key
    });
    this.props.form.setFieldsValue({
      schoolName: item.school,
      lineName: item.line,
    })
  }


  handleSubmit= (e) =>{//提交  修改  的路线信息
    const { dispatch , form} = this.props;
    const item = this.state.item;
    e.preventDefault();
    e.persist();
    form.validateFields( (err, values) =>{
      if(!err){
        const obj = {
          id: item.key,
          school_name: values.schoolName,
          line_name: values.lineName,
        }

        // console.log('查查看',obj)
        dispatch({
          type: 'line/modifylines',
          payload: obj
        })
        this.setState({
          isShowModal: false,
        });
      }
    });
  }



  renderList (item,index) {//根据请求回的学校列表，渲染成弹窗中的学校下拉框
    const { Option } = Select;
    return <Option value = {item.school_name} key={item.id}>{item.school_name}</Option>;
  }
  render(){

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`勾选的下标: ${selectedRowKeys}`, '内容: ', selectedRows);
        this.setState({
          selectedRowKeys : selectedRowKeys,
          selectedRows : selectedRows
        })
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    }
    const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
    const {columns ,modalColumns,modalLineCon} = this.state;
    const {routerList,modalDataLines,schoolList} = this.props
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

    const { Option } = Select;
    console.log('JSJSJSJ',schoolList);
    return(
      <PageHeaderWrapper
        title={<FormattedMessage id='menu.School.Linemoment' />}
      >
        <Modal
          title="选择路线"
          visible={this.state.audit}
          footer={null}
          width = '80%'
          onCancel={this.handleCancel}
        >
          选择学校:<Select
            showSearch
            style={{ width: 200 ,marginRight : 30}}
            placeholder="Select a school"
            optionFilterProp="children"
            onChange={this.getSchoolValue}
            /*filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }*/
          >
          {
            schoolList.map((item,index)=>this.renderList(item,index))
          }
          </Select>
          选择时间:<RangePicker onChange={this.getTimes} />
          <Button type="primary" style={{marginLeft : 10}} onClick={this.getRouters}>确认查询</Button>
          <Table rowSelection={rowSelection} columns={modalColumns} dataSource={modalDataLines} />
          <Button type="primary" onClick={this.selectLine}>选择路线</Button>
        </Modal>

        <Modal
          title='修改路线信息'
          visible={this.state.isShowModal}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit}>
           <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="lines.schoolName.label" />}
            >
              {getFieldDecorator('schoolName', {
                rules: [
                  {required: true,
                    message: formatMessage({ id: 'lines.schoolName.placeholder' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'lines.schoolName.placeholder' })} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="lines.routeName.label" />}
            >
              {getFieldDecorator('lineName', {
                rules: [
                  {required: true,
                    message: formatMessage({ id: 'lines.routeName.placeholder' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'lines.routeName.placeholder' })} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }}>
                <FormattedMessage id="form.save" />
              </Button>
            </FormItem>
          </Form>
        </Modal>

        <Card>
          <Button type="primary" onClick={this.selectRoute} style={{marginBottom : 10}}>查询路线</Button>
          <Table
            className={styles.tabellist}
            columns={columns}
            dataSource={this.state.newRoutelist}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}
export default Line;
