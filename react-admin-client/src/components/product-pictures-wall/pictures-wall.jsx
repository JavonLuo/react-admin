import React from 'react'
import { Upload, Icon, Modal,message } from 'antd';
import {reqDeleteImg} from '../../api'
import PropTypes from 'prop-types'
import {BASE_IMG_URL} from '../../utils/constants'
function getBase64(file) {  // 转化为base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  static propTypes = {
    imgs:PropTypes.array
  }
  constructor(props){
    super(props)
    let fileList = []
    // 如果传入了imgs属性
    const {imgs} = this.props
    if(imgs && imgs.length>0){
      fileList = imgs.map((img,index)=>({
        uid:-index,
        name:img,
        status:'done', //图片已经是上传状态 用done
        url:BASE_IMG_URL + img
      }))
    }
    // 初始化状态
    this.state = {
        previewVisible: false, // 控制大图显示
        previewImage: '',
        fileList //所有已经上传图片的数组
    }
  }


  state = {
    fileList: [],  // 图片file信息列表 
  }
  // 获取所有已经上传图片文件名的数组
  getImgs = ()=>{
    return this.state.fileList.map(item=>item.name)
  }
//   控制大图显示
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
    });
};

handleChange = async({ file,fileList }) => {
    // 监听上传状态 status为done表示上传成功
    if(file.status === 'done'){
      const result = file.response
      if(result.status === 0){
        message.success('图片上传成功！')
        const {name,url} = result.data
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url
      }else{
        message.error('图片上传失败！')
      }
    }else if(file.status === 'removed'){
       const result = await reqDeleteImg(file.name)
       if(result.status===0){
         message.success('图片删除成功！')
       }else{
         message.error('图片删除失败！')
       }
    }

    // 在操作（上传/删除）的过程中更新filelist的状态
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/admin/manage/img/upload" //上传地址
          accept="image/*" //支持上传的文件类型为所有图片格式
          listType="picture-card" //图片显示的样式
          fileList={fileList}
          name='image' //上传到后台的参数名称
          onPreview={this.handlePreview} //打开预览图
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
