import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Desafio {
  id: number;
  titulo: string;
  descricao: string;
  xp: number;
  concluido: boolean;
  icone: keyof typeof Ionicons.glyphMap;
  corIcone: string;
  actionText?: string;
  routeTarget?: string;
}

const DESAFIOS_INICIAIS: Desafio[] = [
  {
    id: 1,
    titulo: 'Falar com a IA Nexo',
    descricao: 'Tire uma dúvida sobre sua carreira ideal com o mentor inteligente.',
    xp: 20,
    concluido: true,
    icone: 'chatbubble-ellipses-outline',
    corIcone: '#8B5CF6',
  },
  {
    id: 2,
    titulo: 'Explore Tecnologia',
    descricao: 'Visualize os detalhes de pelo menos 2 cursos da área de TI.',
    xp: 30,
    concluido: false,
    icone: 'school-outline',
    corIcone: '#00D4FF',
    actionText: 'Ir para Cursos',
    routeTarget: '/(tabs)/carreiras',
  },
  {
    id: 3,
    titulo: 'Evolua seu Perfil',
    descricao: 'Responda à questão diária de aptidão para impulsionar suas forças.',
    xp: 25,
    concluido: false,
    icone: 'hardware-chip-outline',
    corIcone: '#EC4899',
    actionText: 'Evoluir Perfil',
    routeTarget: '/(tabs)/',
  },
];

export default function PlanosScreen() {
  const router = useRouter();
  const [desafios, setDesafios] = useState<Desafio[]>(DESAFIOS_INICIAIS);

  const handleBack = () => {
    router.back();
  };

  const handleAction = (item: Desafio) => {
    if (item.routeTarget) {
      router.push(item.routeTarget as any);
    }
  };

  const handleClaimReward = (id: number) => {
    setDesafios((prev) =>
      prev.map((d) => (d.id === id ? { ...d, concluido: true } : d))
    );
    Alert.alert('Recompensa Coletada!', 'Você ganhou pontos de XP por completar o desafio!');
  };

  const concluidosCount = desafios.filter((d) => d.concluido).length;
  const totalCount = desafios.length;
  const progressoPct = Math.round((concluidosCount / totalCount) * 100);

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
          <Text style={styles.headerTitleMain}>DESAFIOS DIÁRIOS</Text>
          <Text style={styles.headerSubtitle}>Complete as missões para evoluir de nível!</Text>
        </View>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* ScrollView principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* SEÇÃO 1 — PROGRESS CARD */}
        <View style={styles.progressSection}>
          <LinearGradient
            colors={['#111827', '#1a1040']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.progressCard}
          >
            <View style={styles.progressTextRow}>
              <View>
                <Text style={styles.progressTitle}>Seu progresso de hoje</Text>
                <Text style={styles.progressSub}>
                  {concluidosCount} de {totalCount} desafios concluídos
                </Text>
              </View>
              <View style={styles.xpBonusBadge}>
                <Text style={styles.xpBonusText}>+50 XP BÔNUS</Text>
              </View>
            </View>

            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={['#4F46E5', '#00D4FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${progressoPct}%` }]}
              />
            </View>

            <Text style={styles.progressPercentageText}>{progressoPct}% concluído</Text>
          </LinearGradient>
        </View>

        {/* SEÇÃO 2 — FEED DE DESAFIOS */}
        <View style={styles.challengesContainer}>
          <Text style={styles.sectionTitle}>Missões do dia</Text>

          {desafios.map((item) => (
            <View
              key={item.id}
              style={[
                styles.challengeCard,
                item.concluido && styles.challengeCardCompleted,
              ]}
            >
              {/* Top part: Icon, texts, XP info */}
              <View style={styles.challengeTop}>
                <View style={[styles.iconContainer, { backgroundColor: '#1F2937' }]}>
                  <Ionicons name={item.icone} size={22} color={item.corIcone} />
                </View>

                <View style={styles.challengeTexts}>
                  <Text
                    style={[
                      styles.challengeTitle,
                      item.concluido && styles.challengeTextCompleted,
                    ]}
                  >
                    {item.titulo}
                  </Text>
                  <Text
                    style={[
                      styles.challengeDesc,
                      item.concluido && styles.challengeTextCompleted,
                    ]}
                  >
                    {item.descricao}
                  </Text>
                </View>

                <View style={styles.xpBadge}>
                  <Ionicons name="flash" size={14} color="#F59E0B" />
                  <Text style={styles.xpText}>+{item.xp} XP</Text>
                </View>
              </View>

              {/* Bottom part: Action buttons */}
              <View style={styles.challengeBottom}>
                {item.concluido ? (
                  <View style={styles.completedBadgeRow}>
                    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                    <Text style={styles.completedLabel}>Concluído</Text>
                  </View>
                ) : (
                  <View style={styles.actionsRow}>
                    {item.actionText && (
                      <TouchableOpacity
                        style={styles.actionBtnSecondary}
                        onPress={() => handleAction(item)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.actionBtnSecondaryText}>{item.actionText}</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.actionBtnPrimary}
                      onPress={() => handleClaimReward(item.id)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#6B21A8', '#4F46E5']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientBtn}
                      >
                        <Text style={styles.actionBtnPrimaryText}>Concluir</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
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
    paddingHorizontal: 12,
  },
  headerTitleBrand: {
    fontSize: 20,
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
  headerRightSpacer: {
    width: 38,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  progressCard: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  progressSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    fontFamily: 'System',
  },
  xpBonusBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  xpBonusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#F59E0B',
    fontFamily: 'System',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#1F2937',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentageText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 8,
    fontFamily: 'System',
  },
  challengesContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 14,
    fontFamily: 'System',
  },
  challengeCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 12,
  },
  challengeCardCompleted: {
    opacity: 0.65,
    borderColor: '#1F2937',
  },
  challengeTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeTexts: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  challengeDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 16,
    fontFamily: 'System',
  },
  challengeTextCompleted: {
    color: '#64748B',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  xpText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginLeft: 4,
    fontFamily: 'System',
  },
  challengeBottom: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    alignItems: 'flex-end',
  },
  completedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completedLabel: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtnSecondary: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnSecondaryText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  actionBtnPrimary: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 40,
    width: 90,
  },
  gradientBtn: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
});
