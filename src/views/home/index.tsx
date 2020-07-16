import { useObserver } from 'mobx-react-lite'
import React, { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import ArticleView from '~/components/articleView'
import MyStatusBar from '~/components/MyStatusBar'
import MyToolbar from '~/components/MyToolbar'
import ViewContainer from '~/components/ViewContainer'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import store from '~/mobx'
import { drawerController } from '../drawer'

export interface Props {
  
}

export interface RouteParams {
  id: string
}

const siteNameMaps = {
  moegirl: '萌娘百科',
  hmoe: 'H萌娘'
}

function HomePage(props: PropsWithChildren<Props>) {
  const navigation = useTypedNavigation()

  const siteName = siteNameMaps[store.settings.source]
  return useObserver(() => 
    <ViewContainer>
      <MyStatusBar />
      <MyToolbar 
        badge={store.user.waitNotificationTotal !== 0}
        title={siteName}
        leftIcon="menu"
        rightIcon="search"
        onPressLeftIcon={() => drawerController.open()}
        onPressRightIcon={() => navigation.push('search')}
      />

      <ArticleView
        style={{ flex: 1 }}
        pageName="Mainpage"
        styles={[
          'article', 'home',
          ...(store.settings.theme === 'night' ? ['nightMode'] as any : []),
          ...(store.settings.source === 'hmoe' ? ['hmoeHome'] as any : [])
        ]}
      />
    </ViewContainer>
  )
}

export default HomePage

const styles = StyleSheet.create({
  
})