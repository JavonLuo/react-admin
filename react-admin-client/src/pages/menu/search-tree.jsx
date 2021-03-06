import React from 'react'
import { Tree, Input, message } from 'antd';
import { reqMenu } from '../../api';
import { getTreeData } from './process.js'
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
    this.getTableData()
  }
  componentWillReceiveProps(props, a) {
    if (props.isUpdate) {
      // 获取树数据
      this.reqTreeData()
      // 获取列表数据
      this.getTableData()
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
    const result = await reqMenu()
    this.setState({ loading: false })
    if (result.status === 0) {
      this.generateList(result.data)
      this.setState({ treeData: getTreeData(result.data) })
    } else {
      message.error('获取菜单列表失败！')
    }
  }
  getTableData = async (_id) => {
    this.props.getTableData(undefined, true)
    this.setState({ loading: true })
    const result = await reqMenu(_id)
    this.setState({ loading: false })
    if (result.status === 0) {
      result.data.forEach(item => {
        delete item.children
      })
      this.props.getTableData(result.data, false, _id)
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

  onSelect = (selectKeys) => {
    if (selectKeys[0] && selectKeys[0].startsWith('/')) return
    this.getTableData(selectKeys[0])
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
        <Search style={{ marginBottom: 8 }} placeholder="请输入菜单名称" onChange={this.onChange} />
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