import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import {
  Form,
  Input,
  TimePicker ,
  Select,
  Button,
  Card,
  InputNumber,
  Checkbox,
  Icon,
  Tooltip,
  Upload,
  TreeSelect
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormItem from 'antd/es/form/FormItem';
import moment from 'moment';
import styles from './style.less';

@connect(({ companys , schools }) => ({
  companyList: companys.companyList,
  schoolList: schools.schoolList,
}))

@Form.create()
class LineAdd extends PureComponent {

  state = {
    checkedM : false,
    disabledMS : true,
    disabledME : true,
    lineArr : [
      {id:1,checkName: '早上上学',name:'MS'},
      {id:2,checkName: '中午上学',name:'AS'},
      {id:3,checkName: '中午放学',name:'AH'},
      {id:4,checkName: '下午放学',name:'EH'},
    ]
  };

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({// 获取所有公司
      type: 'companys/getCompanylist',
    });
  }

  onChangeCompany = (value) => {
    const { dispatch } = this.props;
    dispatch({// 获取所有学校
      type: 'schools/getSchoolList',
      payload : value
    });
  };

  disabledHours = () => {
    return [1,4]
  }

  changCheckbox = e => {
    const InputValue = e.target.value;
    console.log(InputValue)
  }

  changTimeS = (time,timeString) => {
    const InputValue = time;
    console.log(InputValue)
    console.log(timeString)
  }

  changTimeA = e => {

  }



  render(){
    const {companyList,schoolList} = this.props
    const {lineArr} = this.state
    const lineTime = lineArr.map((item) => {
      return(
        <div key={item.id} className={styles.equipmentInput} style={{float: "right",marginRight: "100px",marginBottom: "10px"}}>
          <Checkbox onChange={this.changCheckbox} name={item.name}>{item.checkName}</Checkbox>
          <TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} name={item.name} onChange={this.changTimeS} />
          <TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} name={item.name} onChange={this.changTimeA} />
        </div>
      )
    })


    return(
      <PageHeaderWrapper
        title={<FormattedMessage id="lines.add.title" />}
      >
        <Card>
          {/* <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
             校车公司
            <Form.Item {...formItemLayout} label={<FormattedMessage id="student.schoolbusCompany.label" />}>
              {getFieldDecorator('schoolbusCompany', {
                rules: [{ required: false, message: formatMessage({ id: 'student.schoolbusCompany.placeholder' }) }],
              })(
                <Select
                  placeholder={formatMessage({ id: 'student.schoolbusCompany.placeholder' })}
                  onChange={this.onChangeCompany}
                >
                  {
                    companyList.map((item) =>
                      <Select.Option key={item.id}>{item.company_name} </Select.Option>)
                  }
                </Select>,
              )}
            </Form.Item>
            学校名称
            <Form.Item {...formItemLayout} label={<FormattedMessage id="student.school.label"/>}>
              {getFieldDecorator('school', {
                rules: [{ required: false, message: formatMessage({ id: 'student.school.placeholder' }) }],
              })(
                <Select
                  placeholder={<FormattedMessage id="student.school.placeholder"/>}
                  onChange={this.onChangeSchool}
                >
                  {
                    schoolList.map((schoolList, key) =>
                      <Select.Option key={schoolList.schoolId}>{schoolList.schoolName} </Select.Option>)
                  }
                </Select>,
              )}
            </Form.Item>
             路线名称
            <Form.Item {...formItemLayout} label={<FormattedMessage id="lines.routeName.label" />}>
              {getFieldDecorator('lineName', {
                rules: [{ required: false, message: formatMessage({ id: 'lines.routeName.placeholder' }) }],
              })(
                <Input placeholder={formatMessage({ id: 'lines.routeName.placeholder' })} />,
              )}
            </Form.Item>
            路线时刻表
            <Form.Item {...formItemLayout} label={<FormattedMessage id="lines.routeNow.label" />}>
              {getFieldDecorator('line', {
                rules: [{ required: false, message: formatMessage({ id: 'lines.routeName.placeholder' }) }],
              })(
                <div>
                  <Checkbox>早上上学</Checkbox>
                  <TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
                  <TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} disabled={disabledME} />
                  <Input placeholder="Basic usage" type='time'/>
                </div>
                )}
            </Form.Item>

            {LineItem}

            <Form.Item {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button
              >
              <Button style={{ marginLeft: 8 }} onClick={this.cancelUpdate}>
                <FormattedMessage id="form.cancel" />
              </Button>
            </Form.Item>
          </Form>
*/}

          {/* 公司 */}
          <div className={styles.equipmentBox}>
            <span>{formatMessage({ id: 'student.schoolbusCompany.label' })} : </span>
            <Select className={styles.equipmentInput} placeholder={formatMessage({ id: 'student.schoolbusCompany.placeholder' })} onChange={this.onChangeCompany}>
              {
                companyList.map((item) =>
                  <Select.Option key={item.id} value={item.id}>{item.company_name} </Select.Option>)
              }
            </Select>
          </div>
          {/* 学校 */}
          <div className={styles.equipmentBox}>
            <span>{formatMessage({ id: 'student.school.label' })} : </span>
            <Select className={styles.equipmentInput} placeholder={formatMessage({ id: 'student.school.placeholder' })} onChange={this.changeSchool}>
              {
                schoolList.map((item) =>
                  <Select.Option key={item.schoolId} value={item.schoolId}>{item.schoolName} </Select.Option>)
              }
            </Select>
          </div>
          {/* 路线时刻 */}
          <div className={styles.equipmentBox}>
            <span>路线名称 : </span>
            <Input className={styles.equipmentInput} />
          </div>
          {/* 路线时刻 */}
          <div className={styles.equipmentBox}>
            <span>路线时刻 : </span>
            {lineTime}
          </div>


        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default LineAdd;
