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
  Layout,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormItem from 'antd/es/form/FormItem';
import Header from 'antd/lib/calendar/Header';
import Sider from 'antd/lib/layout/Sider';
import styles from './style.less';
import exception from '@/locales/zh-TW/exception';

@connect(({ school, companys }) => {
  const { schoolList, lineinfolist } = school;
  const { companyList } = companys;
  return {
    schoolList,
    companyList,
    lineinfolist
  };
})
class Home extends PureComponent{
  state = {
    defaultCompany: '',
    line:[
      
    ],
    com_index: 0
  }

  componentDidMount = () => {
    this.getListmes();
  }

  getListmes = async() => {
    const { item, com_index } = this.props.location.query;
    const { dispatch } = this.props;
    
      await dispatch({
        type: 'companys/getCompanylist'
      })
      await dispatch({ 
        type: 'school/getSchools',
        payload: { company_id: item ? item.id : this.props.companyList[0].id }
      })
      await dispatch({ 
        type: 'school/getLineinfo',
        payload: { school_id: this.props.schoolList.length > 0 ? this.props.schoolList[0].id : '' }
      })
  }

  onseletcompany = async(e,index) => {
    const { dispatch } = this.props;
    await dispatch({ 
      type: 'school/getSchools',
      payload: { company_id: index.key }
    })
    if(this.props.schoolList.length > 0){
      await dispatch({ 
        type: 'school/getLineinfo',
        payload: { school_id: this.props.schoolList.length > 0 ? this.props.schoolList[0].id : '' }
      })
    }
    
  }

  renderItem=(item)=>(
    <List.Item key={item.key}>
      <Card
        hoverable
        className={styles.card} 
        actions={[<a>操作一</a>, <a>操作二</a>]}
      >
        <div className={styles.card_box}>
          <div>
            <span>{item.line_name}</span>
            {
              item.schedule_list.map((item,index)=>{
                return <span key={index}>{`${item.shift_name} ${item.time} `}</span>
              })
            }
          </div>
          <div>
            {
              item.stops.map((item,index)=>{
                return <span key={index} style={{color: 'blue'}}>{`${item.location_name}`}</span>
              })
            }
          </div>
        </div>
      </Card>
    </List.Item>
  );

  renderList (item,index) {
    const { Option } = Select;
    return <Option value = {item.company_name} key={item.id}>{item.company_name}</Option>;
  }

  render(){
    const { schoolList, companyList, location, lineinfolist } = this.props;
    const { Option } = Select;
    return(
      <PageHeaderWrapper
        title={<FormattedMessage id='school.home.title' />}
      >
        <Select defaultValue={this.props.companyList.length > 0 ? this.props.companyList[this.state.com_index].company_name: ''} 
                onSelect={this.onseletcompany}
                style={{marginBottom: 10}}>
          {
            companyList.map((item,index)=>this.renderList(item,index))
          }
        </Select>
        <Layout>
          <Sider style={{backgroundColor:"white"}} className={styles.siderBox}>
            <div className={styles.cardList}>
              <List
                size="small"
                header={<div style={{textAlign:'center'}}>学校列表</div>}
                bordered
                dataSource={schoolList}
                renderItem={item=>(<List.Item  style={{backgroundColor:"white"}}>{item.school_name}</List.Item>)}
              />
            </div>
          </Sider>
          <Layout>
            <List
              grid={{ gutter: 24, lg: 2, md: 2, sm: 1, xs: 1 }}
              header={<div style={{textAlign:'center'}}>路线列表</div>}
              bordered
              dataSource={schoolList.length > 0 ? lineinfolist : this.state.line}
              renderItem={item=>this.renderItem(item)}
            />
          </Layout>
        </Layout>
        {/* <Card bordered={false}>

        </Card> */}
      </PageHeaderWrapper>
    )
  }
}
export default Home;