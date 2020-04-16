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


class Line extends PureComponent{
  state = {

  }
  selectRoute = () => {//点击弹窗
    this.setState({
      audit: true
    })
  }
  selectLine = () => {//确定选择所勾选的路线
    const { dispatch } = this.props;
    dispatch({
      type: 'line/seleclLine',
      payload: ''
    })
    this.setState({
      audit:false
    })
  }
  handleCancel = e => {//取消弹窗
    console.log(e);
    this.setState({
      audit: false,
    });
  };

  selectData = (date, dateString) => {
    console.log(date, dateString);
  }

  render(){

    const columns = [
      {title: '学校',dataIndex: 'School',key: 'School'},
      {title: '路线',dataIndex: 'Route',key: 'Route',}
    ]
    const data = [
      {key: '1',School : '暂无数据',Route : '暂无数据'},
    ]
    const {Option} = Select;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    const modalColumns = [
      {title: 'modal学校',dataIndex: 'School',key: 'School'},
      {title: 'modal路线',dataIndex: 'Route',key: 'Route',}
    ];RangePicker
    const modalData = [
      {key: '1',School : '暂无数据',Route : '暂无数据'},
      {key: '2',School : 'modal深圳小学1',Route : '一号线'},
      {key: '3',School : '深圳小学2',Route : '一号线'},
      {key: '4',School : '深圳小学3',Route : '一号线'},
      {key: '5',School : '深圳小学4',Route : '一号线'},
    ]
    const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

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
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="1">深圳小学</Option>
            <Option value="2">深圳中学</Option>
            <Option value="3">深圳大学</Option>
          </Select>
          选择时间:<RangePicker onChange={this.selectData} />
          <Table rowSelection={rowSelection} columns={modalColumns} dataSource={modalData} />
          <Button type="primary" onClick={this.selectLine}>选择路线</Button>
        </Modal>

        <Card>
          <Button type="primary" onClick={this.selectRoute} style={{marginBottom : 10}}>点击提交</Button>
          <Table columns={columns} dataSource={data}/>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
export default Line;
