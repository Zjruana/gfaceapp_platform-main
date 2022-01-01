import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/record',
    component: Layout,
    redirect: 'record',
    alwaysShow: true, // will always show the root menu
    name: 'Record',
    meta: {
      title: '通行记录',
      icon: 'user'
    },
    children: [
      {
        path: 'record',
        component: () => import('@/views/record/record'),
        name: 'RecordRecord',
        meta: { title: '员工记录' }
      // },
      // {
      //   path: 'vis-record',
      //   component: () => import('@/views/record/vis-record'),
      //   name: 'VisRecordRecord',
      //   meta: { title: '访客记录' }
      },
      {
        path: 'blacklist-record',
        component: () => import('@/views/record/blacklist-record'),
        name: 'BlacklistRecordRecord',
        meta: { title: '黑名单记录' }
      },
      {
        path: 'stranger-record',
        component: () => import('@/views/record/stranger-record'),
        name: 'StrangerRecordRecord',
        meta: { title: '陌生人记录' }
      }
    ]
  },
  {
    path: '/personnel',
    component: Layout,
    redirect: '/personnel/employee',
    alwaysShow: true, // will always show the root menu
    name: 'Personnel',
    meta: {
      title: '人员管理',
      icon: 'peoples'
    },
    children: [
      {
        path: 'employee',
        component: () => import('@/views/personnel/employee'),
        name: 'PersonnelEmployee',
        meta: {
          title: '员工管理'
        }
      // },
      // {
      //   path: 'visitor',
      //   component: () => import('@/views/personnel/visitor'),
      //   name: 'PersonnelVisitor',
      //   meta: {
      //     title: '访客管理'
      //   }
      },
      {
        path: 'blacklist',
        component: () => import('@/views/personnel/blacklist'),
        name: 'PersonnelBlacklist',
        meta: {
          title: '黑名单管理'
        }
      }
    ]
  },
  // {
  //   path: '/attendance',
  //   component: Layout,
  //   redirect: 'attendance',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Attendance',
  //   meta: {
  //     title: 'Attendance',
  //     icon: 'el-icon-s-claim'
  //   },
  //   children: [
  //     {
  //       path: 'attendanceMonth',
  //       component: () => import('@/views/attendance/attendanceMonth'),
  //       name: 'AttendanceMonth',
  //       meta: { title: 'AttendanceMonth' }
  //     },
  //     {
  //       path: 'attendance',
  //       component: () => import('@/views/attendance/attendance'),
  //       name: 'Attendance',
  //       meta: { title: 'AttendanceLog' }
  //     },
  //     {
  //       path: 'attendanceConfig',
  //       component: () => import('@/views/attendance/attendanceConfig'),
  //       name: 'AttendanceConfig',
  //       meta: { title: 'AttendanceConfig' }
  //     }
  //   ]
  // },
  {
    path: '/device',
    component: Layout,
    redirect: 'device',
    alwaysShow: true, // will always show the root menu
    name: 'Device',
    meta: {
      title: '设备管理',
      icon: 'tree-table'
    },
    children: [
      {
        path: 'doordevice',
        component: () => import('@/views/device/doordevice'),
        name: 'DeviceDoorDevice',
        meta: { title: '门禁设备' }
      // },
      // {
      //   path: 'device',
      //   component: () => import('@/views/device/device'),
      //   name: 'DeviceDevice',
      //   meta: { title: '访客设备' }
      }
    ]
  },
  {
    path: '/group',
    component: Layout,
    meta: {
      title: '组织管理',
      icon: 'el-icon-menu'
    },
    children: [
      {
        path: 'group',
        component: () => import('@/views/group/index'),
        name: 'Group',
        meta: { title: '门禁设备组' }
      // },
      // {
      //   path: 'visitor',
      //   component: () => import('@/views/group/visitor'),
      //   name: 'GroupVisitor',
      //   meta: {
      //     title: '访客设备组'
      //   }
      }
    ]
  }
  // {
  //   path: '/basic',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'basic',
  //       component: () => import('@/views/basic/index'),
  //       name: 'Basic',
  //       meta: { title: 'Basic', icon: 'tab' }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/
  {
    path: '/customer',
    component: Layout,
    meta: {
      roles: ['admin', 'super-user']
    },
    children: [
      {
        path: 'customer',
        component: () => import('@/views/customer/customer-manage'),
        name: 'Customer',
        meta: { title: '客户管理', icon: 'el-icon-user' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
