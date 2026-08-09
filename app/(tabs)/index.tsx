import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService } from '../_services/api';

const CURSOS_COMPATIVEIS = [
  { match: '94%', icone: 'hardware-chip-outline', cor: '#8B5CF6', nome: 'Engenharia de Inteligência Artificial', tipo: 'MATCH ALTO' },
  { match: '91%', icone: 'code-slash-outline', cor: '#00D4FF', nome: 'Ciência da Computação', tipo: 'MATCH ALTO' },
  { match: '88%', icone: 'laptop-outline', cor: '#8B5CF6', nome: 'Engenharia de Software', tipo: 'MATCH ALTO' },
  { match: '86%', icone: 'phone-portrait-outline', cor: '#F59E0B', nome: 'Análise e Desenvolvimento de Sistemas', tipo: 'MATCH BOM' },
];

const QUIZ_OPTIONS = [
  { id: 'a', label: 'Cloud Computing (Nuvem)' },
  { id: 'b', label: 'Cyber Security (Segurança)' }, // Correct answer
  { id: 'c', label: 'Web Development (Web)' },
  { id: 'd', label: 'Database Administration (Banco de Dados)' },
];

export default function HomeScreen() {
  const router = useRouter();

  // Load session statistics dynamically
  const session = apiService.getSession();
  const user = session.user;
  const userName = user ? user.username.split('@')[0] : 'Francisco';
  const userLevel = user ? user.nivel : 1;
  const userXp = user ? user.xp : 40; // Default placeholder

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

  // Drawer and Quiz states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  // Animated drawer slide-in value
  const drawerSlideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    if (isDrawerOpen) {
      Animated.timing(drawerSlideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(drawerSlideAnim, {
        toValue: -300,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [isDrawerOpen, drawerSlideAnim]);

  const handleNavigateCarreiras = () => {
    router.push('/(tabs)/carreiras');
  };

  const handleNavigateChat = () => {
    router.push('/(tabs)/chat');
  };

  const handleNavigatePlano = () => {
    router.push('/(tabs)/planos');
  };

  const handleNavigatePerfil = () => {
    router.push('/(tabs)/perfil');
  };

  const handleOpenQuiz = () => {
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setIsCorrectAnswer(false);
    setIsQuizOpen(true);
  };

  const handleCloseQuiz = () => {
    setIsQuizOpen(false);
  };

  const handleSubmitQuiz = async () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === 'b';
    setIsCorrectAnswer(correct);
    setQuizSubmitted(true);

    if (correct) {
      // Award XP on Django Backend
      try {
        if (session.user) {
          await apiService.updateProfile(15);
        }
      } catch (err) {
        console.error('Failed to sync XP with backend:', err);
      }

      Alert.alert(
        'Resposta Correta! 🎉',
        '+15 XP obtido! Seu perfil lógico e forças de segurança cibernética subiram de nível.',
        [{ text: 'Ver Evolução', onPress: () => { setIsQuizOpen(false); router.push('/(tabs)/perfil'); } }]
      );
    } else {
      Alert.alert(
        'Quase lá!',
        'Essa não é a resposta correta. Tente novamente para ganhar o XP de evolução!',
        [{ text: 'Tentar Novamente', onPress: () => setQuizSubmitted(false) }]
      );
    }
  };

  const handleLogout = () => {
    setIsDrawerOpen(false);
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#0A0F1E" />

      {/* CABEÇALHO (Fixo no topo) */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setIsDrawerOpen(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="menu-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerGreeting}>Olá, {userName}!</Text>
          <Text style={styles.headerSubtitle}>Pronto para evoluir hoje?</Text>
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => Alert.alert('Notificações', 'Sem notificações pendentes.')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* SCROLL VIEW (Conteúdo) */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SEÇÃO 1 — CARD DE NÍVEL */}
        <TouchableOpacity
          style={styles.levelCard}
          onPress={handleNavigatePerfil}
          activeOpacity={0.8}
        >
          <View style={styles.levelCardLeft}>
            <Image
              source={require('../../assets/images/nivel 1 despertado.png')}
              style={styles.levelAvatar}
            />
          </View>

          <View style={styles.levelCardCenter}>
            <Text style={styles.levelLabel}>NÍVEL {userLevel}</Text>
            <Text style={styles.levelName}>{levelName}</Text>
            <View style={styles.levelProgressBg}>
              <LinearGradient
                colors={['#4F46E5', '#00D4FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.levelProgressFill, { width: `${userXp % 100 || 40}%` }]}
              />
            </View>
            <Text style={styles.levelProgressText}>Progresso {userXp % 100 || 40}% ⚡</Text>
          </View>

          <View style={styles.levelCardRight}>
            <Ionicons name="chevron-forward" size={20} color="#4F46E5" />
          </View>
        </TouchableOpacity>

        {/* SEÇÃO 2 — BANNER OBJETIVO ATUAL */}
        <View style={styles.objectiveBanner}>
          <LinearGradient
            colors={['#111827', '#1a1040']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.objectiveGradient}
          >
            <View style={styles.objectiveLeft}>
              <Text style={styles.objectiveTag}>Seu objetivo atual</Text>
              <Text style={styles.objectiveLabel}>Quero trabalhar com</Text>
              <Text style={styles.objectiveTitle}>Inteligência Artificial</Text>
              <Text style={styles.objectiveDesc}>
                Continue aprendendo e evoluindo para alcançar seu objetivo.
              </Text>
              <TouchableOpacity
                style={styles.objectiveButton}
                onPress={handleNavigatePerfil}
                activeOpacity={0.8}
              >
                <Text style={styles.objectiveButtonText}>Ver meu progresso →</Text>
              </TouchableOpacity>
            </View>

            <Image
              source={require('../../assets/images/icone tela de cadastro e home.png')}
              style={styles.objectiveImage}
              resizeMode="contain"
            />
          </LinearGradient>
        </View>

        {/* SEÇÃO 3 — ATALHOS RÁPIDOS */}
        <View style={styles.shortcutsSection}>
          <Text style={styles.sectionHeading}>O que você quer fazer agora?</Text>

          <View style={styles.gridRow}>
            {/* Shortcut 1 */}
            <TouchableOpacity
              style={styles.shortcutCard}
              onPress={handleOpenQuiz}
              activeOpacity={0.8}
            >
              <Ionicons name="hardware-chip-outline" size={28} color="#8B5CF6" />
              <Text style={styles.shortcutTitle}>Responder perguntas</Text>
              <Text style={styles.shortcutDesc}>Evolua seu perfil</Text>
              <Text style={styles.shortcutArrow}>→</Text>
            </TouchableOpacity>

            {/* Shortcut 2 */}
            <TouchableOpacity
              style={styles.shortcutCard}
              onPress={handleNavigateCarreiras}
              activeOpacity={0.8}
            >
              <Ionicons name="school-outline" size={28} color="#00D4FF" />
              <Text style={styles.shortcutTitle}>Explorar cursos</Text>
              <Text style={styles.shortcutDesc}>Descubra opções</Text>
              <Text style={styles.shortcutArrow}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            {/* Shortcut 3 */}
            <TouchableOpacity
              style={styles.shortcutCard}
              onPress={handleNavigateChat}
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={28} color="#8B5CF6" />
              <Text style={styles.shortcutTitle}>Falar com a IA Nexo</Text>
              <Text style={styles.shortcutDesc}>Tire dúvidas</Text>
              <Text style={styles.shortcutArrow}>→</Text>
            </TouchableOpacity>

            {/* Shortcut 4 */}
            <TouchableOpacity
              style={styles.shortcutCard}
              onPress={handleNavigatePlano}
              activeOpacity={0.8}
            >
              <Ionicons name="trophy-outline" size={28} color="#00D4FF" />
              <Text style={styles.shortcutTitle}>Ver desafios diários</Text>
              <Text style={styles.shortcutDesc}>Ganhe XP</Text>
              <Text style={styles.shortcutArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SEÇÃO 4 — CURSOS COMPATÍVEIS */}
        <View style={styles.coursesSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Cursos mais compatíveis com você</Text>
            <TouchableOpacity onPress={handleNavigateCarreiras} activeOpacity={0.7}>
              <Text style={styles.seeAllLink}>Ver todos ›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.coursesCarousel}
          >
            {CURSOS_COMPATIVEIS.map((curso, index) => {
              const isHighMatch = curso.tipo === 'MATCH ALTO';
              return (
                <View key={index} style={styles.courseCard}>
                  <View
                    style={[
                      styles.matchBadge,
                      { backgroundColor: isHighMatch ? '#6B21A8' : '#1F2937' },
                    ]}
                  >
                    <Text style={styles.matchBadgeText}>{curso.match}</Text>
                  </View>

                  <View style={styles.courseIconContainer}>
                    <Ionicons name={curso.icone as any} size={36} color={curso.cor} />
                  </View>

                  <Text style={styles.courseName}>{curso.nome}</Text>

                  <View
                    style={[
                      styles.matchTypeBadge,
                      { backgroundColor: isHighMatch ? '#1a2a4a' : '#2a1f00' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.matchTypeText,
                        { color: isHighMatch ? '#00D4FF' : '#F59E0B' },
                      ]}
                    >
                      {curso.tipo}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Paginação */}
          <View style={styles.paginationDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* SEÇÃO 5 — RESUMO DE HOJE */}
        <View style={styles.summarySection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Seu resumo de hoje</Text>
            <TouchableOpacity onPress={handleNavigatePerfil} activeOpacity={0.7}>
              <Text style={styles.seeAllLink}>Ver detalhes ›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryCard}>
            {/* Coluna 1 — XP */}
            <View style={styles.summaryColumn}>
              <View style={styles.summaryLabelRow}>
                <Ionicons name="flash" size={14} color="#F59E0B" style={styles.summaryLabelIcon} />
                <Text style={styles.summaryLabel}>XP ganho</Text>
              </View>
              <Text style={styles.summaryValue}>120 XP</Text>
              <View style={styles.summaryProgressBg}>
                <LinearGradient
                  colors={['#4F46E5', '#00D4FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.summaryProgressFill, { width: '60%' }]}
                />
              </View>
              <Text style={styles.summarySubtext}>Falta 80 XP para o próximo nível</Text>
            </View>

            <View style={styles.verticalDivider} />

            {/* Coluna 2 — Respostas */}
            <View style={styles.summaryColumn}>
              <View style={styles.summaryLabelRow}>
                <Ionicons name="document-text-outline" size={14} color="#4F46E5" style={styles.summaryLabelIcon} />
                <Text style={styles.summaryLabel}>Respostas</Text>
              </View>
              <Text style={styles.summaryValue}>12</Text>
              <View style={styles.summaryProgressBg}>
                <View style={[styles.summaryProgressFillText, { width: '70%', backgroundColor: '#4F46E5' }]} />
              </View>
              <Text style={styles.summarySubtext}>Mais 8 para a meta de hoje</Text>
            </View>

            <View style={styles.verticalDivider} />

            {/* Coluna 3 — Sequência */}
            <View style={styles.summaryColumn}>
              <View style={styles.summaryLabelRow}>
                <Ionicons name="flame" size={14} color="#F97316" style={styles.summaryLabelIcon} />
                <Text style={styles.summaryLabel}>Sequência</Text>
              </View>
              <Text style={styles.summaryValue}>3 dias</Text>
              <View style={styles.summaryProgressBg}>
                <View style={[styles.summaryProgressFillText, { width: '40%', backgroundColor: '#F97316' }]} />
              </View>
              <Text style={styles.summarySubtext}>Continue assim!</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* MODAL SIDE DRAWER (Menu Hambúrguer) */}
      <Modal
        visible={isDrawerOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDrawerOpen(false)}
      >
        <TouchableOpacity
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPress={() => setIsDrawerOpen(false)}
        >
          <Animated.View
            style={[
              styles.drawerContent,
              { transform: [{ translateX: drawerSlideAnim }] },
            ]}
          >
            {/* Drawer profile Header */}
            <View style={styles.drawerProfileHeader}>
              <View style={styles.drawerProfileAvatarContainer}>
                <Image
                  source={require('../../assets/images/nivel 1 despertado.png')}
                  style={styles.drawerAvatar}
                />
              </View>
              <Text style={styles.drawerProfileName}>{userName}</Text>
              <Text style={styles.drawerProfileLevel}>Nível {userLevel} • {levelName}</Text>
            </View>

            {/* Drawer Menu links */}
            <View style={styles.drawerLinksContainer}>
              <TouchableOpacity
                style={styles.drawerLinkRow}
                onPress={() => {
                  setIsDrawerOpen(false);
                  router.push('/(tabs)/perfil');
                }}
              >
                <Ionicons name="person-outline" size={20} color="#94A3B8" />
                <Text style={styles.drawerLinkLabel}>Meu Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerLinkRow}
                onPress={() => {
                  setIsDrawerOpen(false);
                  router.push('/(tabs)/carreiras');
                }}
              >
                <Ionicons name="school-outline" size={20} color="#94A3B8" />
                <Text style={styles.drawerLinkLabel}>Cursos Compatíveis</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerLinkRow}
                onPress={() => {
                  setIsDrawerOpen(false);
                  router.push('/(tabs)/chat');
                }}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#94A3B8" />
                <Text style={styles.drawerLinkLabel}>Mentoria IA</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerLinkRow}
                onPress={() => {
                  setIsDrawerOpen(false);
                  router.push('/(tabs)/planos');
                }}
              >
                <Ionicons name="trophy-outline" size={20} color="#94A3B8" />
                <Text style={styles.drawerLinkLabel}>Desafios Diários</Text>
              </TouchableOpacity>

              <View style={styles.drawerDivider} />

              <TouchableOpacity
                style={styles.drawerLinkRow}
                onPress={() => {
                  setIsDrawerOpen(false);
                  Alert.alert('Configurações', 'Área de configurações simulada!');
                }}
              >
                <Ionicons name="settings-outline" size={20} color="#94A3B8" />
                <Text style={styles.drawerLinkLabel}>Configurações</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.drawerLinkRow, styles.drawerLinkRowExit]}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text style={styles.drawerLinkLabelExit}>Sair da Conta</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL INTERATIVO QUIZ DIÁRIO (Evolução de Perfil) */}
      <Modal
        visible={isQuizOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseQuiz}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseQuiz}
        >
          <View style={styles.quizCard}>
            {/* Header */}
            <View style={styles.quizHeaderRow}>
              <View style={styles.quizTitleBadge}>
                <Ionicons name="hardware-chip-outline" size={16} color="#8B5CF6" />
                <Text style={styles.quizTitleBadgeText}>EVOLUA SEU PERFIL</Text>
              </View>
              <TouchableOpacity onPress={handleCloseQuiz} style={styles.quizCloseBtn}>
                <Ionicons name="close" size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <Text style={styles.quizSubtitle}>Questão Diária de Lógica & Tech</Text>
            <Text style={styles.quizQuestion}>
              Qual das seguintes áreas de tecnologia foca principalmente na proteção de sistemas, redes e dados contra ataques digitais?
            </Text>

            {/* Options */}
            <View style={styles.quizOptionsList}>
              {QUIZ_OPTIONS.map((opt) => {
                const isSelected = selectedAnswer === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.quizOptionRow,
                      isSelected && styles.quizOptionRowSelected,
                    ]}
                    onPress={() => {
                      if (!quizSubmitted) setSelectedAnswer(opt.id);
                    }}
                    disabled={quizSubmitted && isCorrectAnswer}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.quizRadioCircle,
                        isSelected && styles.quizRadioCircleSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.quizRadioInnerCircle} />}
                    </View>
                    <Text
                      style={[
                        styles.quizOptionLabel,
                        isSelected && styles.quizOptionLabelSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Bottom Button */}
            <TouchableOpacity
              style={[styles.quizSubmitBtn, !selectedAnswer && styles.quizSubmitBtnDisabled]}
              onPress={handleSubmitQuiz}
              disabled={!selectedAnswer || (quizSubmitted && isCorrectAnswer)}
              activeOpacity={0.8}
            >
              {selectedAnswer && !(quizSubmitted && isCorrectAnswer) ? (
                <LinearGradient
                  colors={['#6B21A8', '#4F46E5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.quizSubmitGradient}
                >
                  <Text style={styles.quizSubmitBtnText}>Enviar Resposta</Text>
                </LinearGradient>
              ) : (
                <View style={styles.quizSubmitDisabledContent}>
                  <Text style={styles.quizSubmitBtnTextDisabled}>
                    {quizSubmitted && isCorrectAnswer ? 'Correto ✓' : 'Enviar Resposta'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  headerButton: {
    width: 40,
    height: 40,
    backgroundColor: '#1F2937',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerGreeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
    fontFamily: 'System',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  levelCardLeft: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#6B21A8',
  },
  levelCardCenter: {
    flex: 1,
    marginLeft: 12,
  },
  levelLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.5,
    fontFamily: 'System',
  },
  levelName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    fontFamily: 'System',
  },
  levelProgressBg: {
    height: 6,
    backgroundColor: '#1F2937',
    borderRadius: 3,
    overflow: 'hidden',
  },
  levelProgressFill: {
    width: '40%',
    height: '100%',
    borderRadius: 3,
  },
  levelProgressText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
    fontFamily: 'System',
  },
  levelCardRight: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
  objectiveBanner: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
    height: 180,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  objectiveGradient: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  objectiveLeft: {
    width: '60%',
    padding: 20,
    justifyContent: 'center',
  },
  objectiveTag: {
    fontSize: 12,
    color: '#00D4FF',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontFamily: 'System',
  },
  objectiveLabel: {
    fontSize: 15,
    color: '#FFFFFF',
    marginTop: 4,
    fontFamily: 'System',
  },
  objectiveTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#4F46E5',
    marginTop: 2,
    fontFamily: 'System',
  },
  objectiveDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
    lineHeight: 16,
    fontFamily: 'System',
  },
  objectiveButton: {
    backgroundColor: '#6B21A8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  objectiveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'System',
  },
  objectiveImage: {
    position: 'absolute',
    right: -10,
    bottom: 0,
    height: '100%',
    width: '44%',
  },
  shortcutsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeading: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'System',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  shortcutTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    fontFamily: 'System',
  },
  shortcutDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontFamily: 'System',
  },
  shortcutArrow: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginTop: 8,
  },
  coursesSection: {
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  seeAllLink: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '600',
    fontFamily: 'System',
  },
  coursesCarousel: {
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 12,
  },
  courseCard: {
    width: 140,
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    alignItems: 'center',
  },
  matchBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  matchBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  courseIconContainer: {
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
    height: 36,
    fontFamily: 'System',
  },
  matchTypeBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 10,
  },
  matchTypeText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'System',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1F2937',
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
  },
  summarySection: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 20,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  summaryColumn: {
    flex: 1,
    paddingHorizontal: 4,
  },
  summaryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryLabelIcon: {
    marginRight: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    fontFamily: 'System',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    fontFamily: 'System',
  },
  summaryProgressBg: {
    height: 4,
    backgroundColor: '#1F2937',
    borderRadius: 2,
    overflow: 'hidden',
  },
  summaryProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  summaryProgressFillText: {
    height: '100%',
    borderRadius: 2,
  },
  summarySubtext: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 4,
    fontFamily: 'System',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#1F2937',
    marginHorizontal: 8,
  },
  // DRAWER MENU STYLES
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-start',
  },
  drawerContent: {
    width: '75%',
    height: '100%',
    backgroundColor: '#0A0F1E',
    borderRightWidth: 1,
    borderRightColor: '#1F2937',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  drawerProfileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  drawerProfileAvatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#4F46E5',
    overflow: 'hidden',
    marginBottom: 12,
  },
  drawerAvatar: {
    width: '100%',
    height: '100%',
  },
  drawerProfileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  drawerProfileLevel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    fontFamily: 'System',
  },
  drawerLinksContainer: {
    flex: 1,
  },
  drawerLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  drawerLinkLabel: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '600',
    fontFamily: 'System',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#1F2937',
    marginVertical: 16,
  },
  drawerLinkRowExit: {
    marginTop: 'auto',
    marginBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  drawerLinkLabelExit: {
    fontSize: 15,
    color: '#EF4444',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  // QUIZ MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizCard: {
    width: '90%',
    backgroundColor: '#111827',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 20,
  },
  quizHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quizTitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  quizTitleBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#8B5CF6',
    fontFamily: 'System',
  },
  quizCloseBtn: {
    padding: 4,
  },
  quizSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
    fontFamily: 'System',
  },
  quizQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: 'System',
  },
  quizOptionsList: {
    gap: 10,
    marginBottom: 24,
  },
  quizOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  quizOptionRowSelected: {
    borderColor: '#6B21A8',
    backgroundColor: '#2D1B69',
  },
  quizRadioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#64748B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizRadioCircleSelected: {
    borderColor: '#00D4FF',
  },
  quizRadioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00D4FF',
  },
  quizOptionLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
    fontFamily: 'System',
  },
  quizOptionLabelSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  quizSubmitBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    height: 52,
  },
  quizSubmitBtnDisabled: {
    opacity: 0.5,
  },
  quizSubmitGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizSubmitDisabledContent: {
    flex: 1,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  quizSubmitBtnTextDisabled: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
});