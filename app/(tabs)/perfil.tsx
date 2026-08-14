import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
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
  const userLevel = perfil ? perfil.nivel.numero : (user ? user.nivel : 1);
  const userXp = perfil ? perfil.nivel.progresso : 0;
  const progressoGeral = perfil ? perfil.progresso_geral : 0;

  const handleBack = () => {
    router.back();
  };

  const calcLargura = (valor: number) => {
    return `${valor}%` as any;
  };

  const getLevelLabelName = (level: number) => {
    switch (level) {
      case 0: return 'Iniciante';
      case 1: return 'Despertado';
      case 2: return 'Super Nexo 1';
      case 3: return 'Super Nexo 2';
      case 4: return 'Super Nexo Blue';
      default: return 'Além do Limite';
    }
  };

  const levelName = getLevelLabelName(userLevel);

  const getLevelDescription = (level: number) => {
    switch (level) {
      case 0: return 'Você está dando seus primeiros passos na sua jornada profissional.';
      case 1: return 'Você começa a entender seu potencial e as áreas mais compatíveis.';
      case 2: return 'Você está evoluindo rápido e acumulando forças técnicas.';
      case 3: return 'Seu conhecimento está se consolidando e você se aproxima do mercado.';
      case 4: return 'Você já domina as principais habilidades e está pronto para voar alto.';
      default: return 'Você superou todos os limites e é um mentor de carreira Nexo!';
    }
  };

  const levelDesc = getLevelDescription(userLevel);

  const getLevelImage = (nivel: number) => {
    switch (nivel) {
      case 0:
        return require('../../assets/images/nivel 0 iniciante.png');
      case 1:
        return require('../../assets/images/nivel 1 despertado.png');
      case 2:
        return require('../../assets/images/nivel 2 super nexo 1.png');
      case 3:
        return require('../../assets/images/nivel 3 super nexo 2.png');
      case 4:
        return require('../../assets/images/nivel 4 super nexo blue.png');
      case 5:
        return require('../../assets/images/nivel 5 alem do limite.png');
      default:
        return require('../../assets/images/nivel 1 despertado.png');
    }
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

  const dynamicNiveis = [
    { nivel: 0, nome: 'Iniciante', progresso: userLevel > 0 ? '100%' : (userLevel === 0 ? `${userXp}%` : '0%'), bloqueado: userLevel < 0, ativo: userLevel === 0 },
    { nivel: 1, nome: 'Despertado', progresso: userLevel > 1 ? '100%' : (userLevel === 1 ? `${userXp}%` : '0%'), bloqueado: userLevel < 1, ativo: userLevel === 1 },
    { nivel: 2, nome: 'Super Nexo 1', progresso: userLevel > 2 ? '100%' : (userLevel === 2 ? `${userXp}%` : '0%'), bloqueado: userLevel < 2, ativo: userLevel === 2 },
    { nivel: 3, nome: 'Super Nexo 2', progresso: userLevel > 3 ? '100%' : (userLevel === 3 ? `${userXp}%` : '0%'), bloqueado: userLevel < 3, ativo: userLevel === 3 },
    { nivel: 4, nome: 'Super Nexo Blue', progresso: userLevel > 4 ? '100%' : (userLevel === 4 ? `${userXp}%` : '0%'), bloqueado: userLevel < 4, ativo: userLevel === 4 },
    { nivel: 5, nome: 'Além do Limite', progresso: userLevel > 5 ? '100%' : (userLevel === 5 ? `${userXp}%` : '0%'), bloqueado: userLevel < 5, ativo: userLevel === 5 },
  ];


  return (
    <SafeAreaView style={styles.safeArea}>
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
          <Text style={styles.headerTitleMain}>SUA EVOLUÇÃO</Text>
          <Text style={styles.headerSubtitle}>Responda às perguntas e evolua seu nível!</Text>
        </View>

        <View style={styles.headerRightCard}>
          <Image
            source={getLevelImage(userLevel)}
            style={styles.headerAvatar}
          />
          <View style={styles.headerLevelColumn}>
            <Text style={styles.headerLevelLabel}>NÍVEL {userLevel}</Text>
            <Text style={styles.headerLevelName}>{levelName}</Text>
          </View>
        </View>
      </View>

      {/* Conteúdo com ScrollView */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* SEÇÃO 1 — CARROSSEL DE NÍVEIS */}
        <View style={styles.levelsCarouselContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.levelsCarouselScroll}
          >
            {dynamicNiveis.map((nv, index) => {
              if (nv.ativo) {
                // Active Card (Level 1)
                return (
                  <View key={index} style={styles.levelCardActive}>
                    <View style={styles.imageWrapper}>
                      <Image
                        source={getLevelImage(nv.nivel)}
                        style={styles.levelImage}
                        resizeMode="cover"
                      />
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>{nv.progresso}</Text>
                      </View>
                    </View>
                    <View style={styles.levelCardFooter}>
                      <Text style={styles.levelLabel}>NÍVEL {nv.nivel}</Text>
                      <Text style={styles.levelNameText}>{nv.nome}</Text>
                    </View>
                  </View>
                );
              }

              if (!nv.bloqueado) {
                // Unlocked Card (Level 0)
                return (
                  <View key={index} style={styles.levelCardUnlocked}>
                    <View style={styles.imageWrapper}>
                      <Image
                        source={getLevelImage(nv.nivel)}
                        style={styles.levelImage}
                        resizeMode="cover"
                      />
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>{nv.progresso}</Text>
                      </View>
                    </View>
                    <View style={styles.levelCardFooter}>
                      <Text style={styles.levelLabel}>NÍVEL {nv.nivel}</Text>
                      <Text style={styles.levelNameText}>{nv.nome}</Text>
                    </View>
                  </View>
                );
              }

              // Locked Card (Levels 2 to 5)
              return (
                <View key={index} style={styles.levelCardLocked}>
                  <View style={styles.imageWrapper}>
                    <Image
                      source={getLevelImage(nv.nivel)}
                      style={[styles.levelImage, styles.levelImageLocked]}
                      resizeMode="cover"
                    />
                    <View style={styles.lockIconContainer}>
                      <Ionicons name="lock-closed-outline" size={16} color="#94A3B8" />
                    </View>
                    <View style={styles.levelBadgeLocked}>
                      <Text style={styles.levelBadgeTextLocked}>{nv.progresso}</Text>
                    </View>
                  </View>
                  <View style={styles.levelCardFooter}>
                    <Text style={styles.levelLabelLocked}>NÍVEL {nv.nivel}</Text>
                    <Text style={styles.levelNameTextLocked}>{nv.nome}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* SEÇÃO 2 — CARD DO NÍVEL ATUAL */}
        <View style={styles.currentLevelSection}>
          <View style={styles.currentLevelCard}>
            <View style={styles.currentLevelImageContainer}>
              <Image
                source={getLevelImage(userLevel)}
                style={styles.currentLevelImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.currentLevelTextsContainer}>
              <Text style={styles.currentLevelTag}>NÍVEL {userLevel}</Text>
              <Text style={styles.currentLevelName}>{levelName}</Text>
              <Text style={styles.currentLevelDesc}>
                {levelDesc}
              </Text>

              <View style={styles.currentLevelProgressBadge}>
                <Ionicons name="flash" size={14} color="#F59E0B" />
                <Text style={styles.currentLevelProgressText}>Progresso {userXp}% ({user?.xp ?? 0} XP)</Text>
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
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  headerLevelColumn: {
    justifyContent: 'center',
  },
  headerLevelLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  headerLevelName: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  levelsCarouselContainer: {
    marginTop: 20,
  },
  levelsCarouselScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  levelCardActive: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#4F46E5',
    borderRadius: 16,
    overflow: 'hidden',
    width: 110,
  },
  levelCardUnlocked: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 16,
    overflow: 'hidden',
    width: 110,
  },
  levelCardLocked: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 16,
    overflow: 'hidden',
    width: 110,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 130,
  },
  levelImage: {
    width: '100%',
    height: '100%',
  },
  levelImageLocked: {
    opacity: 0.35,
  },
  levelBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  levelBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  levelBadgeLocked: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  levelBadgeTextLocked: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  lockIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  levelCardFooter: {
    padding: 8,
  },
  levelLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    fontFamily: 'System',
  },
  levelNameText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
    fontFamily: 'System',
  },
  levelLabelLocked: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    fontFamily: 'System',
  },
  levelNameTextLocked: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    marginTop: 2,
    fontFamily: 'System',
  },
  currentLevelSection: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  currentLevelCard: {
    backgroundColor: '#111827',
    borderRadius: 20,
    overflow: 'hidden',
    height: 200,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  currentLevelImageContainer: {
    width: '45%',
    height: '100%',
    position: 'relative',
  },
  currentLevelImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  currentLevelTextsContainer: {
    width: '55%',
    padding: 20,
    justifyContent: 'center',
  },
  currentLevelTag: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
    fontFamily: 'System',
  },
  currentLevelName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
    fontFamily: 'System',
  },
  currentLevelDesc: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 8,
    lineHeight: 20,
    fontFamily: 'System',
  },
  currentLevelProgressBadge: {
    backgroundColor: '#1F2937',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    alignSelf: 'flex-start',
  },
  currentLevelProgressText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
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
