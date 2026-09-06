import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CardCarreira from '../_components/CardCarreira';
import BotaoCustom from '../_components/BotaoCustom';
import { apiService, CursoComMatch } from '../_services/api';

export default function OnboardingResultadoScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState<CursoComMatch[]>([]);

  useEffect(() => {
    const carregarResultados = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCursos();
        if (data && data.length > 0) {
          setCursos(data);
        }
      } catch (err) {
        console.warn('Erro ao carregar cursos do resultado:', err);
      } finally {
        setLoading(false);
      }
    };
    carregarResultados();
  }, []);

  // Agrupar cursos por trilha
  const trilhaNatural = cursos.filter(c => (c.trilha || '').toLowerCase().includes('natural'));
  const trilhaHibrida = cursos.filter(c => (c.trilha || '').toLowerCase().includes('híbrido') || (c.trilha || '').toLowerCase().includes('hibrid'));
  const trilhaNovosHorizontes = cursos.filter(c => (c.trilha || '').toLowerCase().includes('novos') || (!trilhaNatural.includes(c) && !trilhaHibrida.includes(c)));

  // Obter top cursos para cada trilha se não houver classificação explícita
  const topNatural = trilhaNatural.length > 0 ? trilhaNatural.slice(0, 3) : cursos.slice(0, 2);
  const topHibrido = trilhaHibrida.length > 0 ? trilhaHibrida.slice(0, 3) : cursos.slice(2, 4);
  const topNovos = trilhaNovosHorizontes.length > 0 ? trilhaNovosHorizontes.slice(0, 3) : cursos.slice(4, 6);

  const handleAvancarHome = () => {
    router.replace('/(tabs)' as any);
  };

  const handleOpenCurso = (cursoId: number) => {
    router.push({
      pathname: '/(tabs)/curso-detalhes' as any,
      params: { id: cursoId }
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="light" backgroundColor="#0A0F1E" />
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Analisando suas respostas com a IA Nexo...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor="#0A0F1E" />

      {/* HEADER PADRÃO NEXO */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitleBrand}>NEXO<Text style={styles.headerTitleBrandSub}>CAREER</Text></Text>
          <Text style={styles.headerTitleMain}>DIAGNÓSTICO CONCLUÍDO</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* BANNER DE SUCESSO E PARABÉNS */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={['#1E1B4B', '#0F172A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.trophyContainer}>
              <Ionicons name="sparkles" size={28} color="#00D4FF" />
            </View>
            <Text style={styles.heroTitle}>Seu Perfil Vocacional está Pronto!</Text>
            <Text style={styles.heroSubtitle}>
              Mapeamos suas habilidades, interesses e objetivos. Seus cursos mais recomendados foram organizados em 3 trilhas estratégicas de carreira:
            </Text>
          </LinearGradient>
        </View>

        {/* TRILHA 1: NATURAL */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBox, { backgroundColor: '#1E1B4B' }]}>
              <Ionicons name="leaf-outline" size={20} color="#10B981" />
            </View>
            <View style={styles.sectionTitleColumn}>
              <Text style={styles.sectionTitle}>Trilha Natural</Text>
              <Text style={styles.sectionSubtitle}>Continuidade direta e aprofundamento do seu perfil</Text>
            </View>
          </View>

          {topNatural.map((curso) => (
            <CardCarreira
              key={curso.id}
              id={curso.id}
              nome={curso.nome}
              tipo={curso.tipo}
              duracao={curso.duracao}
              match={curso.match}
              icone={curso.icone}
              corIcone={curso.corIcone}
              corFundo={curso.corFundo}
              trilha="Natural"
              explicacao={curso.explicacoes?.[0] || curso.explicacao}
              onPress={() => handleOpenCurso(curso.id)}
            />
          ))}
        </View>

        {/* TRILHA 2: HÍBRIDA */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBox, { backgroundColor: '#2E1065' }]}>
              <Ionicons name="git-merge-outline" size={20} color="#A78BFA" />
            </View>
            <View style={styles.sectionTitleColumn}>
              <Text style={styles.sectionTitle}>Trilha Híbrida</Text>
              <Text style={styles.sectionSubtitle}>Convergência entre tecnologia, gestão e áreas correlatas</Text>
            </View>
          </View>

          {topHibrido.map((curso) => (
            <CardCarreira
              key={curso.id}
              id={curso.id}
              nome={curso.nome}
              tipo={curso.tipo}
              duracao={curso.duracao}
              match={curso.match}
              icone={curso.icone}
              corIcone={curso.corIcone}
              corFundo={curso.corFundo}
              trilha="Híbrido"
              explicacao={curso.explicacoes?.[0] || curso.explicacao}
              onPress={() => handleOpenCurso(curso.id)}
            />
          ))}
        </View>

        {/* TRILHA 3: NOVOS HORIZONTES */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBox, { backgroundColor: '#083344' }]}>
              <Ionicons name="rocket-outline" size={20} color="#00D4FF" />
            </View>
            <View style={styles.sectionTitleColumn}>
              <Text style={styles.sectionTitle}>Trilha Novos Horizontes</Text>
              <Text style={styles.sectionSubtitle}>Carreiras inovadoras e novos campos de expansão</Text>
            </View>
          </View>

          {topNovos.map((curso) => (
            <CardCarreira
              key={curso.id}
              id={curso.id}
              nome={curso.nome}
              tipo={curso.tipo}
              duracao={curso.duracao}
              match={curso.match}
              icone={curso.icone}
              corIcone={curso.corIcone}
              corFundo={curso.corFundo}
              trilha="Novos Horizontes"
              explicacao={curso.explicacoes?.[0] || curso.explicacao}
              onPress={() => handleOpenCurso(curso.id)}
            />
          ))}
        </View>

        {/* BOTÃO FINAL PARA A HOME */}
        <View style={styles.actionSection}>
          <BotaoCustom
            title="Ir para o Início"
            onPress={handleAvancarHome}
            iconName="arrow-forward"
            iconPosition="right"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0F1E',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0F1E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 15,
    marginTop: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    backgroundColor: '#0A0F1E',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitleBrand: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  headerTitleBrandSub: {
    color: '#A78BFA',
  },
  headerTitleMain: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 24,
  },
  heroGradient: {
    padding: 20,
    alignItems: 'center',
  },
  trophyContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 19,
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  sectionTitleColumn: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
  actionSection: {
    marginTop: 12,
    marginBottom: 20,
  },
});
