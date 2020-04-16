
import React, { PureComponent, Fragment } from 'react';
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
} from 'antd';
import axios from 'axios';

import { luod } from '@/config'
import { StudentInfoTemplate } from '@/api/Student';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;



const uploadProps = {
  accept:"application/vnd.ms-excel.sheet.macroEnabled.12, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  action: `${luod}/std/students/info`,
  multiple: false,
  data: { a: 1, b: 2 },
  headers: {
    'Content-Type': 'application/form-data'
  },
  onStart(file) {
    console.log('onStart', file, file.name);
  },
  onSuccess(ret, file) {
    console.log('onSuccess', ret, file.name);
  },
  onError(err) {
    console.log('onError', err);
  },
  onProgress({ percent }, file) {
    console.log('onProgress', `${percent}%`, file.name);
  },
  customRequest({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials,
  }) {
    // EXAMPLE: post form-data with 'axios'
    const param = new FormData();
      param.append('file', file);
        axios({
          method:'POST',
          url:`${luod}/std/students/info`,
          timeout:30000,
          data: param,
          responseType: 'arraybuffer'
      }).then(function (res) {
        console.log(res);
        const aLink = document.createElement("a");
          let blob = new Blob([res.data], {type: "application/vnd.ms-excel"})
          aLink.href = URL.createObjectURL(blob)
          aLink.setAttribute('download', '返回信息' + '.xls') // 设置下载文件名称
          aLink.click()
        // const blob = new Blob([res.data]);
        // const fileName = '倒入返回信息.xlsx';
        // const elink = document.createElement('a');
        // elink.download = fileName;
        // elink.style.display = 'none';
        // elink.href = URL.createObjectURL(blob);
        // document.body.appendChild(elink);
        // elink.click();
        // URL.revokeObjectURL(elink.href); // 释放URL 对象
        // document.body.removeChild(elink);
        onSuccess(res, file);
        message.success(`${file.name} file uploaded successfully`);
      })
      .catch(function (error) {
        onError(error)
        message.error(`${file.name} file upload failed.`);
      });
  },
};

@connect(({ loading, form, user }) => ({
  // submitting: loading.effects['form/submitRegularForm'],
  data: form.step,
}))
@Form.create()
class ImportAndExport extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        ...props,
    }
}

  handleChange = (info) => {
    console.log(info);
    // if (info.file.status !== 'uploading') {
    //   console.log(info.file, info.fileList);
    // }
    // if (info.file.status === 'done') {
      const param = new FormData();
      param.append('file', info.file);
      const headers = Object.assign({ 'Content-Type': 'application/form-data'});
        axios({
          method:'POST',
          url:`${luod}/std/students/info`,
          timeout:30000,
          data: param,
          responseType: 'arraybuffer'
      }).then(function (res) {
        console.log(res);
        const aLink = document.createElement("a");
          let blob = new Blob([res.data], {type: "application/vnd.ms-excel"})
          aLink.href = URL.createObjectURL(blob)
          aLink.setAttribute('download', '返回信息' + '.xls') // 设置下载文件名称
          aLink.click()
        // const blob = new Blob([res.data]);
        // const fileName = '倒入返回信息.xlsx';
        // const elink = document.createElement('a');
        // elink.download = fileName;
        // elink.style.display = 'none';
        // elink.href = URL.createObjectURL(blob);
        // document.body.appendChild(elink);
        // elink.click();
        // URL.revokeObjectURL(elink.href); // 释放URL 对象
        // document.body.removeChild(elink);
        message.success(`${info.file.name} file uploaded successfully`);
      })
      .catch(function (error) {
        console.log(error);
        message.error(`${info.file.name} file upload failed.`);
      });
    // } else if (info.file.status === 'error') {
    //   message.error(`${info.file.name} file upload failed.`);
    // }
}; //上传文件时的状态

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
  //   const props = {
     
  //     accept:"application/vnd.ms-excel.sheet.macroEnabled.12, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      
  //     customRequest: this.handleChange,
  // };

    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="student.ImportAndExport" />}
        // content={<FormattedMessage id="app.forms.basic.description" />}
      >
        <Card title="导出 Execl" className={styles.card} bordered={false}>
            <Button onClick={()=> StudentInfoTemplate()}>
              <Icon type="download" />导出 Execl 模板
            </Button>
        </Card>

        <Card title="导入 Execl" className={styles.card} bordered={false}>
          <Upload {...uploadProps} >
            <Button>
              <Icon type="upload" />导入 Execl
            </Button>
          </Upload>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ImportAndExport;
