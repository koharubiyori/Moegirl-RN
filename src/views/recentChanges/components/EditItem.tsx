import moment from 'moment'
import React, { PropsWithChildren, useState } from 'react'
import { Image, ScrollView, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { RecentChangeData } from '~/api/search/types'
import { AVATAR_URL } from '~/constants'
import { colors } from '~/theme'
import parseEditComment from '~/utils/parseEditComment'

export interface UserDataForRecentChangesItem {
  name: string
  total: number
}

export interface Props {
  style?: StyleProp<ViewStyle>
  type: 'new' | 'edit' | 'log'
  title: string
  comment: string
  users: UserDataForRecentChangesItem[]
  newLength: number
  oldLength: number
  revId: number
  oldRevId: number
  dateISO: string
  editDetails: RecentChangeData[]
}

;(RecentChangesEditItem as DefaultProps<Props>).defaultProps = {
  
}

function RecentChangesEditItem(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const [visibleEditDetails, setVisibleEditDetails] = useState(false) 
  
  const totalNumberOfEdit = props.users.reduce((result, item) => result + item.total, 0)
  const singleEdit = totalNumberOfEdit === 1
  const diffSize = props.newLength - props.oldLength

  const { body: comment, section } = parseEditComment(props.comment)
  return (
    <View style={{ ...styles.container, backgroundColor: theme.colors.background, ...(props.style as any) }}>      
      <View style={{ position: 'absolute', top: 5, right: 10 }}>
        <TouchableOpacity>
          <MaterialIcon name="compare-arrows" size={25} color={theme.colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcon name="history" size={25} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>
    
      <View style={styles.titleContainer}>
        <Text numberOfLines={1}>
          {props.type !== 'log' &&
            <Text style={{ 
              ...styles.titleText,
              color: diffSize >= 0 ? colors.green.primary : '#F14C4C',
            }}>{(diffSize > 0 ? '+' : '') + diffSize}</Text>
          }
          <Text style={{ 
            fontSize: 16, 
            color: theme.colors.accent,
            marginRight: 5
          }}>{{ new: '(新)', edit: '', log: '(日志)' }[props.type]} </Text>
          <Text style={styles.titleText}>{props.title}</Text>
        </Text>
      </View>

      <View style={{ marginTop: 5, marginHorizontal: 10, marginRight: 60 }}>
        <Text>
        <Text>
          {!!section && <Text style={{ ...styles.sectionText, color: theme.colors.placeholder }}>{section} </Text>}
          {comment ? 
            <Text>{comment}</Text>
          :
            <Text style={{ color: theme.colors.placeholder }}>该编辑未填写摘要</Text>
          }
        </Text>
        </Text>
      </View> 

      {!singleEdit &&
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.userList}>
          {props.users!.map((user, index) =>
            <View key={user.name} style={styles.userContainer}>
              <Image 
                source={{ uri: AVATAR_URL + user.name }}
                style={styles.avatar}
              />
              <Text style={{ color: theme.colors.disabled }}>{user.name}</Text>
              <Text style={{ color: theme.colors.disabled }}> {`(×${user.total})`}</Text>
              {index !== props.users!.length - 1 && <Text style={{ color: theme.colors.disabled }}>、</Text>}
            </View> 
          )}
        </ScrollView>
      }

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: -5, marginTop: 5 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {!singleEdit ? 
            <TouchableOpacity 
              style={{ flexDirection: 'row', justifyContent: 'center' }}
              onPress={() => setVisibleEditDetails(prevVal => !prevVal)}
            >
              <FontAwesomeIcon name={visibleEditDetails ? 'caret-down' : 'caret-right'} size={20} color={theme.colors.accent} />
              <Text style={{ marginLeft: 5, color: theme.colors.accent }}>{visibleEditDetails ? '收起' : '展开'}详细记录{`(共${totalNumberOfEdit}次编辑)`}</Text>
            </TouchableOpacity> 
          : 
            <View style={styles.userContainer}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: AVATAR_URL + props.users[0].name }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <View>
                <TouchableOpacity>
                  <Text style={{ color: theme.colors.disabled }}>{props.users[0].name}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity>
                    <Text style={{ fontSize: 12, color: theme.colors.accent }}>讨论</Text>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 12, color: theme.colors.disabled }}> | </Text>
                  <TouchableOpacity>
                    <Text style={{ fontSize: 12, color: theme.colors.accent }}>贡献</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: theme.colors.disabled }}>{moment(props.dateISO).format('YYYY-MM-DD HH:mm')}</Text>
        </View>
      </View>

      {!!props.editDetails && props.editDetails.length !== 0 && visibleEditDetails &&
        <View style={styles.editDetails}>
          {props.editDetails.map(item => 
            <EditDetailItem
              key={item.timestamp}
              style={{ paddingBottom: 0 }}
              type={item.type as any}
              comment={item.comment}
              username={item.user}
              newLength={item.newlen}
              oldLength={item.oldlen}
              revId={item.revid}
              oldRevId={item.old_revid}
              dateISO={item.timestamp}
            />
          )}
        </View>
      }
    </View>
  )
}

