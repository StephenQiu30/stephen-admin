export default [
  { path: '/', redirect: '/admin/user' },
  {
    name: '用户管理',
    path: '/admin/user',
    component: './Admin/UserList',
    icon: 'UserOutlined',
    access: 'canAdmin',
  },
  {
    name: '帖子管理',
    path: '/admin/post',
    component: './Admin/PostList',
    icon: 'TableOutlined',
    access: 'canAdmin',
  },
  {
    name: '评论管理',
    path: '/admin/comment',
    component: './Admin/CommentList',
    icon: 'MessageOutlined',
    access: 'canAdmin',
  },
  {
    name: '通知管理',
    path: '/admin/notification',
    component: './Admin/NotificationList',
    icon: 'NotificationOutlined',
    access: 'canAdmin',
  },

  {
    name: '日志管理',
    path: '/admin/log',
    icon: 'HistoryOutlined',
    access: 'canAdmin',
    routes: [
      {
        name: '文件日志',
        path: '/admin/log/file',
        component: './Admin/File/Log',
      },
      {
        name: 'API 访问日志',
        path: '/admin/log/api',
        component: './Admin/Log/ApiAccessLog',
      },
      {
        name: '操作日志',
        path: '/admin/log/operation',
        component: './Admin/Log/OperationLog',
      },
      {
        name: '登录日志',
        path: '/admin/log/login',
        component: './Admin/Log/UserLoginLog',
      },
    ],
  },

  {
    path: '/user',
    layout: false,
    routes: [{ name: '用户登录', path: '/user/login', component: './User/Login' }],
  },
  {
    name: 'exception',
    icon: 'warning',
    path: '/exception',
    layout: false,
    routes: [
      {
        path: '/exception',
        redirect: '/exception/403',
      },
      {
        name: '403',
        icon: 'smile',
        path: '/exception/403',
        component: './Exception/403',
      },
      {
        name: '404',
        icon: 'smile',
        path: '/exception/404',
        component: './Exception/404',
      },
      {
        name: '500',
        icon: 'smile',
        path: '/exception/500',
        component: './Exception/500',
      },
    ],
  },
  { path: '*', layout: false, component: './Exception/404' },
];
