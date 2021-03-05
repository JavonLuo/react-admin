import _ from 'lodash'
export const getTreeData = (data = []) => {
  const copyData = _.cloneDeep(data)
  const treeData = [{
    title: '商品分类',
    key: 'category',
    children: []
  }]
  const firstCategory =  copyData.filter(item => item.parentId === '0')
  const secondCategory =  copyData.filter(item => item.parentId !== '0')
  firstCategory.forEach((item) => {
    item.children = []
    item.title = item.name
    item.key = item._id
    secondCategory.forEach(v => {
      v.title = v.name
      v.key = v._id
      if (v.parentId === item._id) {
        item.children.push(v)
      }
    })
  })
  treeData[0].children = firstCategory
  return treeData
}