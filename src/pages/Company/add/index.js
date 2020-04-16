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
import FormItem from 'antd/es/form/FormItem';
import styles from './style.less';

@connect(({ company }) => {
  const { ismodify } = company;
  return {
    ismodify
  };
})

@Form.create()
class CompanyAdd extends PureComponent {

  componentDidMount(){
    console.log('点击传过来的值111',this.props.location)
    const { item } = this.props.location.query;
    if(item){
      this.props.form.setFieldsValue({
        companiesName: item.company_name
      })
    }
  }

  componentWillReceiveProps(nextProps){
    console.log('改变了这个redux没有',nextProps)
    // if(nextProps.ismodify || nextProps.isadd){
    //   if(nextProps.ismodify.status === 200 || nextProps.isadd.status === 200){
    //     router.push({
    //       pathname:'/Company/List'
    //     })
    //   }
    // }
  }

  handleSubmit= (e) =>{
    const { dispatch } = this.props;
    e.preventDefault();
    e.persist();
    this.props.form.validateFields((err, values) =>{
      if(!err){
        //请求接口
        if(this.props.location.query.item){
          console.log('sksk',values)
          const obj = {
            createDatetime: new Date(),
            updateDatetime: new Date(),
            id: this.props.location.query.item.id,
            company_name: values.companiesName,
            contact_name: values.companyManager,
            contact_phone: values.companyContact,
            email: "emil",
            address: values.companyAdress
          };
          dispatch({
            type: 'company/modifycompays',
            payload: obj
          })
        }else {
          console.log('sksk',values)
          const obj = {
            createDatetime: new Date(),
            updateDatetime: new Date(),
            company_name: values.companiesName,
            contact_name: values.companyManager,
            contact_phone: values.companyContact,
            email: "emil",
            address: values.companyAdress
          };
          console.log('公司的新增,',obj)
          dispatch({
            type: 'company/addcompays',
            payload: obj
          })
        }
      }
    });
    
  }	

  render(){
    const { submitting } = this.props;
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
    console.log('--------------');
    const { form:{ getFieldDecorator, getFieldValue } } = this.props;
    return(
      <PageHeaderWrapper
        title={<FormattedMessage id="companies.add.title" />}
      >
        <Card  bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="companies.companyName.label" />}
            >
              {getFieldDecorator('companiesName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'companies.companyName.placeholder' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'companies.companyName.placeholder' })} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="companies.companyManager.label" />}
            >
              {getFieldDecorator('companyManager', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'companies.companyManager.placeholder' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'companies.companyManager.placeholder' })} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="companies.companyContact.label" />}
            >
              {getFieldDecorator('companyContact', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'companies.companyContact.placeholder' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'companies.companyContact.placeholder' })} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="companies.companyAdress.label" />}
            >
              {getFieldDecorator('companyAdress', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'companies.companyAdress.placeholder' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'companies.companyAdress.placeholder' })} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }}>
                <FormattedMessage id="form.save" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default CompanyAdd;
