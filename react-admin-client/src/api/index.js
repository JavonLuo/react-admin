// 包含应用中所有的接口请求函数
import ajax from './ajax'

// 登录
export const reqLogin = (username, password) => ajax('/admin/login', { username, password }, 'POST')

// 获取分类列表
export const reqCategory = (parentId) => ajax('/admin/manage/category/list', { parentId })
// 添加分类
export const reqAddCategory = (parentId, categoryName) => ajax('/admin/manage/category/add', { parentId, categoryName }, 'POST')
// 删除分类
export const reqDelCategory = (_id) => ajax('/admin/manage/category/delete', { _id }, 'POST')
// 修改分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax('/admin/manage/category/update', { categoryId, categoryName }, 'POST')
// 获取商品列表
export const reqProducts = (pageNum, pageSize) => ajax('/admin/manage/product/list', { pageNum, pageSize })
// 删除商品
export const reqDelProduct = (_id) => ajax('/admin/manage/product/delete', { _id }, 'POST')
// 搜索商品分页列表
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax('/admin/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
})
// 根据分类ID获取分类名称
export const reqCategoryById = (categoryId) => ajax('/admin/manage/category/info', { categoryId })
// 更改商品状态（上架/下架）
export const reqProductStatus = (productId, status) => ajax('/admin/manage/product/updateStatus', { productId, status }, 'POST')
// 删除以上传的图片
export const reqDeleteImg = (name) => ajax('/admin/manage/img/delete', { name }, 'POST')
// 更新/修改商品
export const reqAddOrUpdateProduct = (product) => ajax('/admin/manage/product/' + (product._id ? 'update' : 'add'), product, "POST")
// 获取所有角色列表
export const reqRoles = () => ajax('/admin/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax('/admin/manage/role/add', { roleName }, "POST")
// 更新角色信息
export const reqUpdate = (role) => ajax('/admin/manage/role/update', role, 'POST')
// 获取所有用户信息 
export const reqUsers = () => ajax('/admin/manage/user/list')
// 创建/修改用户
export const reqAddOrUpdateUser = (user) => ajax('/admin/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')
// 删除用户
export const reqDeleteUser = (userId) => ajax('/admin/manage/user/delete', { userId }, 'POST')