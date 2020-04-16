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
import router from 'umi/router';
import styles from '../../Staff/style.less';
import { String_url, BaseUrl } from '@/config';
let parentId = 0;
@connect(({ rule }) => {
  const { stuInfoList, companyList, schoolList, serachStuList,showStuInfoList } = rule;//从状态机中取数据
  return {
    stuInfoList, companyList, schoolList, serachStuList,showStuInfoList
  };
})
@Form.create()

class StudentInfoList extends PureComponent {

  state = {
    company_id: '',
    company_name: '',
    school_id: '',
    schoolName : '',
    page: 1,
    page_size: 10,
    showParents : false,
    parentArr: [{id:parentId,name:'',phone:'',relation:''},],
    parentId : [],
    studentId : '',
    showMessage : false,
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    // 获取所有公司
    dispatch({
      type: 'rule/getCompanys',
    });

    const localTemp = JSON.parse(localStorage.getItem('hotTemp'));
    if (localTemp === undefined || localTemp === null){
      this.setState({
        school_id : '',
        company_name : ''
      })
    }else {
      this.setState({
        school_id : localTemp.school_id,
        company_name : localTemp.companyName,
        schoolName : localTemp.school_name
      })
    }

  };

  onChangeCompany = (value, index) => {
    const { dispatch } = this.props;
    // 根据公司id请求对应的学校
    dispatch({
      type: 'rule/getSchoolList',
      payload: value,
    });
    this.setState({
      company_id: value,
      company_name: index.props.children,
    });
  };

  onChangeSchool = (value) => {
    const { dispatch } = this.props;
    // 根据学校id请求对应的学生
    dispatch({
      type: 'rule/getStudentList',
      payload: { school_id: value, page : 1, page_size : 10 },
    });
    this.setState({ school_id: value ,page : 1,page_size : 10});
  };

  onShowChange = (page, newPageSize) => {
    const { dispatch ,serachStuList} = this.props;
    const { school_id } = this.state;
    dispatch({
      type: 'rule/getStudentList',
      payload: { school_id, page: page, page_size: newPageSize },
    });
    this.setState({
      page: page,
      page_size: newPageSize,
    });
  };

  addStudent = () => {
    router.push({
      pathname: '/School/AddStudent',
    });
  };

  updateStuInfo = (item) => {
    const { dispatch } = this.props;
    const {company_name} = this.state
    // 根据学生id查询信息
    dispatch({
      type: 'rule/modeifStuInfo',
      payload: {student_id:item.student_id,companyName:company_name},
    });
  };

  updateParentsInfo = (item) => {
    const {dispatch,form} = this.props
    const {company_name} = this.state
    console.log(item)
    dispatch({
      type: 'rule/showStuInfo',
      payload: {student_id:item.student_id,companyName:company_name},
    });

    this.setState({
      showParents : true,
      studentId : item.student_id,
      parentArr : item.parent
    })
  }

  handleCancel = e => {
    this.setState({
      showParents: false,
      showMessage : false
    });
  };

  handleUpdateInfo = e => {
    e.preventDefault();
    e.persist();
    const { dispatch , form, showStuInfoList} = this.props;
    const {parentArr,parentId,studentId,page,page_size,school_id} = this.state
    form.validateFields(async(err, values) => {
      const newnameArr = []
      const newrelationArr = []
      const newIdArr = []
      for (let i=0;i<parentArr.length;i++) {
        newnameArr.push({
          name: values[`studentParentName${i}`],
        });
        newrelationArr.push({
          relation: values[`studentRelationship${i}`],
        });
        newIdArr.push({
          id : parentArr[i].id
        })
      }
      const obj = newnameArr.map((item,index) => {
        return {...item, ...newrelationArr[index],...newIdArr[index]};
      });
      const params = {
        id : studentId,
        parents : obj
      }
      console.log('要传递的值',params)
      await dispatch({// 修改家长
        type: 'rule/updateParentsInfos',
        payload: params,
      });
      await dispatch({ // 再次请求学生列表
        type: 'rule/getStudentList',
        payload: { school_id , page, page_size },
      });
      // form.setFieldsValue({
      //   studentParentName1 : '',
      //   studentRelationship1 : ''
      // })
    })


    this.setState({
      showParents: false,
      parentArr : [],
    });
  }

  // delParent = ({ id }) => {
  //   const { parentArr } = this.state;
  //   const arr = parentArr.filter((item) => {
  //     return item.id !== id;
  //   });
  //   this.setState({
  //     parentArr: arr,
  //   });
  // }
  //
  // addParent = () => {
  //   parentId += 1;
  //   const obj = { route_id: '', location_id: '', id: parentId };
  //   const { parentArr } = this.state;
  //   const arr3 = [...parentArr, obj];
  //   this.setState({
  //     parentArr: arr3,
  //   });
  // }

  searchStuInfo = (value) => {
    const { dispatch } = this.props;
    // 搜索
    dispatch({
      type: 'rule/searchStuInfos',
      payload: { search_text: value },
    });
  };

  showStudentInfo = (item) => {
    const { dispatch } = this.props;
    const {company_name,showMessage} = this.state
    this.setState({
      showMessage : true
    })
    // 根据学生id查询信息
    dispatch({
      type: 'rule/showStuInfo',
      payload: {student_id:item.student_id,companyName:company_name},
    });
  }

