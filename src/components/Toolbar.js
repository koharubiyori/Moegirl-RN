import React from 'react'
import { NativeModules } from 'react-native'
import { Toolbar } from 'react-native-material-ui'

export default class extends Toolbar {
    constructor (props) {
        super(props)
    }
    render() {
        const statusBarHeight = NativeModules.StatusBarManager.HEIGHT
        const style = { container: { paddingTop: statusBarHeight, height: (56 + statusBarHeight) } }
        console.log(this.props)
        return (
            <Toolbar {...this.props} style={style} />
        )
    }
}
