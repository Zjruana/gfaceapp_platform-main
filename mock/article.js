const Mock = require('mockjs')

const List = []
const EmployeeList = []
const VisitorList = []
const DeviceList = []
const BasicList = []
const count = 100

const picUrl = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'
const userImg = ['https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg']

for (let i = 1; i <= count; i++) {
  List.push(Mock.mock({
    id: (i),
    timestamp: +Mock.Random.date('T'),
    name: '@cname',
    idcard: '@string("number", 20)',
    openType: '@integer(1, 2)',
    temp: '@float(35, 38, 1, 1)',
    userType: '@integer(1, 2)',
    guokangCode: '@integer(0, 3)',
    reasonVisit: '@integer(1, 3)',
    remark: '@ctitle(3, 5)',
    picUrl
  }))
}

for (let i = 1; i <= count / 2; i++) {
  EmployeeList.push(Mock.mock({
    id: (i),
    mobilePhone: /^1[0-9]{10}$/,
    name: '@cname',
    cardId: '@string("number", 20)',
    'sex|1': [1, 2],
    expireTime: +Mock.Random.date('T'),
    createTime: +Mock.Random.date('T'),
    remark: '@ctitle(3, 5)',
    'userImg|1': userImg
  }))
}

for (let i = 1; i <= count / 2; i++) {
  VisitorList.push(Mock.mock({
    id: (i),
    mobilePhone: /^1[0-9]{10}$/,
    name: '@cname',
    cardId: '@string("number", 20)',
    temp: '@float(35, 38, 1, 1)',
    interviewerName: '@cname',
    'reasonVisit|1': ['面试', '访友', '购物'],
    visitTime: +Mock.Random.date('T'),
    leaveTime: +Mock.Random.date('T'),
    leaveStatus: '@integer(1, 2)',
    status: '@integer(1, 2)',
    remark: '@ctitle(3, 5)',
    'deviceLocation|1': ['位置一', '位置二', '位置三']
  }))
}

for (let i = 1; i <= count / 2; i++) {
  DeviceList.push(Mock.mock({
    id: (i),
    deviceId: '@guid',
    deviceName: '@hex',
    cardId: '@string("number", 20)',
    vendors: '@name',
    deviceType: '@integer(1, 2)',
    location: '@county',
    createTime: +Mock.Random.date('T'),
    status: '@integer(1, 2)',
    remark: '@ctitle(3, 5)'
  }))
}
for (let i = 1; i <= 4; i++) {
  BasicList.push(Mock.mock({
    id: '@hex',
    title: '@title(2, 3)',
    timestamp: +Mock.Random.date('T'),
    tag: '@integer(0, 4)',
    status: '@integer(1, 2)'
  }))
}

module.exports = [
  {
    url: '/user/record/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/user/employee/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20, sort } = config.query

      let mockList = EmployeeList.filter(item => {
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/user/visitor/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20, sort } = config.query

      let mockList = VisitorList.filter(item => {
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/device/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20, sort } = config.query

      let mockList = DeviceList.filter(item => {
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/basic/list',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data: BasicList
      }
    }
  },

  {
    url: '/vue-element-admin/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 200,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]

