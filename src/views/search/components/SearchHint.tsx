import React, { PropsWithChildren } from 'react'
import { 
  View, Text, ScrollView,
  StyleSheet
} from 'react-native'
import Button from '~/components/Button'

export interface Props {
  titles: string[] | null
  onPressTitle (title: string): void
}

type FinalProps = Props

export default function SearchHint(props: PropsWithChildren<FinalProps>) {
  return (
    <View style={{ flex: 1 }}>
      {props.titles ? <>
        <ScrollView removeClippedSubviews keyboardShouldPersistTaps="always">{props.titles.map(title =>
          <Button contentContainerStyle={{}} rippleColor="#ccc" noLimit={false} 
            onPress={() => props.onPressTitle(title)}
            key={title}
          >
            <View style={styles.title}>
              <Text style={{ color: '#666' }}>{title}</Text>
            </View>
          </Button>
        )}</ScrollView>
      </> : <>
        <View style={styles.title}>
          <Text style={{ color: '#666' }}>搜索中...</Text>
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
    borderBottomColor: '#eee',
  }
})