import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text, Image, TouchableOpacity,
  StyleSheet
} from 'react-native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { toggleLike, report, delComment } from '~/api/comment'
import commentHOC from '~/redux/comment/HOC'
import toast from '~/utils/toast'
import store from '~/redux'
import format from '../utils/format'

class CommentItem extends React.PureComponent{
  static propTypes = {
    data: PropTypes.object,
    isReply: PropTypes.bool,
    visibleReply: PropTypes.bool,
    visibleReplyBtn: PropTypes.bool,
    visibleReplyNum: PropTypes.bool,
    visibleDelBtn: PropTypes.bool,
    navigation: PropTypes.object,
    signedName: PropTypes.bool,
    onDel: PropTypes.func,
    onPress: PropTypes.func,
    onTapReply: PropTypes.func
  }

  static defaultProps = {
    visibleReply: true,
    visibleReplyBtn: true,
    visibleReplyNum: true,
    visibleDelBtn: true,
    isReply: false
  }

  constructor (props){
    super(props)

    this.state = {
      isReported: false
    }
  }

  toggleLike = () =>{
    if(!this.props.signedName){
      return $dialog.confirm.show({
        content: '未登录无法进行点赞，是否要前往登录界面？',
        onTapCheck: () => this.props.navigation.push('login')
      })
    }
    
    var isLiked = this.props.data.myatt
    
    toast.showLoading()
    toggleLike(this.props.data.id, isLiked)
      .finally(toast.hide)
      .then(data =>{
        this.props.comment.setLikeStatus(this.props.data.id, !isLiked)
      }).catch(e =>{
        console.log(e)
        setTimeout(() => toast.show('网络错误'))
      })
  }

  report = () =>{
    if(this.state.isReported){ return toast.show('不能重复举报') }
    
    $dialog.confirm.show({ 
      content: `确定要举报这条${this.props.isReply ? '回复' : '评论'}吗？`,
      onTapCheck: () =>{
        toast.showLoading()
        report(this.props.data.id)
          .finally(() => toast.hide())
          .then(() =>{
            this.setState({ isReported: true })  
            // 这里如果不做延时会受到toast.hide()的影响，造成alert不显示，且界面被一个透明遮罩层挡上
            setTimeout(() => $dialog.alert.show({ content: '已举报' }))
          })
          .catch(() => toast.show('网络错误，请重试'))
      }
   })
  }

  del = () =>{
    $dialog.confirm.show({
      content: `确定要删除自己的这条${this.props.isReply ? '回复' : '评论'}吗？`,
      onTapCheck: () =>{
        toast.showLoading()
        delComment(this.props.data.id)
          .finally(() => toast.hide())
          .then(() =>{
            this.props.onDel(this.props.data.id)
            setTimeout(() => $dialog.alert.show({ content: `${this.props.isReply ? '回复' : '评论'}已删除` }))
          })
          .catch(e =>{
            console.log(e)
            toast.show('网络错误，请重试')
          })
      }
    })    
  }

  render (){
    const iconSize = 20
    const {data} = this.props
    const {myatt: isLiked, like: likeNum} = data

    const formattedChildren = format.children(data.children || [], data.id)

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Image source={{ uri: $avatarUrl + data.username }} style={styles.avatar}  />
              <View>
                <Text>{data.username}</Text>
                <Text style={{ color: '#ABABAB', marginTop: 3 }}>{format.date(data.timestamp)}</Text>
              </View>
            </View>

            {this.props.visibleDelBtn && this.props.data.username === this.props.signedName ? 
              <TouchableOpacity onPress={this.del}>
                <MaterialIcon name="clear" color="#ccc" size={iconSize} />
              </TouchableOpacity>
            : null}
          </View>
        </View>

        <View style={styles.main}>
          <Text>
            {this.props.data.targetName ?
              <Text style={{ color: '#ABABAB' }}>
                <Text>回复 </Text>
                <Text style={{ color: '#007ACC' }}>{this.props.data.targetName}：  </Text>
              </Text> 
            : null}
            
            <Text>{format.content(data.text)}</Text>
          </Text>
        </View>

        {this.props.visibleReply && this.props.data.children && this.props.data.children.length !== 0 ? 
          <View style={styles.reply}>
            {formattedChildren.filter((_, ind) => ind < 3).map(item =>
              <View style={{ marginVertical: 2 }}>
                <Text>
                  <Text style={{ color: '#007ACC' }}>{item.username}</Text>
                  {item.targetName ? <Text> 回复 </Text> : null}
                  {item.targetName ? <Text style={{ color: '#007ACC' }}>{item.targetName}</Text> : null}
                  <Text style={{ color: '#007ACC' }}>：</Text>
                  <Text>{format.content(item.text)}</Text>
                </Text>
              </View>
            )}

            {formattedChildren.length > 3 ?
              <TouchableOpacity onPress={() => this.props.onTapReply(data.id)}>
                <Text style={{ color: '#666', textAlign: 'center', marginTop: 10 }}>查看更多</Text>
              </TouchableOpacity>
            : null}
          </View>
        : null}

        <View style={styles.footer}>
          <TouchableOpacity style={{ ...styles.footerItem, position: 'relative', top: 1 }} 
            onPress={this.toggleLike}
          >
            {likeNum === 0 ? <AntDesignIcon name="like2" color="#ccc" size={iconSize} /> : null}
            {likeNum > 0 && !isLiked ? <AntDesignIcon name="like2" color={$colors.sub} size={iconSize} /> : null}
            {isLiked ? <AntDesignIcon name="like1" color={$colors.sub} size={iconSize} /> : null}
            {likeNum > 0 ? <Text style={{ color: $colors.sub, marginLeft: 5 }}>{likeNum}</Text> : null}
          </TouchableOpacity>

          {this.props.visibleReplyBtn ? 
            <TouchableOpacity style={styles.footerItem} contentContainerStyle={styles.footerItem}
              onPress={() => this.props.onTapReply(data.id)}
            >
              {!this.props.visibleReplyNum || data.children.length === 0 ? 
                <FontAwesomeIcon name="comment-o" color="#ccc" size={iconSize} />
              :
                <>
                  <FontAwesomeIcon name="comment" color={$colors.sub} size={iconSize} />
                  <Text style={{ color: $colors.sub, marginLeft: 5 }}>{data.children.length}</Text>
                </>
              }
            </TouchableOpacity>
          : null}

          <TouchableOpacity style={styles.footerItem} onPress={this.report}>
            <AntDesignIcon name="flag" color="#ccc" size={iconSize} /> 
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default commentHOC(CommentItem)

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },

  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  avatar: {
    width: 50,
    height: 50,
    backgroundColor: '#eee',
    borderRadius: 30,
    marginRight: 10
  },

  main: {
    marginVertical: 15
  },

  icon: {
    width: 26,
    height: 26
  },

  footer: {
    flexDirection: 'row',
    height: 30,
    marginTop: 10
  },

  footerItem: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  reply: {
    flex: 1,
    backgroundColor: '#eee',
    marginLeft: 60,
    marginRight: 30,
    padding: 10
  }
})