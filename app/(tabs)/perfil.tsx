import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const DADOS_NIVEIS = [
  { nivel: 0, nome: 'Iniciante', progresso: '20%', bloqueado: false },
  { nivel: 1, nome: 'Despertado', progresso: '40%', bloqueado: false, ativo: true },
  { nivel: 2, nome: 'Super Nexo 1', progresso: '60%', bloqueado: true },
  { nivel: 3, nome: 'Super Nexo 2', progresso: '80%', bloqueado: true },
  { nivel: 4, nome: 'Super Nexo Blue', progresso: '100%', bloqueado: true },
  { nivel: 5, nome: 'Além do Limite', progresso: '100%+', bloqueado: true },
];

const DADOS_FORCAS = [
  { icone: 'calculator-outline', nome: 'Lógica', valor: 80 },
  { icone: 'color-palette-outline', nome: 'Criatividade', valor: 70 },
  { icone: 'eye-outline', nome: 'Foco', valor: 65 },
  { icone: 'chatbubble-outline', nome: 'Comunicação', valor: 40 },
  { icone: 'star-outline', nome: 'Liderança', valor: 30 },
];

const DADOS_DISCIPLINAS = [
  { icone: 'grid-outline', nome: 'Matemática', valor: 72 },
  { icone: 'flask-outline', nome: 'Física', valor: 45 },
  { icone: 'code-slash-outline', nome: 'Programação', valor: 60 },
  { icone: 'pencil-outline', nome: 'Desenho', valor: 68 },
  { icone: 'book-outline', nome: 'Português', valor: 35 },
];

export default function PerfilScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const calcLargura = (valor: number) => {
    return `${valor}%` as any;
  };

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
            source={require('../../assets/images/nexo-avatar.png')}
            style={styles.headerAvatar}
          />
          <View style={styles.headerLevelColumn}>
            <Text style={styles.headerLevelLabel}>NÍVEL 1</Text>
            <Text style={styles.headerLevelName}>Despertado</Text>
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
            {DADOS_NIVEIS.map((nv, index) => {
              if (nv.ativo) {
                // Active Card (Level 1)
                return (
                  <View key={index} style={styles.levelCardActive}>
                    <View style={styles.imageWrapper}>
                      <Image
                        source={require('../../assets/images/nivel 1 despertado.png')}
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
                        source={require('../../assets/images/nivel 0 iniciante.png')}
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
                      source={require('../../assets/images/icone tela de cadastro e home.png')}
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
                source={require('../../assets/images/nivel 1 despertado.png')}
                style={styles.currentLevelImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.currentLevelTextsContainer}>
              <Text style={styles.currentLevelTag}>NÍVEL 1</Text>
              <Text style={styles.currentLevelName}>Despertado</Text>
              <Text style={styles.currentLevelDesc}>
                Você começa a entender seu potencial.
              </Text>

              <View style={styles.currentLevelProgressBadge}>
                <Ionicons name="flash" size={14} color="#F59E0B" />
                <Text style={styles.currentLevelProgressText}>Progresso 40%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SEÇÃO 3 — PROGRESSO GERAL */}
        <View style={styles.overallProgressSection}>
          <View style={styles.overallProgressCard}>
            <View style={styles.overallProgressHeader}>
              <Text style={styles.overallProgressTitle}>SEU PROGRESSO GERAL</Text>
              <Text style={styles.overallProgressValue}>58% concluído</Text>
            </View>

            <View style={styles.overallProgressBg}>
              <LinearGradient
                colors={['#4F46E5', '#00D4FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.overallProgressFill, { width: calcLargura(58) }]}
              />
            </View>
          </View>
        </View>

        {/* SEÇÃO 4 — FORÇAS E DISCIPLINAS */}
        <View style={styles.statsSection}>
          <View style={styles.statsGridRow}>
            {/* Card SUAS FORÇAS */}
            <View style={styles.statCard}>
              <Text style={styles.statCardTitlePurple}>SUAS FORÇAS</Text>
              <View style={styles.statItemsList}>
                {DADOS_FORCAS.map((item, index) => (
                  <View key={index} style={styles.statItemRow}>
                    <Ionicons name={item.icone as any} size={16} color="#94A3B8" style={styles.statIcon} />
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
                {DADOS_DISCIPLINAS.map((item, index) => (
                  <View key={index} style={styles.statItemRow}>
                    <Ionicons name={item.icone as any} size={16} color="#94A3B8" style={styles.statIcon} />
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
