import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../_services/api';

export default function PerfilScreen() {
  const router = useRouter();

  const session = apiService.getSession();
  const user = session.user;

  const [topCurso, setTopCurso] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopMatch = async () => {
      try {
        const data = await apiService.getCursos();
        if (data && data.length > 0) {
          // Courses list is pre-sorted by match DESC by backend, so first one is the top match
          setTopCurso(data[0]);
        }
      } catch (err) {
        console.warn('Error fetching courses in profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopMatch();
  }, []);

  const handleBack = () => {
    router.back();
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
            <View style={styles.profileSummaryHeader}>
              <Image
                source={require('../../assets/images/nivel 0 iniciante.png')}
                style={styles.profileAvatar}
              />
              <View style={styles.profileSummaryInfo}>
                <Text style={styles.profileNameText}>{user?.username || 'Estudante'}</Text>
                <Text style={styles.profileEmailText}>{user?.email}</Text>
              </View>
            </View>

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

        {/* CURSO MAIS COMPATÍVEL */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Maior Alinhamento Vocacional</Text>
          
          {loading ? (
            <ActivityIndicator size="small" color="#4F46E5" style={{ marginVertical: 20 }} />
          ) : topCurso ? (
            <TouchableOpacity 
              style={styles.topMatchCard}
              onPress={() => router.push({ pathname: '/(tabs)/carreiras', params: { openCursoId: topCurso.id } })}
              activeOpacity={0.8}
            >
              <View style={styles.topMatchHeader}>
                <View style={[styles.iconContainer, { backgroundColor: topCurso.corFundo || topCurso.cor_fundo || '#1E293B' }]}>
                  <Ionicons name={(topCurso.icone || 'school-outline') as any} size={28} color={topCurso.corIcone || topCurso.cor_icone || '#4F46E5'} />
                </View>
                <View style={styles.topMatchTitleContainer}>
                  <Text style={styles.topMatchName}>{topCurso.nome}</Text>
                  <Text style={styles.topMatchDetails}>{topCurso.tipo} • {topCurso.duracao}</Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreText}>{topCurso.match}%</Text>
                  <Text style={styles.scoreLabel}>Match</Text>
                </View>
              </View>

              {topCurso.explicacoes && topCurso.explicacoes.length > 0 && (
                <View style={styles.explanationBox}>
                  <Text style={styles.explanationText}>
                    • {topCurso.explicacoes[0]}
                  </Text>
                </View>
              )}

              <View style={styles.cardFooter}>
                <Text style={styles.footerLink}>Explorar na aba de Cursos →</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={32} color="#4B5563" />
              <Text style={styles.emptyText}>Realize o questionário inicial para calcular suas compatibilidades!</Text>
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
  profileSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#4F46E5',
    backgroundColor: '#1F2937',
  },
  profileSummaryInfo: {
    flex: 1,
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
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    fontFamily: 'System',
  },
  topMatchCard: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  topMatchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topMatchTitleContainer: {
    flex: 1,
  },
  topMatchName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  topMatchDetails: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    fontFamily: 'System',
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    fontFamily: 'System',
  },
  scoreLabel: {
    fontSize: 9,
    color: '#10B981',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 2,
    fontFamily: 'System',
  },
  explanationBox: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  explanationText: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 16,
    fontStyle: 'italic',
    fontFamily: 'System',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    paddingTop: 12,
    marginTop: 16,
    alignItems: 'flex-end',
  },
  footerLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4F46E5',
    fontFamily: 'System',
  },
  emptyContainer: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'System',
  },
});