export default RecentChangesEditItem

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 1,
  },

  titleContainer: {
    flexDirection: 'row', 
    height: 25, 
    marginRight: 25,
  },

  titleText: {
    fontSize: 16,
    fontWeight: 'bold'
  },

  sectionText: {
    fontStyle: 'italic', 
  },

  userList: {
    flexDirection: 'row',
    marginTop: 5
  },
  
  userContainer: {
    flexDirection: 'row', 
    alignItems: 'center'
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 5
  },

  footer: {
    flexDirection: 'row'
  },

  footerBtn: {
    height: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  editDetails: {
    
  }
})

interface EditDetailItemProps {
  style?: StyleProp<ViewStyle>
  type: 'new' | 'edit' | 'log'
  comment: string
  username: string
  newLength: number
  oldLength: number
  revId: number
  oldRevId: number
  dateISO: string
}

function EditDetailItem(props: EditDetailItemProps) {
  const theme = useTheme()
  const diffSize = props.newLength - props.oldLength

  const { body: comment, section } = parseEditComment(props.comment)
  return (
    <View style={{ 
      paddingLeft: 10, 
      borderLeftColor: diffSize >= 0 ? colors.green.primary : '#F14C4C', 
      borderLeftWidth: 5, 
      marginTop: 10,
      marginLeft: 3.5
    }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ 
            fontSize: 16,
            fontWeight: 'bold',
            color: diffSize >= 0 ? colors.green.primary : '#F14C4C',
          }}>{(diffSize > 0 ? '+' : '') + diffSize}</Text>
          <Text style={{ 
            fontSize: 16, 
            color: theme.colors.accent,
            marginRight: 5
          }}>{{ new: '(新)', edit: '', log: '(日志)' }[props.type]}</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Image 
            source={{ uri: AVATAR_URL + props.username }}
            style={styles.avatar}
          />
          <Text numberOfLines={1} style={{ color: theme.colors.disabled }}>{props.username}</Text>
          <Text style={{ color: theme.colors.disabled }}> (</Text>
          <TouchableOpacity>
            <Text style={{ color: theme.colors.accent }}>讨论</Text>
          </TouchableOpacity>
          <Text style={{ color: theme.colors.disabled }}> | </Text>
          <TouchableOpacity>
            <Text style={{ color: theme.colors.accent }}>贡献</Text>
          </TouchableOpacity>
          <Text style={{ color: theme.colors.disabled }}>)</Text>
        </View> 
      </View>

      <View style={{ marginTop: 5, marginHorizontal: 10, marginRight: 60 }}>
        <Text>
          {!!section && <Text style={{ ...styles.sectionText, color: theme.colors.placeholder }}>{section} </Text>}
          {comment ? 
            <Text>{comment}</Text>
          :
            <Text style={{ color: theme.colors.placeholder }}>该编辑未填写摘要</Text>
          }
        </Text>
      </View> 

      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginTop: 10,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity>
            <Text style={{ color: theme.colors.accent }}>当前</Text>
          </TouchableOpacity>
          <Text style={{ color: theme.colors.disabled }}> | </Text>
          <TouchableOpacity>
            <Text style={{ color: theme.colors.accent }}>之前</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: theme.colors.disabled }}>{moment(props.dateISO).format('YYYY-MM-DD HH:mm')}</Text>
      </View>
    </View>
  )
}