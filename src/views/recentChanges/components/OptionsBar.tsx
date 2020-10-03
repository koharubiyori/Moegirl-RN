import React, { PropsWithChildren, useEffect, useState } from 'react'
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import MyButton from '~/components/MyButton'
import store from '~/mobx'
import RecentChangesOptionCheckboxItem from './OptionCheckboxItem'

export interface Props {
  onChange(options: RecentChangesOptions): void
  onLayout?(event: LayoutChangeEvent): void
}

export interface RecentChangesOptions {
  daysAgo: 1 | 3 | 7 | 14 | 30 | 90
  totalLimit: 50 | 100 | 250 | 500
  includeSelf: boolean
  includeRobot: boolean
  includeMinor: boolean
  namespace: string
}

;(RecentChangesOptionsBar as DefaultProps<Props>).defaultProps = {
  
}

function RecentChangesOptionsBar(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const [daysAgo, setDaysAgo] = useState<RecentChangesOptions['daysAgo']>(7)
  const [totalLimit, setTotalLimit] = useState<RecentChangesOptions['totalLimit']>(250)
  const [includeSelf, setIncludeSelf] = useState(true)
  const [includeRobot, setIncludeRobot] = useState(false)
  const [includeMinor, setIncludeMinor] = useState(true)
  const [namespace, setNamespace] = useState('*')
  
  useEffect(() => {
    props.onChange({ totalLimit, daysAgo, includeSelf, includeRobot, includeMinor, namespace })
  }, [totalLimit, includeSelf, includeRobot, includeMinor, namespace])

  function showDaysAgoSelectionDialog() {

  }

  function showLimitSelectionDialog() {

  }

  const isNight = store.settings.theme === 'night'
  const optionsBarTextStyle = {
    fontSize: 17,
    color: isNight ? theme.colors.text : 'white'
  }
  const buttonTextColor = isNight ? theme.colors.accent : 'white'
  return (
    <View 
      style={{ 
        ...styles.optionsBar,
        backgroundColor: theme.colors.primary 
      }}
      onLayout={props.onLayout}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={optionsBarTextStyle}>显示过去</Text>
        <MyButton 
          rippleColor={buttonTextColor}
          contentContainerStyle={{ 
            ...styles.optionTextBtn, 
            borderColor: buttonTextColor
          }}
          onPress={showDaysAgoSelectionDialog}
        >
          <Text style={{
            ...optionsBarTextStyle,
            color: buttonTextColor
          }}>{daysAgo}</Text>
        </MyButton>
        <Text style={optionsBarTextStyle}>天的最后</Text>
        <MyButton
          rippleColor={buttonTextColor}
          contentContainerStyle={{ 
            ...styles.optionTextBtn, 
            borderColor: buttonTextColor
          }}
          onPress={showLimitSelectionDialog}
        >
          <Text style={{
            ...optionsBarTextStyle,
            color: buttonTextColor
          }}>{totalLimit}</Text>
        </MyButton>
        <Text style={optionsBarTextStyle}>条编辑</Text>
      </View>
      <View style={{ marginTop: 10, flexDirection: 'row' }}>
        {store.user.isLoggedIn &&
          <RecentChangesOptionCheckboxItem
            title={'我的编辑'}
            checked={includeSelf}
            onPress={() => setIncludeSelf(prevVal => !prevVal)}
          />
        }
        <RecentChangesOptionCheckboxItem
          title={'小编辑'}
          checked={includeMinor}
          onPress={() => setIncludeMinor(prevVal => !prevVal)}
        />
        <RecentChangesOptionCheckboxItem
          title={'机器人'}
          checked={includeRobot}
          onPress={() => setIncludeRobot(prevVal => !prevVal)}
        />
      </View>
    </View>
  )
}

export default RecentChangesOptionsBar

const styles = StyleSheet.create({
  optionsBar: {
    paddingBottom: 10,
    paddingHorizontal: 15
  },

  optionTextBtn: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    marginHorizontal: 5
  }
})