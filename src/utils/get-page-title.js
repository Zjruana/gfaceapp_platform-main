import defaultSettings from '@/settings'

const title = defaultSettings.title || 'G-Face Platform'

export default function getPageTitle(key) {
  if (key) {
    return `${key} - ${title}`
  }
  return `${title}`
}
