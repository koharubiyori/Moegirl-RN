import React, { PropsWithChildren } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import MyButton from '~/components/MyButton'
import { useTheme } from 'react-native-paper'
import { SearchHistory } from '..'
import i from '../lang'

export interface Props {
  onPressTitle (title: SearchHistory): void
  onLongPressTitle(title: SearchHistory): void
  onPressDelete (): void
  titles: SearchHistory[]
}

type FinalProps = Props

export default function RecentSearch(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  
  return (
    <View style={{ flex: 1 }}>
      {props.titles && props.titles.length ? <>
        <View style={styles.header}>
          <Text style={{ color: theme.colors.disabled }}>{i.recentSearch.title}</Text>
          <MyButton noRippleLimit onPress={props.onPressDelete} rippleColor={theme.colors.placeholder}>
            <Icon name="delete" size={20} color={theme.colors.placeholder } />
          </MyButton>
        </View>

        <ScrollView keyboardShouldPersistTaps="always">
          {props.titles.map(title => 
            <MyButton 
              key={title.keyword}
              contentContainerStyle={{ paddingHorizontal: 5 }}
              rippleColor={theme.colors.placeholder} 
              onPress={() => props.onPressTitle(title)}
              onLongPress={() => props.onLongPressTitle(title)}
            >
              <View style={{ ...styles.title, borderBottomColor: theme.colors.lightBg }}>
                <Text style={{ color: theme.colors.disabled }}>{title.keyword}</Text>
              </View>
            </MyButton>
          )}
        </ScrollView>
      </> : <>
        <View style={styles.noDataHintContainer}>
          <Text style={{ ...styles.noDataHint, color: theme.colors.placeholder }}>{i.recentSearch.noData}</Text>
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
    fontSize: 16
  },

  title: {
    height: 45,
    justifyContent: 'center',
    paddingLeft: 10,
    borderBottomWidth: 1,
  }
})