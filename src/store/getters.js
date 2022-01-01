const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  phoneNumber: state => state.user.phoneNumber,
  email: state => state.user.email,
  avatar: state => state.user.avatar,
  sex: state => state.user.sex,
  profile: state => state.user.profile,
  createTime: state => state.user.createTime,
  name: state => state.user.name,
  userName: state => state.user.userName,
  serverUrl: state => state.user.serverUrl,
  role: state => state.user.role,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
