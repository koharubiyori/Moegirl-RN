import React, { PropsWithChildren } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'

export interface Props {
  onTapTitle (title: string): void
  onTapDelete (): void
  titles: string[]
}

type FinalProps = Props

export default function RecentSearch(props: PropsWithChildren<FinalProps>) {
  return (
    <View style={{ flex: 1 }}>
      {props.titles && props.titles.length ? <>
        <View style={styles.header}>
          <Text style={{ color: '#666' }}>最近搜索</Text>
          <Button onPress={props.onTapDelete} rippleColor="#ccc">
            <Icon name="delete" size={20} color="#666" />
          </Button>
        </View>

        <ScrollView keyboardShouldPersistTaps="always">{props.titles.map(title => 
          <Button rippleColor="#ccc" noLimit={false} contentContainerStyle={{ paddingHorizontal: 5 }}
            onPress={() => props.onTapTitle(title)}
            key={title}
          >
            <View style={styles.title}>
              <Text style={{ color: '#666' }}>{title}</Text>
            </View>
          </Button>
        )}</ScrollView>
      </> : <>
        <View style={styles.noDataHintContainer}>
          <Text style={styles.noDataHint}>暂无搜索记录</Text>
        </View>
      </>}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },

  noDataHintContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },  

  noDataHint: {
    color: '#ccc',
    fontSize: 16
  },

  title: {
    height: 45,
    justifyContent: 'center',
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  }
})