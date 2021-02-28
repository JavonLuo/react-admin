// 富文本编辑器
import React, { Component } from 'react'
import { EditorState, convertToRaw,ContentState } from 'draft-js'
import PropTypes from 'prop-types'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './index.less'


export default class RichTextEditor extends Component {
    static propTypes = {
    detail:PropTypes.string
    }
    constructor(props) {
        super(props)
        const html = this.props.detail
        if(html){ //if html有值，根据html字符串格式创建一个对应的编辑对象
            const contentBlock = htmlToDraft(html)
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              const editorState = EditorState.createWithContent(contentState)
              this.state = {
                editorState,
              }
            }

        }
      }



    state = {
        editorState: EditorState.createEmpty(),//创建没有内容的编辑器对象
    }
    // 富文本编辑器上传本地图片
    uploadImageCallBack = (file)=>{
        return new Promise(
            (resolve, reject) => {
              const xhr = new XMLHttpRequest()
              xhr.open('POST', '/admin/manage/img/upload')
              const data = new FormData()
              data.append('image', file)
              xhr.send(data)
              xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText)
                let url = response.data.url
                resolve({data: {link: url}})
              })
              xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText)
                reject(error)
              });
            }
          );
    }

    onEditorStateChange = (editorState) => {
        this.setState({
        editorState,
        })
    }
    //   获取改变的html文本字符串 传递给父组件
    getDetail = ()=>{
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }
    render() {
    const { editorState } = this.state
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="editor-wrapper"
          editorClassName="editor"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
            }}
        />
      </div>
    )
  }
}