  render() {
    const columns = [
      { title: '头像', dataIndex: 'avatar',
        render: (item,index) =>
            <img src={index.avatar} style={{width:50,height:50,}} />
      },
      { title: '姓名', dataIndex: 'name', key: 'name' },
      // { title: '学校', dataIndex: 'school', key: 'school' },
      { title: '年级', dataIndex: 'grate', key: 'grate' },
      { title: '班级', dataIndex: 'class_name', key: 'class_name' },
      { title: '家长手机号', dataIndex: 'phone', key: 'phone' },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: (item) => (
          <div>
            <Button onClick={() => this.updateStuInfo(item)} icon="form">修改</Button>
            <Button onClick={() => this.updateParentsInfo(item)} icon="form">修改家长</Button>
            <Button onClick={() => this.showStudentInfo(item)} icon="form">查看</Button>
          </div>
        ),
      },
    ];
    const { companyList, schoolList, serachStuList ,showStuInfoList } = this.props;
    const {showParents,company_name,schoolName,showMessage,parentArr} = this.state
    const pagination = {
      page_size: serachStuList.page_size,
      onChange: this.onShowChange,
      defaultCurrent: 1,
      total: serachStuList.total,
    };
    const { Search } = Input;
    const { getFieldDecorator } = this.props.form;
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

    const parent = parentArr?parentArr.map((item,index) =>{
      const studentParentName = `studentParentName${index}`;
      const studentRelationship = `studentRelationship${index}`;
      return (
        <div key={item.id}>
          <Form.Item
            {...formItemLayout}
            label={<FormattedMessage id="student.studentParentName.label" />}
          >
            {getFieldDecorator(studentParentName, {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'student.studentParentName.placeholder' }),
                },
              ],
              initialValue: item.name,
            })(<Input placeholder={formatMessage({ id: 'student.studentParentName.placeholder' })} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label={<FormattedMessage id="student.studentRelationship.label" />}>
            {getFieldDecorator(studentRelationship, {
              rules: [{ required: true, message: formatMessage({ id: 'student.studentRelationship.placeholder' }) }],
              initialValue: item.relation,
            })(
              <Select placeholder={<FormattedMessage id="student.studentRelationship.placeholder" />}>
                <Select.Option value="父亲">父亲</Select.Option>
                <Select.Option value="母亲">母亲</Select.Option>
                <Select.Option value="其他">其他</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </div>
      )
    }) : []

    const line = showStuInfoList.basic_route_list ? showStuInfoList.basic_route_list.map((item,index) => {
      return (
        <div key={index}>
          <p>已购买路线{index+1}：{item.basic_route_name}</p>
          <p>已购买站点{index+1}：{item.location_name}</p>
        </div>
      )
    }) : []

    const parentInfo = showStuInfoList.parents ? showStuInfoList.parents.map((item,index) => {
      return (
        <p key={index}>
          <span>家长姓名：{item.name}</span>
          <span  style={{marginLeft : 100}}>与学生关系：{item.relation}</span>
        </p>
      )
    }) : []


    // const line = showStuInfoList.basic_route_list.map((item,index) => {
    //   const lineName = `lineName${index}`;
    //   const siteName = `siteName${index}`;
    //   return (
    //     <div>
    //       <p>"已购买路线"+index+"：" : {showStuInfoList.basic_route_list[index].basic_route_name}</p>
    //       <p>已购买站点：</p>
    //     </div>
    //   )
    // })
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id='student.studentInfo'/>}
      >

        <Card>
          <Button icon="plus-circle" onClick={() => this.addStudent()}>添加学生</Button>
          <br />
          校车公司:
          <Select
            showSearch
            style={{ width: 200 }}
            // placeholder="Select a schoolbus"
            onChange={this.onChangeCompany}
            placeholder={company_name?company_name:'Select a schoolbus'}
          >
            {
              companyList.map((companyList, key) =>
                <Select.Option key={companyList.key} value={companyList.key}>{companyList.company_name}</Select.Option>)
            }
          </Select>
          学校:
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder={schoolName ? schoolName :"Select a school"}
            onChange={this.onChangeSchool}
          >
            {
              schoolList.map((schoolList, key) =>
                <Select.Option key={schoolList.schoolId}>{schoolList.schoolName}</Select.Option>)
            }
          </Select>
          <Search
            placeholder="input search text"
            onSearch={this.searchStuInfo}
            style={{ width: 200 }}
          />
          <Table
            className={styles.tabellist}
            columns={columns}
            dataSource={serachStuList.data}
            pagination={pagination}
          />
        </Card>

        <Modal
          title="家长信息"
          visible={showParents}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleUpdateInfo}>

            {parent}
            {/*<Button onClick={this.addParent}>添加家长</Button>*/}
            <Form.Item {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="form.submit" />
              </Button
              >
              <Button style={{ marginLeft: 8 }} onClick={this.handleCancel}>
                <FormattedMessage id="form.cancel" />
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="查看信息"
          visible={showMessage}
          footer={null}
          onCancel={this.handleCancel}
        >
          {/*<img src=BaseUrl/{showStuInfoList.photo} alt="头像"/>*/}
          <span>头像 : </span><img src={`${BaseUrl}/${showStuInfoList.photo}`} alt="头像"  style={{width:100,height:100,}} />
            <p>学生姓名 : {showStuInfoList.student_name}</p>
            <p>学校 : {showStuInfoList.school_name}</p>
            <p>年级 : {showStuInfoList.student_grade}</p>
            <p>班级 : {showStuInfoList.student_class}</p>
            <p>性别 : {showStuInfoList.student_gender}</p>
            <p>出生日期 : {showStuInfoList.date_of_birth}</p>
            <p>家长电话 : {showStuInfoList.parent_mobile_number}</p>
            { parentInfo }
            <p>家庭地址 : {showStuInfoList.address}</p>
            { line }
            <Button type="primary" onClick={this.handleCancel} style={{marginLeft: "40%"}}>关闭</Button>
        </Modal>


      </PageHeaderWrapper>
    );
  }
}

export default StudentInfoList;
