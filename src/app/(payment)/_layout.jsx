import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const PaymetnLayout = () => {
  return (
   <Stack screenOptions={{headerShown: false}}>
    <Stack.Screen name="mainPayment" />
    <Stack.Screen name="PaymentReceiptInsertion" />
   </Stack>
  )
}

export default PaymetnLayout

const styles = StyleSheet.create({})

