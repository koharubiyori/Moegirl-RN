import React, { createRef, MutableRefObject, PropsWithChildren, useEffect, useState } from 'react'
import { BackHandler, Dimensions } from 'react-native'
import { Button, Dialog, Text, useTheme } from 'react-native-paper'
import RootSiblings from 'react-native-root-siblings'
import ArticleView from '~/components/articleView'

interface Props {
  content: string
  onDismiss(): void
  onPressClose(): void
  getRef: MutableRefObject<any>
}

function NoteDialog(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const [visible, setVisible] = useState(true)
    
  props.getRef.current = { setVisible }

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      setVisible(false)
      setTimeout(() => props.onDismiss(), 1000)
      return true
    })
    return () => listener.remove()
  }, [])

  return (
    <Dialog
      visible={visible}
      onDismiss={props.onDismiss}
      style={{ marginHorizontal: 20, paddingHorizontal: 10 }}
    >
      <Dialog.Title>注释</Dialog.Title>

      <Dialog.Content style={{ height: Dimensions.get('window').height * 0.2 }}>
        <ArticleView inDialogMode 
          style={{ flex: 1 }}
          html={props.content}
        />
      </Dialog.Content>
      
      <Dialog.Actions>
        <Button onPress={props.onPressClose}>
          <Text style={{ fontSize: 16, color: theme.colors.accent }}>关闭</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default function showNoteDialog(content: string) {
  const noteDialogRef = createRef<any>()
  
  const sibling = new RootSiblings(
    <NoteDialog 
      getRef={noteDialogRef} 
      content={content}
      onDismiss={() => sibling.destroy()}
      onPressClose={() => {
        noteDialogRef.current.setVisible(false)
        setTimeout(() => sibling.destroy(), 1000)
      }}
    />
  )
}