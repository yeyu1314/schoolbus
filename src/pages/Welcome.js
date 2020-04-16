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
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class Welcome extends PureComponent {

  render(){

    return(
      <PageHeaderWrapper
        title='欢迎登录校车管理系统'
      >
        <Card>
          <p>欢迎登录校车管理系统</p>
        </Card>

      </PageHeaderWrapper>
    )
  }
}

export default Welcome;
