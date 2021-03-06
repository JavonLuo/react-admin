import _ from 'lodash'
export const getTreeData = (data = []) => {
  const copyData = _.cloneDeep(data)
  copyData.forEach(v => {
    v.key = v._id
  })
  return copyData
}