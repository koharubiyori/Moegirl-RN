import React, { PropsWithChildren } from 'react'
import { 
  View, Text, ScrollView,
  StyleSheet
} from 'react-native'
import MyButton from '~/components/MyButton'
import { useTheme } from 'react-native-paper'
import i from '../lang'

export interface Props {
  titles: string[] | null
  onPressTitle (title: string): void
}

type FinalProps = Props

export default function SearchHint(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  
  return (
    <View style={{ flex: 1 }}>
      {props.titles ? <>
        <ScrollView removeClippedSubviews keyboardShouldPersistTaps="always">{props.titles.map(title =>
          <MyButton 
            contentContainerStyle={{}} 
            rippleColor={theme.colors.placeholder}
            onPress={() => props.onPressTitle(title)}
            key={title}
          >
            <View style={{ ...styles.title, borderBottomColor: theme.colors.lightBg }}>
              <Text style={{ color: theme.colors.disabled }}>{title}</Text>
            </View>
          </MyButton>
        )}</ScrollView>
      </> : <>
        <View style={{ ...styles.title, borderBottomColor: theme.colors.lightBg }}>
          <Text style={{ color: theme.colors.disabled }}>{i.searchHint.searching}</Text>
        </View>
      </>}
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    height: 45,
    justifyContent: 'center',
    paddingLeft: 10,
    borderBottomWidth: 1,
  }
})