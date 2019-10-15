import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Modal,
  StyleSheet
} from 'react-native'

export default class Comment extends React.Component{
  static propTypes = {
    id: PropTypes.number,
    firstData: PropTypes.object,
    visible: PropTypes.bool
  }

  constructor (props){
    super(props)
    this.state = {
      data: [],
      total: 0,
      status: 1,
      currentPage: 1
    }
  }
  

  render (){
    return (
      // 报错
      <Modal visible={this.props.visible}>
        <Text>comment</Text>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  
})