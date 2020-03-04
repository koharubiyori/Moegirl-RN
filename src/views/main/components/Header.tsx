import React, { PropsWithChildren, FC } from 'react'
import { withNavigation } from 'react-navigation'
import StatusBar from '~/components/StatusBar'
import Toolbar from '~/components/Toolbar'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'

export interface Props {
  title: string
}

type FinalProps = Props & UserConnectedProps & __Navigation.InjectedNavigation

function IndexHeader(props: PropsWithChildren<FinalProps>) {
  
  return (
    <>
      <StatusBar />
      <Toolbar 
        badge={props.state.user.waitNotificationsTotal !== 0}
        title={props.title}
        leftIcon="menu"
        rightIcon="search"
        onPressLeftIcon={() => $drawer.open()}
        onPressRightIcon={() => props.navigation.push('search')}
      />
    </>
  )
}

export default userHOC(withNavigation(IndexHeader)) as FC<Props>