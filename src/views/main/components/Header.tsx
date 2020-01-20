import React, { PropsWithChildren, FC } from 'react'
import { withNavigation } from 'react-navigation'
import StatusBar from '~/components/StatusBar'
import Toolbar from '~/components/Toolbar'

export interface Props {
  title: string
}

type FinalProps = Props & __Navigation.InjectedNavigation

function IndexHeader(props: PropsWithChildren<FinalProps>) {
  
  return (
    <>
      <StatusBar />
      <Toolbar
        title={props.title}
        leftIcon="menu"
        rightIcon="search"
        onPressLeftIcon={() => $drawer.open()}
        onPressRightIcon={() => props.navigation.push('search')}
      />
    </>
  )
}

export default withNavigation(IndexHeader) as FC<Props>