const Mock = require('mockjs')

const NameList = []
const count = 100
// ==========username search
for (let i = 0; i < count; i++) {
  NameList.push(Mock.mock({
    name: '@first'
  }))
}
// ==========transaction list
const List = []
for (let i = 1; i <= count; i++) {
  List.push(Mock.mock({
    order_no: '@csentence(5)',
    timestamp: +Mock.Random.date('T'),
    userType: '@integer(1, 2)',
    'label|1': ['招聘', '面试', '访友'],
    temp: '@float(35, 38, 1, 1)'
  }))
}
NameList.push({ name: 'mock-Pan' })

module.exports = [
  // username search
  {
    url: '/vue-element-admin/search/user',
    type: 'get',
    response: config => {
      const { name } = config.query
      const mockNameList = NameList.filter(item => {
        const lowerCaseName = item.name.toLowerCase()
        return !(name && lowerCaseName.indexOf(name.toLowerCase()) < 0)
      })
      return {
        code: 200,
        data: { items: mockNameList }
      }
    }
  },

  // transaction list
  {
    url: '/vue-element-admin/transaction/list',
    type: 'get',
    response: _ => {
      const { importance, type, title, page = 1, limit = 20, sort } = _.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
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
  }
]
