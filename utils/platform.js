import { Platform } from 'react-native'
export const isWeb = Platform.OS === 'web'
export const WEB_MAX_WIDTH = 480
/** @returns {import('react-native').ViewStyle} */
export const useResponsiveWidth = () =>
  isWeb
    ? /** @type {import('react-native').ViewStyle} */ ({ maxWidth: WEB_MAX_WIDTH, width: '100%', alignSelf: 'center' })
    : /** @type {import('react-native').ViewStyle} */ ({ width: '100%' })
