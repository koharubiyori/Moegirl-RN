import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import queryApi from '~/api/query'
import Toolbar from '~/components/Toolbar'

export interface Props {
  
}

export interface RouteParams {
  title: string
  branch?: string[]
}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams>

function Category(props: PropsWithChildren<FinalProps>) {
  const title = props.navigation.getParam('title')
  const branch = props.navigation.getParam('branch')
  
  function search(category: string) {
    // queryApi.getPagesByCategory()
  }

  return (
    <View>
      <Toolbar
        title={'分类：' + title}
        leftIcon="home"
        rightIcon="search"
        onPressLeftIcon={() => props.navigation.popToTop()}
        onPressRightIcon={() => props.navigation.push('search')}
      />

      <View>
        
      </View>
    </View>
  )
}

export default Category

const styles = StyleSheet.create({
  
})