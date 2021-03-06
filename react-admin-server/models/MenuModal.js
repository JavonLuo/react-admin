/*
能操作categorys集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const menuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  key: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String },
  children: { type: Array, default: []}
})

// 3. 定义Model(与集合对应, 可以操作集合)
const MenuModel = mongoose.model('menus', menuSchema)

// 4. 向外暴露Model
module.exports = MenuModel