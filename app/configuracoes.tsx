import React from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';

export default function RootConfiguracoesRedirect() {
  const params = useLocalSearchParams();
  return <Redirect href={{ pathname: '/(tabs)/configuracoes' as any, params }} />;
}
