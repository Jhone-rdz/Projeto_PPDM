import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OnboardingResultadoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Resultado do Questionário Inicial</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
});
