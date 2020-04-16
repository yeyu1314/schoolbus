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
  Upload, message,Modal
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import router from 'umi/router';
import ImgCrop from 'antd-img-crop';
import AvatarEditor from 'react-avatar-editor'
import styles from './style.less';
import MyEditor from '../Equipment/test/index'
// import AvatarEditor from '../Equipment/test';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

let lineArrId = 0;
// 头像组件 方便以后独立，增加裁剪之类的功能



function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    if(file){
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    }
  });
}

@connect(({ loading, form, user, rule }) => ({
  submitting: loading.effects['form/submitRegularForm'],
  data: form.step,
  currentUser: user.currentUser,
  companyList: rule.companyList,
  schoolList: rule.schoolList,
  lineList: rule.lineList,
  grateList: rule.grateList,
  classList: rule.classList,
  allSiteList: rule.allSiteList,
  siteList : rule.siteList,
}))
@Form.create()
class Add extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      title : '新增学生信息',
      loading: false,
      imgInfo: '',
      imageUrl : '',
      school_id: '',
      class_id: '',
      grate_id : '',
      lineArr: [
        { route_id: '', location_id: '', id: lineArrId },
      ],
      routeArr: [],// 路线
      siteArr: [],// 站点
      basic_route_list: [],// 路线加站点
      isDisabled: false,
      idShow: 'block',
      studentId : '',
      imgBase64 : {},
      isRequest : true,
      previewImage: '',
      previewVisible: false,
      student_code: '',
      deg : '0',
      avatarFile : '',
      file64 : '',
      isShowBtn : 'none'




    };
  }



  componentDidMount() {
    // console.log('点击更新传过来的值', this.props);
    const { dispatch, form } = this.props;
    const  state  = this.props.location.state;
    if (state) {
      form.setFieldsValue({
        schoolbusCompany: state.item.companyName,
        school: state.item.school_name,
        grade: state.item.student_grade,
        className: state.item.student_class,
        studentName: state.item.student_name,
        studentSex: state.item.student_gender,
        studentBirth: moment(state.item.date_of_birth),
        studentAddress: state.item.address,
        studentPhone: state.item.parent_mobile_number,
        studentRelationship: state.item.relation,
        studentParentName: state.item.parent_name,
        // headPhoto : state.item.photoUrl
      });
      this.setState({
        title :'修改学生信息',
        lineArr: state.item.basic_route_list,
        isDisabled: true,
        idShow: 'none',
        studentId: state.item.studentId,
        school_id: state.item.school_id,
        grate_id: state.item.student_grade,
        class_id: state.item.class_id,
        imageUrl : state.item.photoUrl,
        isRequest: false,
        student_code : state.item.student_code,
        avatarFile : state.item.photoUrl
      });
      const localhostArr = {
        companyName:state.item.companyName,
        school_name:state.item.school_name,
        school_id:state.item.school_id
      }
      localStorage.setItem("hotTemp", JSON.stringify(localhostArr));
    }
    dispatch({// 获取所有公司
      type: 'rule/getCompanys',
    });
  }

  onChangeCompany = (value) => {
    const { dispatch, form } = this.props;
    const { lineArr } = this.state;
    dispatch({// 根据公司id请求对应的学校
        type: 'rule/getSchoolList',
      payload: value,
    });
    // 公司更新了,清空输入框的值
    form.setFieldsValue(Object.values(lineArr).reduce((prev, next) => {
      prev[`studentLine${next.id}`] = undefined;
      prev[`studentSite${next.id}`] = undefined;
      prev.grade = undefined;
      prev.className = undefined;
      prev.school = undefined;
      return prev;
    }, {}));
  };

  onChangeSchool = async (value) => {
    const { dispatch, form } = this.props;
    const { lineArr } = this.state;
    dispatch({// 根据学校id请求对应的路线
      type: 'rule/getLineList',
      payload: value,
    });
    dispatch({// 根据学校id请求对应的年级
      type: 'rule/getGrateList',
      payload: value,
    });
    this.setState({// 更新学校id
      school_id: value,
    });
    // 学校更新了,清空输入框的值
    form.setFieldsValue(Object.values(lineArr).reduce((prev, next) => {
      prev[`studentLine${next.id}`] = undefined;
      prev[`studentSite${next.id}`] = undefined;
      prev.grade = undefined;
      prev.className = undefined;
      return prev;
    }, {}));
  };

  focusLine = () => {
    const { dispatch } = this.props;
    const { school_id } = this.state;
    if(this.props.location.state){
      dispatch({// 根据学校id请求对应的路线
        type: 'rule/getLineList',
        payload: school_id,
      });
    }
  };

  focusGrate = () => {
    const { dispatch } = this.props;
    const { school_id } = this.state;
    if(this.props.location.state){
      dispatch({// 根据学校id请求对应的年级
        type: 'rule/getGrateList',
        payload: school_id,
      });
    }
  };

  focusClass = () => {
    const { dispatch } = this.props;
    const { school_id ,grate_id} = this.state;
    const obj = {
      school_id,
      grate:grate_id,
    };
    if(this.props.location.state){
      dispatch({// 根据年级id请求对应的班级
        type: 'rule/getClassList',
        payload: obj,
      });
    }
  };

  onSiteLineChange = (lineId,index,id) => {
    // console.log(lineFieldName)
    console.log(lineId)
    /**
     * 使用 getFieldDecorator 装饰过的组件,不再需要也不应该用 onChange 来做同步
     * 但还是可以继续监听 onChange 等事件。
     */
    const { dispatch, allSiteList, form } = this.props;
    const { lineArr } = this.state;
    if (!allSiteList[lineId]) {
      // 如果对象中不存在对应id的值,则请求服务器
      dispatch({// 根据路线id请求对应的站点
        type: 'rule/onceGetSiteListById',
        id: lineId,
      });
    }

    form.setFieldsValue(Object.values(lineArr).reduce((prev, next) => {
      // console.log('prev',prev)
      // console.log('lineId',lineId)
      // console.log('next',next)
      if(next.id === id){
        prev[`studentSite${next.id}`] = undefined;
        return prev;
      }
        return prev;

    },{}));
//     let obj = [];
//     lineArr.map((item,index)=>{
//         if(index === ind){
//             console.log('item.',item)
//             // obj.push()
//           obj.push({...item,location_id: '', location_name:'',})
//         }else {
//           obj.push(item)
//         }
//       })
// console.log('    obj',obj)
//     this.setState({lineArr:obj},()=>{
//       console.log('    obj',this.state.lineArr)
//     })


  };

  onChangeGrate = (value) => {
    const { dispatch ,form} = this.props;
    const { school_id } = this.state;
    const obj = {
      school_id,
      grate: value,
    };
    dispatch({// 根据年级id请求对应的班级
      type: 'rule/getClassList',
      payload: obj,
    });
    this.setState({
      grate_id : value
    })
    form.setFieldsValue({
      className: '',
    });
  };

  onChangeClass = (value) => {
    this.setState({
      class_id: value,
    });
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const { lineArr, routeArr, siteArr ,studentId,class_id,imgBase64,student_code,file64} = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        // const file = values.headPhoto[0];
        // if(values.headPhoto.length === 0){
        //   message.error('请上传头像');
        //   return
        // }if(file.size>3*1024*1024){
        //   message.error('图片太大，请选择其他头像');
        //   return
        // }
        // if (!file.url && !file.preview) {
        //   /* eslint no-param-reassign:0 */
        //   file.preview = await getBase64(file.originFileObj);
        // }

        // const basic_route_list = routeArr.map((item, index) => {
        //   return { ...item, ...siteArr[index] };
        // });
        console.log(values)
        if (this.props.location.state) {// 修改
          const newArr = []
          for (let j=0;j< lineArr.length;j++){
            newArr.push({
              basic_route_id: lineArr[j].basic_route_id,
              location_id: lineArr[j].location_id,
            })
          }
          for(let index = 0;index < newArr.length; index++) {
            if(newArr[index].basic_route_id === undefined || newArr[index].location_id === '') {
              newArr.splice(index,1)
            }
          }
          const arr = Object.values(lineArr).map((i) => {
            if (values[`studentLine${i.id}`] === undefined && values[`studentSite${i.id}`] === undefined) {
              return;
            }if (`studentLine${i.id}`.length < 15) {
              return {
                basic_route_id: values[`studentLine${i.id}`],
                location_id: values[`studentSite${i.id}`],
              };
            }
          });
          for (let i = 0; i <= lineArr.length; i++) {
            const index = arr.indexOf(undefined);// 找存在underfind的下标
            if (index > -1) {// 大于0 代表存在，
              arr.splice(index, 1);// 存在就删除
            }
          }
          const finArr = arr.concat(newArr)// 合并数据
          for(let index = 0;index < finArr.length; index++) {// 过滤数据
            if(finArr[index].location_id === undefined || finArr[index].location_id === '') {
              finArr.splice(index,1)
            }
          }
          console.log('清除后finArr',finArr)




          const obj = {
            student_name: values.studentName,
            class_id,
            relation: values.studentRelationship,
            student_gender: values.studentSex,
            date_of_birth: moment(values.studentBirth).format('YYYY-MM-DD'),
            parent_mobile_number: values.studentPhone,
            parent_name: values.studentParentName,
            basic_route_list: finArr,
            address : values.studentAddress,
            id : studentId,
            // photo: file.preview ? file.preview : '',
            student_code,
            photo:file64
          };
          console.log('修改',obj)
          dispatch({
            type: 'rule/updateStuInfo',
            payload: obj,
          });
        } else {// 新增
          // 这个arr就是学校站点数组对象
          const arr = Object.values(lineArr).map((i) => {
            if (values[`studentLine${i.id}`] === undefined && values[`studentSite${i.id}`] === undefined) {
              return;
            }
              return {
                basic_route_id: values[`studentLine${i.id}`],
                location_id: values[`studentSite${i.id}`],
              };
          });
          for (let i = 0; i <= lineArr.length; i++) {
            const index = arr.indexOf(undefined);// 找存在underfind的下标
            if (index > -1) {// 大于0 代表存在，
              arr.splice(index, 1);// 存在就删除
            }
          }


          // const line = []
          // const site = []
          // for (const i = 1;i<3;i++){
          //   line.push({
          //     basic_route_id : values.studentLine+i
          //   })
          //   site.push({
          //     location_id : values.studentSite+i
          //   })
          // }
          // const basic_route_list = line.map((item,index) => {
          //   return {...item, ...site[index]};
          // });
          // for(let index = 0;index < basic_route_list.length; index++) {
          //   if(basic_route_list[index].basic_route_id === undefined || basic_route_list[index].basic_route_id === '') {
          //     basic_route_list.splice(index,1)
          //   }
          //   if(basic_route_list[index].location_id === undefined || basic_route_list[index].location_id === '') {
          //     basic_route_list.splice(index,1)
          //   }
          // }
          // console.log(basic_route_list)


          const obj = {
            student_name: values.studentName,
            class_id: values.className,
            relation: values.studentRelationship,
            student_gender: values.studentSex,
            date_of_birth: moment(values.studentBirth).format('YYYY-MM-DD'),
            parent_mobile_number: values.studentPhone,
            parent_name: values.studentParentName,
            basic_route_list: arr,
            address : values.studentAddress,
            photo:file64
            // photo: file.preview,
          };
          console.log('新增',obj)
          dispatch({
            type: 'rule/submitStuInfo',
            payload: obj,
          });
        }

      }
    });
  };



  normFile = e => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  handleCancel = () => this.setState({ previewVisible: false });


  handlePreview = async file => {
    if (!file.url && !file.preview) {
      /* eslint no-param-reassign:0 */
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  beforeUpload = () => {
    return false;
  };

  validatorHeadPhoto = async (rule, value) => {

    const state = this.props.location.state;
    if (state && state.item.photoUrl) {
      // console.log('有图片',state.item.photoUrl)
      return true
    }
      if(Array.isArray(value) && value.length>0){
        const file = value[0];
        if (!file.url && !file.preview) {
          /* eslint no-param-reassign:0 */
          file.preview = await getBase64(file.originFileObj);
        }
        if(file.preview.length>3*1024*1024){
          throw new Error('图片太大，请选择其他图片');
        }
      }else {
        throw new Error('请上传图片');
      }


  };


  addLine = () => {
    lineArrId += 1;
    const obj = { route_id: '', location_id: '', id: lineArrId };
    const { lineArr } = this.state;
    // if(lineArr.length > 1){
    //   message.warning('最多只能有两条路线站点')
    //   return
    // }
      const arr3 = [...lineArr, obj];
      this.setState({
        lineArr: arr3,
      });

  };

  delLine = ({ id }) => {
    const { lineArr } = this.state;
    const arr = lineArr.filter((item) => {
      return item.id !== id;
    });
    this.setState({
      lineArr: arr,
    });
  };

  cancelUpdate = () => {
    router.push({
      pathname: '/School/StudentInfo',
    });
  }

  getAvatarURL(item) {
    // const { currentUser } = this.props;
    // if (currentUser.avatar) {
    //   return currentUser.avatar;
    // }
    console.log(item)
    const url = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  changeFile = async(e) => {
    const file = e.target.files[0]
    console.log('源文件',file)
    const fileSize = file ? file.size/1024/1024 : 0
    if(fileSize > 3){
      message.error('图片太大，请您重新选择')
      return false
    }
      const file64 = await getBase64(file);
      // console.log('file64',file64)
      this.setState({
        avatarFile : file,
        file64,
        deg : '0',
        isShowBtn : 'block'
      })

  }

  transLeft = () => {
    const {deg} = this.state
    this.setState({
      deg : deg-90
    })
  }

  transRight = () => {
    const {deg} = this.state
    this.setState({
      deg : deg+90
    })
  }

  setEditorRef = editor => (this.editor = editor);

  onClickSave = () => {
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this.editor.getImage()
      // this.editor.getCroppingRect();
      // console.log('旋转前',canvas);
      // console.log(canvas.toDataURL('png',0.1))
      // console.log(canvas.toBlob((data)=>{
      //   console.log('blob-->',data);
      // },'png','0.1'))

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      const canvasScaled = this.editor.getImageScaledToCanvas()
      // console.log('旋转后',canvasScaled)
      // const file64before = canvasScaled.toDataURL()
      // console.log('blob前',file64before)

      canvasScaled.toBlob((data)=>{
          console.log('blob-->',data);
          return data
        },'png','0.4')
      // console.log(data)

      const file64 = canvasScaled.toDataURL('image*','0.4')
      console.log('blob后',file64)

      this.setState({
        file64
      })
      // console.log(canvasScaled)
    }
  }

  setEditorRef = (editor) => this.editor = editor

  render() {
    const { imageUrl, lineArr, loading, isDisabled,isRequest ,previewVisible, previewImage,title,avatarFile,deg,isShowBtn} = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
      submitting, companyList, schoolList, lineList, allSiteList, grateList, classList,siteList,currentUser
    } = this.props;
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
    const LineItem = lineArr.map((item,ind) => {
        const lineFieldName = `studentLine${item.id}`;
        const siteFieldName = `studentSite${item.id}`;
        // 站点下拉框的值
        const siteArr = allSiteList[getFieldValue(lineFieldName)];
        return (
          <div key={item.id}>
            {/* 学校路线表 */}
            <Form.Item {...formItemLayout} label={<FormattedMessage id="student.studentLine.label" />}>
              {getFieldDecorator(lineFieldName, {
                rules: [{ required: false, message: formatMessage({ id: 'student.studentLine.placeholder' }) }],
                initialValue: item.basic_route_name,
              })(
                <Select
                  placeholder={formatMessage({ id: 'student.studentLine.placeholder' })}
                  onChange={(lineId,index)=>this.onSiteLineChange(lineId,index,item.id)}
                  onFocus={this.focusLine}
                >
                  {
                    Array.isArray(lineList) ?
                    lineList.map(( lineList ) => {
                        return (
                          <Select.Option value={lineList.lineId} key={lineList.lineId}>{lineList.lineName}</Select.Option>
                        )
                      },
                    ):''
                  }
                </Select>,
              )},
            </Form.Item>
            {/* 站点 */}
            <Form.Item {...formItemLayout} label={<FormattedMessage id="student.studentSite.label" />}>
              {getFieldDecorator(siteFieldName, {
                rules: [{ required: false, message: formatMessage({ id: 'student.studentSite.placeholder' }) }],
                initialValue: item.location_name,
              })(
                <Select
                  placeholder={formatMessage({ id: 'student.studentSite.placeholder' })}
                  loading={siteArr == null}
                >
                  {
                    Array.isArray(siteArr) ? (
                      siteArr.map((item) =>
                        <Select.Option value={item.id} key={item.id}>{item.location_name}</Select.Option>)
                    ) : null
                  }
                </Select>,
              )}
            </Form.Item>
            <Button
              htmlType="button"
              style={{
                float: 'right',
                marginTop: -90,
                marginRight: 100,
              }}
              onClick={() => {
                this.delLine(item);
              }}
            >删除
            </Button>
          </div>
        );
      },
    );
    console.log("avatarFile",avatarFile)
    return (
      <PageHeaderWrapper
        title={title}
        // content={<FormattedMessage id="app.forms.basic.description" />}
      >
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>

            {/* http://zmage.caldis.me/imgSet/childsDream/demo.jpg */}
            <div>
              <span style={{width:'30%',float:"left",textAlign:'right'}}>头像 : </span>
              <div style={{width:'70%',float:"left"}}>

                {
                  avatarFile === '' ? <div></div> :(
                    <AvatarEditor
                      image={avatarFile ? avatarFile : 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'}
                      width={200}
                      height={180}
                      border={2}
                      color={[255, 255, 255, 0.8]} // RGBA
                      scale={0.9}
                      rotate={deg}
                      ref={this.setEditorRef}
                      // onLoadSuccess={(e,n)=>this.onLoadSuccess(e,n)}
                      // onMouseMove={(e,n)=>this.onMouseMove(e,n)}
                      style={{float:"left",}}
                    />
                  )
                }

                <input type="file" onChange={this.changeFile} />
                <div style={{display:isShowBtn}}>
                  <Button onClick={this.transLeft}>左转</Button>
                  <Button onClick={this.transRight}>右转</Button>
                  {/* <Icon type="redo" onClick={this.transLeft} /> */}
                  {/* <Icon type="undo" onClick={this.transRight} /> */}
                  <Button onClick={this.onClickSave}>确定</Button>
                </div>
              </div>
            </div>
            <div style={{clear:'both'}} />






            {/* 头像 */}
            {/* <Form.Item {...formItemLayout} label="头像">
              {getFieldDecorator('headPhoto', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                rules: [{ validator: this.validatorHeadPhoto ,required: true},],
              })(
                <Upload
                  accept="image/*"
                  listType="picture-card"
                  className="avatar-uploader"
                  beforeUpload={this.beforeUpload}
                  onPreview={this.handlePreview}
                  // onChange={this.handleChange}
                >
                  {Array.isArray(getFieldValue('headPhoto')) && getFieldValue('headPhoto').length > 0 ? null : (
                    <div>
                      <Icon type={loading ? 'loading' : 'plus'} />
                      <div className="ant-upload-text">Upload</div>
                    </div>)}

                </Upload>,
              )}
            </Form.Item> */}

            {/* 校车公司 */}
            <Form.Item {...formItemLayout} label={<FormattedMessage id="student.schoolbusCompany.label" />}>
              {getFieldDecorator('schoolbusCompany', {
                rules: [{ required: true, message: formatMessage({ id: 'student.schoolbusCompany.placeholder' }) }],
              })(
                <Select
                  placeholder={formatMessage({ id: 'student.schoolbusCompany.placeholder' })}
                  onChange={this.onChangeCompany}
                  disabled={isDisabled}
                >
                  {
                    companyList.map((companyList, key) =>
                      <Select.Option key={companyList.key}>{companyList.company_name} </Select.Option>)
                  }
                </Select>,
              )}
            </Form.Item>
            {/* 学校 */}
            <Form.Item {...formItemLayout} label={<FormattedMessage id="student.school.label" />}>
              {getFieldDecorator('school', {
                rules: [{ required: true, message: formatMessage({ id: 'student.school.placeholder' }) }],
              })(
                <Select
                  placeholder={<FormattedMessage id="student.school.placeholder" />}
                  onChange={this.onChangeSchool}
                  disabled={isDisabled}
                >
                  {
                    schoolList.map((schoolList, key) =>
                      <Select.Option key={schoolList.schoolId}>{schoolList.schoolName} </Select.Option>)
                  }
                </Select>,
              )}
            </Form.Item>
            {/* 年级 GrateList */}
            <Form.Item {...formItemLayout} label={<FormattedMessage id="student.grade.label" />}>
              {getFieldDecorator('grade', {
                rules: [{ required: true, message: formatMessage({ id: 'student.grade.placeholder' }) }],
              })(
                <Select placeholder={<FormattedMessage id="student.grade.placeholder" />} onChange={this.onChangeGrate} onFocus={this.focusGrate}>
                  {
                    grateList.map((grateList) => <Select.Option
                      key={grateList.grateId}
                      value={grateList.grateName}
                    >{grateList.grateName}
                                                 </Select.Option>)
                  }
                </Select>,
              )}
            </Form.Item>
            {/* 班级 */}
            <Form.Item {...formItemLayout} label={<FormattedMessage id="student.className.label" />}>
              {getFieldDecorator('className', {
                rules: [{ required: true, message: formatMessage({ id: 'student.className.placeholder' }) }],
              })(
                <Select placeholder={<FormattedMessage id="student.className.placeholder" />} onChange={this.onChangeClass} onFocus={this.focusClass}>
                  {
                    classList.map((classList, key) =>
                      <Select.Option key={classList.classId} value={classList.classId}>{classList.className}</Select.Option>)
                  }
                </Select>,
              )}
            </Form.Item>
            {/* 姓名 */}
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="student.studentName.label" />}
            >
              {getFieldDecorator('studentName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.name.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'student.studentName.placeholder' })} />)}
            </FormItem>
            {/* 性别 */}
            <Form.Item {...formItemLayout} label={<FormattedMessage id="student.studentSex.label" />}>
              {getFieldDecorator('studentSex', {
                rules: [{ required: true, message: formatMessage({ id: 'student.studentSex.placeholder' }) }],
              })(
                <Select placeholder={<FormattedMessage id="student.studentSex.placeholder" />}>
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>,
              )}
            </Form.Item>
            {/* 出生日期 */}
            <Form.Item {...formItemLayout} label={<FormattedMessage id="student.studentBirth.label" />}>
              {getFieldDecorator('studentBirth', {
                rules: [{ required: true, message: formatMessage({ id: 'student.studentBirth.placeholder' }) }],
              })(<DatePicker placeholder='请选择出生日期' style={{ width: '100%' }} />)}
            </Form.Item>
            {/* 家长姓名 */}
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="student.studentParentName.label" />}
            >
              {getFieldDecorator('studentParentName', {
                rules: [
                  {
                    required: isRequest,
                    message: formatMessage({ id: 'student.studentParentName.placeholder' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'student.studentParentName.placeholder' })} disabled={isDisabled} />)}
            </FormItem>
            {/* 家长手机号 */}
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="student.studentPhone.label" />}
            >
              {getFieldDecorator('studentPhone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'student.studentPhone.placeholder' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'student.studentPhone.placeholder' })} disabled={isDisabled} />)}
            </FormItem>
            {/* 和家长的关系 */}
            <Form.Item {...formItemLayout} label={<FormattedMessage id="student.studentRelationship.label" />}>
              {getFieldDecorator('studentRelationship', {
                rules: [{ required: isRequest, message: formatMessage({ id: 'student.studentRelationship.placeholder' }) }],
              })(
                <Select placeholder={<FormattedMessage id="student.studentRelationship.placeholder" />} disabled={isDisabled}>
                  <Option value="父亲">父亲</Option>
                  <Option value="母亲">母亲</Option>
                  <Option value="其他">其他</Option>
                </Select>,
              )}
            </Form.Item>

            {LineItem}
            <Button onClick={this.addLine}>添加路线/站点</Button>

            {/* 家庭地址 */}
            <FormItem {...formItemLayout} label={<FormattedMessage id="student.studentAddress.label" />}>
              {getFieldDecorator('studentAddress', {
                rules: [
                  {
                    required: false,
                    message: formatMessage({ id: 'student.studentAddress.placeholder' }),
                  },
                ],
              })(<TextArea
                style={{ minHeight: 32 }}
                placeholder={formatMessage({ id: 'student.studentAddress.placeholder' })}
                rows={4}
              />)}
            </FormItem>


            {/* 学校路线表1 */}
            {/* <Form.Item {...formItemLayout} label={<FormattedMessage id="student.studentLine.label" />}>
              {getFieldDecorator('studentLine1', {
                rules: [{ required: false, message: formatMessage({ id: 'student.studentLine.placeholder' }) }],
                initialValue: this.props.location.state?lineArr[0].basic_route_name:'',
              })(
                <Select placeholder={formatMessage({ id: 'student.studentLine.placeholder' })} onChange={this.onChangeLine1}>
                  {
                    Array.isArray(lineList) ?
                      lineList.map(( lineList ) => {
                          return (
                            <Select.Option value={lineList.lineId} key={lineList.lineId}>{lineList.lineName}</Select.Option>
                          )
                        },
                      ):''
                  }
                </Select>
              )},
            </Form.Item> */}
            {/* /!* 站点1 *!/ */}
            {/* <Form.Item {...formItemLayout} label={<FormattedMessage id="student.studentSite.label" />}>
              {getFieldDecorator('studentSite1', {
                rules: [{ required: false, message: formatMessage({ id: 'student.studentSite.placeholder' }) }],
                initialValue: this.props.location.state?lineArr[0].location_name:'',
              })(
                <Select placeholder={formatMessage({ id: 'student.studentSite.placeholder' })} onFocus={this.focusSite1}>
                  {
                    siteList.map((item) =><Select.Option key={item.siteId}>{item.siteName}</Select.Option>)
                  }
                </Select>
              )}
            </Form.Item> */}


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
    );
  }
}

export default Add;
