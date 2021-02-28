import React, { Component } from 'react'
import {Card,Select,Input,Button,Icon,Table,message } from 'antd'
import {reqProducts,reqSearchProducts,reqProductStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
const {Option} = Select
export default class ProductHome extends Component {
    state = {
        total:0,
        products:[],
        searchName:'',
        searchType:'productName',
        loading:false
    }
    initColumns = ()=>{
        this.columns = [
            {
              title: '商品名称',
              width:200,
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              width:100,
              dataIndex: 'price',
              render:(price)=>'￥' + price
            },
            {
              title: '状态',
              width:100,
              render:(product)=>{
                  const {_id,status} = product
                //   status == 1代表未上架 ==2 代表已上架
                 return (
                 <span>
                    <Button 
                    type='primary'
                    onClick={this.updateStatus.bind(null,_id,status===1?2:1)}
                    >
                    {status===1?'上架':'下架'}
                    </Button>
                    <span style={{margin:'10px 0px',width:60,display:'inline-block',textAlign:'center'}}>
                    {status===1?'未上架':'在售'}
                    </span>
                  </span>)
              }
            },
            {
              title: '操作',
              width:100,
              render:(pruduct)=>{
                  return(
                      <span>
                          <Button type='link' 
                          onClick={()=>this.props.history.push('/product/addupdate',pruduct)}
                          >修改</Button>
                          <Button type='link' 
                          onClick={()=>{
                            this.props.history.push('/product/detail',{pruduct})
                          }}
                          >详情</Button>
                      </span>
                  )
              }
            }
        ]
    }
    // 获取商品列表
    getProducts = async(pageNum)=>{
        // 保存商品页码 让其他方法能够看得见
        this.pageNum = pageNum
        let {searchName,searchType} = this.state
        let result
        // 是否在加载中
        this.setState({loading:true})
        if(searchName){
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
            // console.log(result);
        }else{
            result = await reqProducts(pageNum,PAGE_SIZE)
        }
        this.setState({loading:false})
       if(result.status === 0){
           let {total,list} = result.data
        this.setState({total,products:list})
       }
    }
    // 更改商品状态
    updateStatus = async(_id,status)=>{
        const result = await reqProductStatus(_id,status)
        if(result.status === 0){
            // 更新商品列表页面
            message.success('更新商品状态成功！')
            this.getProducts(this.pageNum)
        }else{
            message.error('更新商品状态失败！')
        }
    }
    componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getProducts(1)
        // this.state
    }
    render() {
        let {products,total,searchType,loading} = this.state 
        const title = (
            <span>
                <Select value={searchType}
                onChange={value=>this.setState({searchType:value})}
                 style={{width:150}}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字'
                 onChange={e=>this.setState({searchName:e.target.value})}
                 style={{width:200,margin:'0 15px'}}></Input>
                <Button 
                type='primary'
                onClick={this.getProducts.bind(null,1)}
                >搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' 
            onClick={()=>{this.props.history.push('/product/addupdate')}}
            >
                <Icon type='plus'></Icon>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
            <Table 
            bordered
            dataSource={products}
            loading={loading}
            pagination = {{showQuickJumper:true,
            total,
            defaultPageSize:PAGE_SIZE,
            onChange:this.getProducts
            }}
            rowKey='_id' 
            columns={this.columns} />
            </Card>
        )
    }
}
