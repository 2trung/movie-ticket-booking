import React from 'react'
import {
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  View,
} from 'react-native'

const ContainerComponent = ({ children }) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          // paddingTop: insets.top,
          flex: 1,
        }}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          {children}
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default ContainerComponent
