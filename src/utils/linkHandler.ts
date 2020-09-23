import globalNavigation from '~/utils/globalNavigation'
import { Linking } from 'react-native'
import qs from 'qs'

export default function linkHandler(link: string) {
  const regex = /^https:\/\/zh\.moegirl\.org\.cn\//
  if (regex.test(link)) {
    const [pageName, anchor] = link.replace(regex, '').split('#')

    if (!/^index\.php\?/.test(pageName)) {
      globalNavigation.current.push('article', { pageName, anchor })
    } else {
      const params: any = qs.parse(pageName.replace(/^index\.php\?/, ''))

      if (params.action === 'edit') {
        globalNavigation.current.push('edit', { 
          title: params.title,
          newSection: params.section === 'new',
          section: params.section
        })
      } else {
        Linking.openURL(link)
      }
    }
  } else {
    Linking.openURL(link)
  }
}