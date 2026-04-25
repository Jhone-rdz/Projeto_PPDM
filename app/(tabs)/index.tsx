import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  const nomeAluno = 'João';
  const curso = 'Informática';
  const perfil = 'Analítico e criativo, com tendência para tecnologia e resolução de problemas.';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>NexoCareer</Text>
        <Text style={styles.boas_vindas}>Olá, {nomeAluno}! 👋</Text>
        <Text style={styles.subtitulo}>Bem-vindo ao seu orientador de carreira</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.card_titulo}>Seu Perfil</Text>
        <Text style={styles.card_curso}>Curso: {curso}</Text>
        <Text style={styles.card_texto}>{perfil}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.card_titulo}>O que deseja fazer?</Text>
        <Text style={styles.atalho}>🎯 Ver carreiras recomendadas</Text>
        <Text style={styles.atalho}>📋 Acessar meu plano de desenvolvimento</Text>
        <Text style={styles.atalho}>💬 Conversar com o mentor IA</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  header: {
    backgroundColor: '#6B21A8',
    padding: 32,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logo: {
    fontSize: 20,
    fontWeight: '500',
    color: '#E9D5FF',
    marginBottom: 12,
  },
  boas_vindas: {
    fontSize: 26,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#D8B4FE',
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 0,
    padding: 20,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#E9D5FF',
  },
  card_titulo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B21A8',
    marginBottom: 10,
  },
  card_curso: {
    fontSize: 13,
    color: '#7C3AED',
    marginBottom: 6,
  },
  card_texto: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  atalho: {
    fontSize: 14,
    color: '#4B5563',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E9D5FF',
  },
});