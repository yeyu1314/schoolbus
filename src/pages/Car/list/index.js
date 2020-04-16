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
@connect(({ companys }) => ({
  companyList: companys.companyList,
}))
@Form.create()
class CarList extends PureComponent {

  state = {

  };

  componentDidMount() {

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

  render(){
    const columns = [
      { title: '车辆名称', dataIndex: 'carName', key: 'carName' },
      { title: '车牌号', dataIndex: 'carNnumber', key: 'carNnumber' },
      { title: '车辆类型', dataIndex: 'carType', key: 'carType' },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: (item,index) => (
          <div>
            <Button onClick={() => this.carUpdate(item)} icon="edit">修改</Button>
            <Button onClick={() => this.carDelete(item)} icon="delete">删除</Button>
            <Button onClick={() => this.carInfos(item,index)} icon="unordered-list">查看</Button>
          </div>
        ),
      },
    ]
    return(
      <PageHeaderWrapper
        title={<FormattedMessage id="car.title.list" />}
      >
        <Card>
          <Table
            className={styles.tabellist}
            columns={columns}
            // dataSource={equipmentLists.data}
            // pagination={pagination}
          />
        </Card>

      </PageHeaderWrapper>
    )
  }
}

export default CarList;
