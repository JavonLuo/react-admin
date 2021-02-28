import React, { Component } from 'react'
import {Card,List,Icon, Button,} from 'antd'
import {reqCategoryById} from '../../api'
import {BASE_IMG_URL} from '../../utils/constants'
import './detail.less'
export default class ProductDetail extends Component {
    state = {
        categoryName1:'',
        categoryName2:''
    }
   async componentDidMount(){
        let {categoryId,pCategoryId} = this.props.location.state.pruduct
        // console.log(categoryId,pCategoryId);
        // 如果父Id等于0 说明是一级分类下的商品 否则是二级分类下的商品
        if(pCategoryId==='0'){
           const result = await reqCategoryById(categoryId)
        //    console.log(result);
           let categoryName1 = result.data.name
           this.setState({categoryName1})
        }else{
            // Promise对象的静态方法
            const results = await Promise.all([reqCategoryById(pCategoryId),reqCategoryById(categoryId)])
            // console.log(result);
            let categoryName1 = results[0].data.name
            let categoryName2 = results[1].data.name
            this.setState({categoryName1,categoryName2})
        }
    }
    render() {
        // ,imgs,categoryId,pCategoryId,status
        let {name,desc,price,detail,imgs} = this.props.location.state.pruduct
        let {categoryName1,categoryName2} = this.state
        const title = (
            <span style={{fontSize:20}}>
            <Button type='link' 
            style={{fontSize:20}}
            onClick={()=>{
                this.props.history.go(-1)
            }}
            >
            <Icon type="left-circle" />
            </Button>
            商品详情
            </span>
        )
        return (
            <Card title={title}>
                <List className='product-detail'
                >
                    <List.Item>
                    <div className="detail-info">
                        <span className='detail-title'>商品名称：</span>
                    </div>
                        <span>{name}</span>
                    </List.Item>
                    <List.Item>
                    <div className="detail-info">
                        <span className='detail-title'>商品描述：</span>
                    </div>
                        <span>{desc}</span>
                    </List.Item>
                    <List.Item>
                    <div className="detail-info">
                        <span className='detail-title'>商品价格：</span>
                    </div>
                        <span>{price}</span>
                    </List.Item><List.Item>
                    <div className="detail-info">
                        <span className='detail-title'>所属分类：</span>
                    </div>
                        <span>
                        {categoryName1}
                        {categoryName2?('-->'+categoryName2):''}
                        </span>
                    </List.Item><List.Item>
                    <div className="detail-info">
                        <span className='detail-title'>商品图片：</span>
                    </div>
                        {
                            imgs.map(item=><img src={BASE_IMG_URL+item} alt="detail"/>)
                        }
                    </List.Item><List.Item>
                    <div className="detail-info">
                        <span className='detail-title'>商品详情：</span>
                    </div>
                        <span
                        dangerouslySetInnerHTML = {{ __html: detail }}
                        ></span>
                    </List.Item>
                </List>
            </Card>
        )
    }
}
