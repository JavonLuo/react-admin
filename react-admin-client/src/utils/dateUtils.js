// 时间格式化函数

export function formateDate(time,isRoleDate) {
    if (!time) return ''
    let date = new Date(time)
    var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    let  index = date.getDay()
    if(isRoleDate){
     return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    }else{
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()+'   '+weekday[index]
    }
  }