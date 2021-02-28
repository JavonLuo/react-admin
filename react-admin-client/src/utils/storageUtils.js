import store from 'store'
let UER_KEY = 'user_key'
export default {
    // 删除本地存储
    saveUser(user){
        store.set(UER_KEY,user)
    },
    // 读取本地存储
    getUser(){
        return store.get(UER_KEY) || {}
    },
    // 删除本地存储
    removeUser(){
        store.remove(UER_KEY)
    }


}


