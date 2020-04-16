import React, { Component } from 'react';
// import './App.css';

// 这个就是头像插件
import ReactAvatarEditor from 'react-avatar-editor';
//使用axios发给后端做一下测试
import axios from 'axios'



class App extends Component {

  state = {
    range: 12,
    imageOrigin: "",
    imageResult: "",
    readerOrigin: new FileReader()
  }

  // 组件自带的获取结果事件
  onClickSave = () => {
    //获取 base64url格式结果
    const canvas = this.editor.getImage().toDataURL();
    //可以将这段base64url 字符串传给后端

    //显示结果 blob 对象
    fetch(canvas)
      .then(res => res.blob())
      .then(blob => {
        this.img = window.URL.createObjectURL(blob)
        this.setState({ imageResult: this.img })
      })
  }

  // 从本机获取图片
  changeFile(e) {
    var file = e.target.files[0];
    this.state.readerOrigin.readAsDataURL(file);
    this.state.readerOrigin.onload = (e) => {
      this.setState({
        imageOrigin: e.target.result,
      });
    }
  }

  //图片上传到服务器
  onUpload() {
    //可以将这段base64url 字符串传给后端
    const canvas = this.editor.getImage().toDataURL();
    let params = new URLSearchParams();
    params.append('avatar', canvas);
    axios({
      method:"post",
      url:"http://localhost:12306/",
      data:params
    }).then(res=>{
      //alert('上传成功')
    }).catch(err=>{
      //alert('图片过大, 请使用小图片')
    })
  }


  render() {
    return (
      <div className="App">
        //输入头像位置
        <input type="file" onChange={(e) => { this.changeFile(e) }} />

        //组件位置
        <ReactAvatarEditor
          ref={(node) => {
            this.editor = node;
          }}
          image={this.state.imageOrigin}
          width={200}
          height={200}
          border={50}
          borderRadius={125}
          color={[255, 255, 255, 0.6]} // RGBA
          //图片被放大的比例 (高度)
          scale={1 + this.state.range / 100}
          rotate={0}
          onMouseMove={(e) => {
          this.onClickSave()
        }}
        >

        </ReactAvatarEditor>
        <input type="range" onChange={(e) => {
          this.onClickSave()
          this.setState({ range: e.target.value })
        }} />
        <button onClick={
          () => this.onClickSave()
        }>查看头像
        </button>
        <button onClick={
          () => this.onUpload()
        }>确认上传
        </button>


        //图片查看区域
        <div style={{ width: "200px", height: "200px", border: "1px solid black" }}>
          <img style={{ width: "100%", height: "100%" }} src={this.state.imageResult} alt="" />
        </div>

      </div>
    );
  }
}

export default App;
