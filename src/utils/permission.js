import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const role = store.getters && store.getters.role
    const permissionRoles = value

    const hasPermission = role.some(role => {
      return permissionRoles.includes(role)
    })
    return hasPermission
  } else {
    console.error(`need role! Like v-permission="['admin','editor']"`)
    return false
  }
}
