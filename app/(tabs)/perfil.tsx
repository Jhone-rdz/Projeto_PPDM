import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService, PerfilUsuario } from '../_services/api';

export default function PerfilScreen() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync profile details on screen focus
  useFocusEffect(
    React.useCallback(() => {
      const loadPerfil = async () => {
        try {
          setIsLoading(true);
          const data = await apiService.getPerfil();
          setPerfil(data);
        } catch (err) {
          console.warn('Failed to sync profile details on perfil focus:', err);
        } finally {
          setIsLoading(false);
        }
      };
      loadPerfil();
    }, [])
  );

  const session = apiService.getSession();
  const user = session.user;
  const progressoGeral = perfil ? perfil.progresso_geral : 0;

  const handleBack = () => {
    router.back();
  };

  const calcLargura = (valor: number) => {
    return `${valor}%` as any;
  };



  // Map forces dynamically
  const forces = perfil ? [
    { nome: 'Lógica', valor: perfil.forcas.logica },
    { nome: 'Criatividade', valor: perfil.forcas.criatividade },
    { nome: 'Foco', valor: perfil.forcas.foco },
    { nome: 'Comunicação', valor: perfil.forcas.comunicacao },
    { nome: 'Liderança', valor: perfil.forcas.lideranca },
  ] : [
    { nome: 'Lógica', valor: 30 },
    { nome: 'Criatividade', valor: 30 },
    { nome: 'Foco', valor: 30 },
    { nome: 'Comunicação', valor: 30 },
    { nome: 'Liderança', valor: 30 },
  ];

  const getForcaIcon = (nome: string) => {
    switch (nome) {
      case 'Lógica': return 'calculator-outline';
      case 'Criatividade': return 'color-palette-outline';
      case 'Foco': return 'eye-outline';
      case 'Comunicação': return 'chatbubble-outline';
      case 'Liderança': return 'star-outline';
      default: return 'help-circle-outline';
    }
  };

  // Map disciplines dynamically
  const disciplines = perfil ? [
    { nome: 'Matemática', valor: perfil.disciplinas.matematica },
    { nome: 'Física', valor: perfil.disciplinas.fisica },
    { nome: 'Programação', valor: perfil.disciplinas.programacao },
    { nome: 'Desenho', valor: perfil.disciplinas.desenho },
    { nome: 'Português', valor: perfil.disciplinas.portugues },
    { nome: 'Biologia', valor: perfil.disciplinas.biologia },
    { nome: 'Química', valor: perfil.disciplinas.quimica },
    { nome: 'História', valor: perfil.disciplinas.historia },
  ] : [
    { nome: 'Matemática', valor: 30 },
    { nome: 'Física', valor: 30 },
    { nome: 'Programação', valor: 30 },
    { nome: 'Desenho', valor: 30 },
    { nome: 'Português', valor: 30 },
  ];

  const getDisciplinaIcon = (nome: string) => {
    switch (nome) {
      case 'Matemática': return 'grid-outline';
      case 'Física': return 'flask-outline';
      case 'Programação': return 'code-slash-outline';
      case 'Desenho': return 'pencil-outline';
      case 'Português': return 'book-outline';
      case 'Biologia': return 'leaf-outline';
      case 'Química': return 'flask-outline';
      case 'História': return 'earth-outline';
      default: return 'help-circle-outline';
    }
  };




  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor="#0A0F1E" />

      {/* CABEÇALHO (Fixo no topo) */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeftButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitleBrand}>NEXO</Text>
          <Text style={styles.headerTitleMain}>PERFIL PROFISSIONAL</Text>
          <Text style={styles.headerSubtitle}>Gerencie suas competências e carreira técnica</Text>
        </View>

        <View style={styles.headerRightCard}>
          <Ionicons name="person-circle-outline" size={28} color="#FFFFFF" />
        </View>
      </View>

      {/* Conteúdo com ScrollView */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* RESUMO DO PERFIL */}
        <View style={styles.profileSummarySection}>
          <View style={styles.profileSummaryCard}>
            <View style={styles.profileSummaryInfo}>
              <Text style={styles.profileNameText}>{user?.username || 'Estudante'}</Text>
              <Text style={styles.profileEmailText}>{user?.email}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>{user?.curso_tecnico || 'Sem Curso'}</Text>
                </View>
                {user?.objetivo_carreira && (
                  <View style={[styles.infoBadge, { backgroundColor: 'rgba(79, 70, 229, 0.15)', borderColor: '#4F46E5', borderWidth: 1 }]}>
                    <Text style={[styles.infoBadgeText, { color: '#00D4FF' }]}>{user?.objetivo_carreira}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* SEÇÃO 3 — PROGRESSO GERAL */}
        <View style={styles.overallProgressSection}>
          <View style={styles.overallProgressCard}>
            <View style={styles.overallProgressHeader}>
              <Text style={styles.overallProgressTitle}>SEU PROGRESSO GERAL</Text>
              <Text style={styles.overallProgressValue}>{progressoGeral}% concluído</Text>
            </View>

            <View style={styles.overallProgressBg}>
              <LinearGradient
                colors={['#4F46E5', '#00D4FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.overallProgressFill, { width: calcLargura(progressoGeral) }]}
              />
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          {isLoading ? (
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#6B21A8" />
              <Text style={{ color: '#94A3B8', marginTop: 10 }}>Carregando estatísticas...</Text>
            </View>
          ) : (
            <View style={styles.statsGridRow}>
              {/* Card SUAS FORÇAS */}
              <View style={styles.statCard}>
                <Text style={styles.statCardTitlePurple}>SUAS FORÇAS</Text>
                <View style={styles.statItemsList}>
                  {forces.map((item, index) => (
                    <View key={index} style={styles.statItemRow}>
                      <Ionicons name={getForcaIcon(item.nome) as any} size={16} color="#94A3B8" style={styles.statIcon} />
                      <Text style={styles.statName} numberOfLines={1}>
                        {item.nome}
                      </Text>
                      <View style={styles.miniBarBg}>
                        <LinearGradient
                          colors={['#4F46E5', '#00D4FF']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[styles.miniBarFill, { width: calcLargura(item.valor) }]}
                        />
                      </View>
                      <Text style={styles.statValueText}>{item.valor}%</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Card DISCIPLINAS EM FOCO */}
              <View style={styles.statCard}>
                <Text style={styles.statCardTitleCyan}>DISCIPLINAS EM FOCO</Text>
                <View style={styles.statItemsList}>
                  {disciplines.map((item, index) => (
                    <View key={index} style={styles.statItemRow}>
                      <Ionicons name={getDisciplinaIcon(item.nome) as any} size={16} color="#94A3B8" style={styles.statIcon} />
                      <Text style={styles.statName} numberOfLines={1}>
                        {item.nome}
                      </Text>
                      <View style={styles.miniBarBg}>
                        <LinearGradient
                          colors={['#4F46E5', '#00D4FF']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[styles.miniBarFill, { width: calcLargura(item.valor) }]}
                        />
                      </View>
                      <Text style={styles.statValueText}>{item.valor}%</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 16,
    backgroundColor: '#0A0F1E',
  },
  headerLeftButton: {
    width: 38,
    height: 38,
    backgroundColor: '#1F2937',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerTitleBrand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
    fontFamily: 'System',
  },
  headerTitleMain: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
    fontFamily: 'System',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
    fontFamily: 'System',
  },
  headerRightCard: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileSummarySection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  profileSummaryCard: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  profileSummaryInfo: {
    width: '100%',
  },
  profileNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  profileEmailText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
    fontFamily: 'System',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  infoBadge: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00D4FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  infoBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E2E8F0',
    fontFamily: 'System',
  },
  overallProgressSection: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  overallProgressCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  overallProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallProgressTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
    letterSpacing: 0.5,
    fontFamily: 'System',
  },
  overallProgressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  overallProgressBg: {
    height: 8,
    backgroundColor: '#1F2937',
    borderRadius: 4,
    marginTop: 10,
    overflow: 'hidden',
  },
  overallProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  statsGridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  statCardTitlePurple: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
    letterSpacing: 0.5,
    marginBottom: 12,
    fontFamily: 'System',
  },
  statCardTitleCyan: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00D4FF',
    letterSpacing: 0.5,
    marginBottom: 12,
    fontFamily: 'System',
  },
  statItemsList: {
    gap: 10,
  },
  statItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 20,
  },
  statName: {
    color: '#FFFFFF',
    fontSize: 13,
    flex: 1,
    marginLeft: 6,
    fontFamily: 'System',
  },
  miniBarBg: {
    backgroundColor: '#1F2937',
    height: 4,
    borderRadius: 2,
    width: 56,
    marginRight: 6,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  statValueText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    width: 32,
    textAlign: 'right',
    fontFamily: 'System',
  },
});
