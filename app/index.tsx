import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { apiService } from './_services/api';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const success = await apiService.tryRestoreSession();
        if (success) {
          router.replace('/(tabs)');
        } else {
          router.replace('/auth/login');
        }
      } catch (err) {
        console.error('Error during initial session restore:', err);
        router.replace('/auth/login');
      }
    };
    checkSession();
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ActivityIndicator size="large" color="#6B21A8" />
      <Text style={styles.loadingText}>Carregando NexoCareer...</Text>
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
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
});
