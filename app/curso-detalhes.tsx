import React from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';

export default function RootCursoDetalhesRedirect() {
  const params = useLocalSearchParams();
  return <Redirect href={{ pathname: '/(tabs)/curso-detalhes', params }} />;
}
