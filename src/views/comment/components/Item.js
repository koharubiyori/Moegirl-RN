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
import toast from '~/utils/toast'
import Tree from '~/utils/tree'
import store from '~/redux'

export default class CommentItem extends React.Component{
  static propTypes = {
    data: PropTypes.object,
    contentName: PropTypes.string,
    visibleReply: PropTypes.bool,
    visibleReplyBtn: PropTypes.bool,
    visibleReplyNum: PropTypes.bool,
    onDel: PropTypes.func,
    onPress: PropTypes.func,
    onTapReply: PropTypes.func
  }

  static defaultProps = {
    visibleReply: true,
    visibleReplyBtn: true,
    visibleReplyNum: true,
    contentName: '评论'
  }

  constructor (props){
    super(props)

    this.state = {
      isLiked: props.data.myatt,
      likeNum: props.data.like,
      isReported: false
    }
  }

  dateFormat (timestamp){
    var comDate = new Date(timestamp * 1000)
    var nowDate = new Date()
    var diff = nowDate - comDate
    diff = Math.floor(Math.abs(diff) / 1000)
    var date = ''
    if(diff < 60){
      date = diff + '秒前'
    }else if(diff < 60 * 60){
      date = Math.floor(diff / 60) + '分钟前'
    }else if(diff < 60 * 60 * 24){
      date = Math.floor(diff / 60 / 60) + '小时前'
    }else if(diff < 60 * 60 * 24 / 30){
      date = Math.floor(diff / 60 / 60 / 24) + '天前'
      var needFullDate = true
    }else{
      date = `${comDate.getFullYear()}年${comDate.getMonth() + 1}月${comDate.getDate()}日`
      var needFullDate = true
    }

    const bu_ling = number => number < 10 ? '0' + number : number
    var time = `${bu_ling(comDate.getHours())}:${bu_ling(comDate.getMinutes())}`

    if(needFullDate){
      return `${date} ${time}`
    }else{
      return date
    }
  }

  contentFormat (text){
    text = text.replace(/(<.+?>|<\/.+?>)/g, '')
    .replace(/&(.+?);/g, (s, s1) => ({
      gt: '>' ,
      lt: '<',
      amp: '&'
    })[s1] || s)
  
    return text.trim()
  }

  childrenFormat (children){
    if(children.length === 0){ return [] }

    var result = Tree.toFlat(children)
    return result.map(item =>{
      if(item.parentid !== this.props.data.id){
        item.targetName = result.filter(item2 => item2.id === item.parentid)[0].username
      }

      return item
    }).reverse()
  }

  toggleLike = () =>{
    var {isLiked} = this.state
    
    toast.showLoading()
    toggleLike(this.props.data.id, isLiked)
      .finally(toast.hide)
      .then(data =>{
        toast.show(isLiked ? '取消点赞' : '已点赞', 'center')
        this.setState({ 
          isLiked: !this.state.isLiked, 
          likeNum: this.state.likeNum + (this.state.isLiked ? -1 : 1)
        })
      }).catch(e =>{
        console.log(e)
        toast.show('网络错误')
      })
  }

  report = () =>{
    if(this.state.isReported){ return toast.show('不能重复举报') }
    
    $dialog.confirm.show({ 
      content: `确定要举报这条${this.props.contentName}吗？`,
      onTapCheck: () =>{
        toast.showLoading()
        report(this.props.data.id)
          .finally(toast.hide)
          .then(() =>{
            this.setState({ isReported: true })  
            $dialog.alert.show({ content: '已举报' })
          })
          .catch(() => toast.show('网络错误，请重试'))
      }
   })
  }

  del = () =>{
    $dialog.confirm.show({
      content: `确定要删除自己的这条${this.props.contentName}吗？`,
      onTapCheck: () =>{
        toast.showLoading()
        delComment(this.props.data.id)
          .finally(toast.hide)
          .then(() =>{
            this.props.onDel(this.props.data.id)
            $dialog.alert.show({ content: '评论已删除' })
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
    const {likeNum, isLiked} = this.state

    const formattedChildren = this.childrenFormat(this.props.data.children || [])

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Image source={{ uri: $avatarUrl + data.username }} style={styles.avatar}  />
              <View>
                <Text>{data.username}</Text>
                <Text style={{ color: '#ABABAB', marginTop: 3 }}>{this.dateFormat(data.timestamp)}</Text>
              </View>
            </View>

            {this.props.data.username === store.getState().user.name ? 
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
            
            <Text>{this.contentFormat(data.text)}</Text>
          </Text>
        </View>

        {this.props.visibleReply && this.props.data.children && this.props.data.children.length !== 0 ? 
          <View style={styles.reply}>{formattedChildren.filter((_, ind) => ind < 3).map(item =>
            <View style={{ marginVertical: 2 }}>
              <Text>
                <Text style={{ color: '#007ACC' }}>{item.username}</Text>
                {item.targetName ? <Text> 回复 </Text> : null}
                {item.targetName ? <Text style={{ color: '#007ACC' }}>{item.targetName}</Text> : null}
                <Text style={{ color: '#007ACC' }}>：</Text>
                <Text>{this.contentFormat(item.text)}</Text>
              </Text>
            </View>
          )}</View>
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
              onPress={() => this.props.onTapReply(this.props.data, formattedChildren)}
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