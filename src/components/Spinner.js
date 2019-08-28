import React from 'react'
import { 
  View
} from 'react-native'
import PropTypes from 'prop-types'
import { CircleSnail } from 'react-native-progress'

Spinner.propTypes = {
  style: PropTypes.object,

  size: PropTypes.number,
  color: PropTypes.arrayOf(PropTypes.number),
}

export default function Spinner({
  size = 50,
  color = [$colors.main],
  style = {}
}){
  return (
    // spinner会迷之围绕容器进行旋转，加个和spinner一样大小的容器防止这种情况
    <View style={{ ...style, width: size, height: size }}>
      <CircleSnail size={size} color={color} duration={700} spinDuration={1800} />
    </View>
  )
}