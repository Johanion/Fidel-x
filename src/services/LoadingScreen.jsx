import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#ffffff', // white full-screen background
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 25,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.7)', // dark container for contrast
    alignItems: 'center',
  },
  message: {
    marginTop: 15,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default LoadingScreen;
