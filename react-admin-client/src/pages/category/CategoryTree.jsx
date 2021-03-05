import React from 'react'
import { Tree, Input, message } from 'antd';
import { reqCategory } from '../../api';
import { getTreeData } from './process'

const { TreeNode } = Tree;
const { Search } = Input;
const dataList = []

export default class SearchTree extends React.Component {
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    treeData: [],
    dataList: [],
    loading: false,
  };
  componentDidMount() {
    // 获取树数据
    this.reqTreeData()
    // 获取列表数据
    this.getCategorys()
  }
  componentWillReceiveProps(props, a) {
    if (props.isUpdate) {
      // 获取树数据
      this.reqTreeData()
      // 获取列表数据
      this.getCategorys()
      props.isUpdate()
    }
  }
  generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title } = node;
      dataList.push({ key, title });
      if (node.children) {
        this.generateList(node.children);
      }
    }
  };
  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };
  reqTreeData = async () => {
    this.setState({ loading: true })
    const result = await reqCategory()
    this.setState({ loading: false })
    if (result.status === 0) {
      this.generateList(getTreeData(result.data))
      this.setState({ treeData: getTreeData(result.data) })
    } else {
      message.error('获取分类列表失败！')
    }
  }
  getCategorys = async (parentId, _id) => {
    //获取一级分类
    this.props.getTableData(undefined, true)
    this.setState({ loading: true })
    const result = await reqCategory(parentId, _id)
    this.setState({ loading: false })
    // console.log(getTreeData(result.data));
    if (result.status === 0) {
      this.props.getTableData(result.data, false)
    } else {
      message.error('获取分类列表失败！')
    }
  }
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  onChange = e => {
    const { treeData } = this.state
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return this.getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys: value === '' ? [] : expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };
  getSelectKeyParentIdOrId = (selectKey, data) => {
    if (!selectKey[0]) {
      this.getCategorys()
    }
    data.forEach(item => {
      if (selectKey[0] === item.key) {
        if (item.parentId === '0') {
          this.getCategorys(item.key)
        } else if (!item.parentId) {
          this.getCategorys()
        } else {
          this.getCategorys(null, item._id)
        }
        return
      }
      if (item.children) {
        this.getSelectKeyParentIdOrId(selectKey, item.children)
      }
    })
  }
  onSelect = (selectKey, e) => {
    this.getSelectKeyParentIdOrId(selectKey, this.state.treeData)
  }
  render() {
    const { searchValue, expandedKeys, autoExpandParent, treeData } = this.state;
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={title} />;
      });
    return (
      <div style={{ width: 200, padding: '20px 0px 24px 24px' }}>
        <Search style={{ marginBottom: 8 }} placeholder="请输入分类名称" onChange={this.onChange} />
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          defaultExpandedKeys={["category"]}
          onSelect={this.onSelect}
          autoExpandParent={autoExpandParent}
        >
          {loop(treeData)}
        </Tree>
      </div>
    );
  }
}