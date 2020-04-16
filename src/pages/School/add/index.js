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
  TreeSelect
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormItem from 'antd/es/form/FormItem';

@connect(({ companys ,schools }) => {
  const { companyList } = companys;
  const { areaList} = schools;
  return {
    companyList,areaList
  };
})

@Form.create()
class SchoolAdd extends PureComponent {

  state = {
    classValue: ['1年级','2年级','3年级','4年级','5年级','6年级','7年级','8年级'],
  };

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({// 获取所有公司
      type: 'companys/getCompanylist',
    });
    dispatch({// 获取所有公司
      type: 'schools/getSrealist',
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('表单的值',values)
        const grade = values.grateclassValue
        const returnArr = []
        const transformArr = []
        const tempArr = []
        let newArrStr = []

       //循环遍历是否带有班级，并转换成对象数组
        for(let index = 0;index < grade.length; index++) {
          //如果是只有年级，例如：["7年级","8年级",....]
          //默认添加完所有班级
          if (grade[index].indexOf('-') === -1) {// 没有
            let class_list = []
            for (let i = 1; i < 16; i++) {
              class_list.push({
                student_grade: grade[index],
                student_class: `（${i}）班`
              })
            }
            returnArr.push({
              "grade": grade[index],
              "class_list": class_list
            })
          } else { //否则，根据分隔符分割数据，转换成对象数组，
            // 格式：[{student_grade:"4年级",student_class:"3班"},{student_grade:"4年级",student_class:"4班"}....]
            newArrStr = grade[index].split("-")
            transformArr.push({
              "student_grade": newArrStr[0],
              "student_class": newArrStr[1]
            })
          }
        }
        //根据转换后的对象数组，组装数据格式：
        for(let index = 0; index < transformArr.length; index++) {
          if(tempArr.indexOf(transformArr[index].student_grade) === -1) {   //年级不存在了
            returnArr.push({
              "grade":transformArr[index].student_grade,
              "class_list":[transformArr[index]]
            })
            tempArr.push(transformArr[index].student_grade)
          } else {
            for(let returnIndex = 0; returnIndex < returnArr.length; returnIndex++) {
              if(returnArr[returnIndex].grade === transformArr[index].student_grade) {
                returnArr[returnIndex].class_list.push(transformArr[index])
                break;
              }
            }
          }
        }

        // console.log(returnArr)

        const obj = {
          school_name : values.schoolName,
          company_id : values.schoolbusCompany *1,
          area_id : values.area*1,
          grade_list : returnArr
        }
        console.log('传递的值',obj)
        dispatch({// 获取所有公司
          type: 'school/addSchool',
          payload: obj
        });
      }
    })
  }


  render(){
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
    const {getFieldDecorator}= this.props.form
    const {classValue} = this.state
    const { SHOW_PARENT } = TreeSelect;
    const {submitting,companyList,areaList} = this.props
    const treeData = []
    for (let i = 1;i < 9; i++){
      const children = []
      const obj = {
        title : `${i}年级`,
        value : `${i}年级`,
        key: `${i}`,
        children
      }
      for (let j = 1; j <= 15; j++){
        const classObj = {
          title : `${i}年级${j}班`,
          value : `${i}年级-（${j}）班`,
          key: `${i}-${j}`,
        }
        children.push(classObj)
      }
      treeData.push(obj)
    }
    const tProps = {
      treeData,
      // setFieldsValue : classValue,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择年级/班级',
    };
    return(
      <PageHeaderWrapper
        title={<FormattedMessage id="school.add.title" />}
      >
        <Card>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            {/* 校车公司 */}
            <Form.Item {...formItemLayout} label={<FormattedMessage id="student.schoolbusCompany.label" />}>
              {getFieldDecorator('schoolbusCompany', {
                rules: [{ required: true, message: formatMessage({ id: 'student.schoolbusCompany.placeholder' }) }],
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
            {/*区域*/}
            <Form.Item {...formItemLayout} label={<FormattedMessage id="school.addarea.laber" />}>
              {getFieldDecorator('area', {
                rules: [{ required: true, message: formatMessage({ id: 'school.addarea.placeholder' }) }],
              })(
                <Select
                  placeholder={formatMessage({ id: 'school.addarea.placeholder' })}
                >
                  {
                    areaList.map((item) =>
                      <Select.Option key={item.areaId}>{item.areaName} </Select.Option>)
                  }
                </Select>,
              )}
            </Form.Item>
            {/*学校名称*/}
            <Form.Item {...formItemLayout} label={<FormattedMessage id="school.add.laber" />}>
              {getFieldDecorator('schoolName', {
                rules: [{ required: true, message: formatMessage({ id: 'school.add.placeholder' }) }],
              })(
                <Input placeholder={formatMessage({ id: 'school.add.placeholder' })} />,
              )}
            </Form.Item>
            {/*年级班级*/}
            <Form.Item {...formItemLayout} label={<FormattedMessage id="school.addclass.laber" />}>
              {getFieldDecorator('grateclassValue', {
                rules: [{ required: false, message: formatMessage({ id: 'school.addclass.placeholder' }) }],
                initialValue : classValue
              })(
                <TreeSelect {...tProps} />
              )}
            </Form.Item>


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
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default SchoolAdd;
