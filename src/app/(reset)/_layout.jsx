import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="forget-password" options={{headerShown: false}} />
      <Stack.Screen name="reset-password" options={{headerShown: false}} />
    </Stack>
  )
}

export default AuthLayout

const styles = StyleSheet.create({})