import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Animated,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService, PerfilUsuario } from '../_services/api';

const CURSOS_COMPATIVEIS = [
  { match: '94%', icone: 'hardware-chip-outline', cor: '#8B5CF6', nome: 'Engenharia de Inteligência Artificial', tipo: 'MATCH ALTO' },
  { match: '91%', icone: 'code-slash-outline', cor: '#00D4FF', nome: 'Ciência da Computação', tipo: 'MATCH ALTO' },
  { match: '88%', icone: 'laptop-outline', cor: '#8B5CF6', nome: 'Engenharia de Software', tipo: 'MATCH ALTO' },
  { match: '86%', icone: 'phone-portrait-outline', cor: '#F59E0B', nome: 'Análise e Desenvolvimento de Sistemas', tipo: 'MATCH BOM' },
];

export default function HomeScreen() {
  const router = useRouter();

  // Load session statistics dynamically
  const session = apiService.getSession();
  const user = session.user;

  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [cursos, setCursos] = useState<any[]>([]);
  const [isLoadingCursos, setIsLoadingCursos] = useState(true);

  const userName = perfil ? perfil.nome : (user ? user.username.split('@')[0] : 'Francisco');

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync profile details and courses on screen focus
  useFocusEffect(
    React.useCallback(() => {
      const syncProfileAndCourses = async () => {
        try {
          const pData = await apiService.getPerfil();
          setPerfil(pData);
        } catch (err) {
          console.warn('Failed to sync profile details on home focus:', err);
        }

        try {
          setIsLoadingCursos(true);
          const data = await apiService.getCursos({ limite: 4 });
          setCursos(data);
        } catch (err) {
          console.warn('Failed to fetch courses, falling back to static lists:', err);
          // Fallback mapping matching standard course card shapes
          setCursos(CURSOS_COMPATIVEIS.map((c, i) => ({
            id: i + 1,
            nome: c.nome,
            match: parseInt(c.match),
            icone: c.icone,
            corIcone: c.cor,
            corFundo: '#111827',
            tipo: 'Tecnólogo',
            duracao: '2.5 anos',
            descricao: '',
            tags: ['Tecnologia'],
            tipoMatch: 'MATCH ALTO'
          })));
        } finally {
          setIsLoadingCursos(false);
        }
      };

      syncProfileAndCourses();
    }, [])
  );

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


  const handleNavigatePerfil = () => {
    router.push('/(tabs)/perfil');
  };

  const handleOpenCourseDetails = (curso: any) => {
    router.push({
      pathname: '/(tabs)/curso-detalhes',
      params: { id: curso.id }
    });
  };



  const handleLogout = async () => {
    setIsDrawerOpen(false);
    await apiService.clearSession();
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
          <Text style={styles.headerSubtitle}>Descubra seu futuro profissional</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* SCROLL VIEW (Conteúdo) */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SEÇÃO 1 — CARD DE PERFIL (Sem Gameficação) */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={handleNavigatePerfil}
          activeOpacity={0.8}
        >
          <View style={styles.profileCardLeft}>
            <Ionicons name="person-circle" size={44} color="#4F46E5" />
          </View>

          <View style={styles.profileCardCenter}>
            <Text style={styles.profileCardName}>{userName || 'Estudante'}</Text>
            <Text style={styles.profileCardCourse}>{user?.curso_tecnico || 'Estudante Técnico'}</Text>
          </View>

          <View style={styles.profileCardRight}>
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
              <Text style={styles.objectiveTitle}>{user?.objetivo_carreira || 'Tecnologia'}</Text>
              <Text style={styles.objectiveDesc}>
                Continue aprendendo e evoluindo para alcançar seu objetivo.
              </Text>
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
              onPress={handleNavigateCarreiras}
              activeOpacity={0.8}
            >
              <Ionicons name="school-outline" size={28} color="#00D4FF" />
              <Text style={styles.shortcutTitle}>Explorar cursos</Text>
              <Text style={styles.shortcutDesc}>Descubra opções</Text>
              <Text style={styles.shortcutArrow}>→</Text>
            </TouchableOpacity>

            {/* Shortcut 2 */}
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

          {isLoadingCursos ? (
            <View style={{ height: 160, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#6B21A8" />
              <Text style={{ color: '#94A3B8', marginTop: 10 }}>Calculando matches...</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.coursesCarousel}
            >
              {cursos.map((curso, index) => {
                const matchVal = curso.match_percent || parseInt(curso.match || '50');
                const isHighMatch = matchVal >= 85;
                const typeLabel = isHighMatch ? 'MATCH ALTO' : 'MATCH BOM';
                const iconeName = curso.icone || 'school-outline';
                const iconColor = curso.cor_icone || '#8B5CF6';

                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.courseCard}
                    onPress={() => handleOpenCourseDetails(curso)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.matchBadge,
                        { backgroundColor: isHighMatch ? '#6B21A8' : '#1F2937' },
                      ]}
                    >
                      <Text style={styles.matchBadgeText}>{matchVal}%</Text>
                    </View>

                    <View style={styles.courseIconContainer}>
                      <Ionicons name={iconeName as any} size={36} color={iconColor} />
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
                        {typeLabel}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Paginação */}
          <View style={styles.paginationDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
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
                <Ionicons name="person-circle" size={54} color="#4F46E5" />
              </View>
              <Text style={styles.drawerProfileName}>{userName}</Text>
              <Text style={styles.drawerProfileSub}>{user?.curso_tecnico || 'Estudante Técnico'}</Text>
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


              <View style={styles.drawerDivider} />

              <TouchableOpacity
                style={styles.drawerLinkRow}
                onPress={() => {
                  setIsDrawerOpen(false);
                  router.push('/configuracoes');
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
  profileCard: {
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
  profileCardLeft: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCardCenter: {
    flex: 1,
    marginLeft: 12,
  },
  profileCardName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'System',
  },
  profileCardCourse: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
    fontFamily: 'System',
  },
  profileCardRight: {
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
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  drawerProfileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  drawerProfileSub: {
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
  fullWidthShortcutCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  fullWidthShortcutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  fullWidthTextContainer: {
    justifyContent: 'center',
  },
});