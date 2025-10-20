import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const toolKit = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        {/* header */}
        <View>
          <Text>Your smart study companion</Text>
          
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default toolKit

const styles = StyleSheet.create({})