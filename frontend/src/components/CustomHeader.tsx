import React from 'react'
import { Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

const CustomHeader = ({ text = '', variant = '', style = {} }) => {
  let textStyle = {}

  switch (variant) {
    case 'title':
      textStyle = {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fcc434',
        lineHeight: 48,
      }
      break
    case 'heading1':
      textStyle = {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        lineHeight: 36,
      }
      break
    case 'heading2':
      textStyle = {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        lineHeight: 30,
      }
      break
    case 'body1':
      textStyle = {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        lineHeight: 24,
      }
      break
    case 'body2':
      textStyle = {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
        lineHeight: 21,
      }
      break
    default:
      textStyle = {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
      }
  }

  return <Text style={[styles.text, textStyle, style]}>{text}</Text>
}

CustomHeader.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['title', 'heading1', 'heading2', 'body1', 'body2']),
  style: PropTypes.object,
}

const styles = StyleSheet.create({
  text: {},
})

export default CustomHeader
