const defaultMenus = [
  {
    title: '首页', // 菜单标题名称
    key: '/home', // 对应的path
    url: '/home',
    icon: 'home', // 图标名称
    isPublic: true, // 公开的
  },
  {
    title: '菜单管理', // 菜单标题名称
    key: '/menu', // 对应的path
    url: '/menu',
    icon: 'menu', // 图标名称
  },
  {
    title: '商品管理',
    key: '/products',
    url: '/products',
    icon: 'appstore',
    children: [ // 子菜单列表
      {
        title: '分类管理',
        key: '/category',
        url: '/category',
        icon: 'bars'
      },
      {
        title: '商品信息',
        key: '/product',
        url: '/product',
        icon: 'tool'
      },
    ]
  },
  {
    title: '权限管理',
    key: '/roles',
    url: '/roles',
    icon: 'team',
    children: [ // 子菜单列表
      {
        title: '角色管理',
        key: '/role',
        url: '/role',
        icon: 'safety',
      },
      {
        title: '角色授权',
        key: '/auth',
        url: '/auth',
        icon: 'apartment'
      },
    ]
  },
  {
    title: '用户管理',
    key: '/user',
    url: '/user',
    icon: 'user'
  },
  {
    title: '图形图表',
    key: '/charts',
    url: '/charts',
    icon: 'area-chart',
    children: [
      {
        title: '柱形图',
        key: '/charts/bar',
        url: '/charts/bar',
        icon: 'bar-chart'
      },
      {
        title: '折线图',
        key: '/charts/line',
        url: '/charts/line',
        icon: 'line-chart'
      },
      {
        title: '饼图',
        key: '/charts/pie',
        url: '/charts/pie',
        icon: 'pie-chart'
      },
    ]
  },

  {
    title: '订单管理',
    key: '/order',
    url: '/order',
    icon: 'windows',
  },
]
module.exports = defaultMenus