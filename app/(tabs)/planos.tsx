import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlanosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Plano de Desenvolvimento e Desafios Diários</Text>
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
