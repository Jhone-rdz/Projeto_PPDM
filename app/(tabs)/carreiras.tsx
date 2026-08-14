import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService, PerfilUsuario } from '../_services/api';

const DADOS_CURSOS = [
  {
    id: 1,
    tipo: 'BACHARELADO',
    duracao: '5 anos',
    nome: 'Engenharia de Inteligência Artificial',
    descricao: 'Foco no desenvolvimento de algoritmos e sistemas autônomos. Combina matemática, programação e ciência de dados.',
    tags: ['Algoritmos de ML', 'Visão computacional', 'Sistemas autônomos'],
    match: '94%',
    icone: 'hardware-chip-outline',
    corIcone: '#8B5CF6',
    corFundo: '#2D1B69',
  },
  {
    id: 2,
    tipo: 'BACHARELADO',
    duracao: '4 anos',
    nome: 'Ciência da Computação',
    descricao: 'Base profunda em algoritmos, estruturas de dados e teoria da computação. Essencial para criação de softwares e plataformas digitais.',
    tags: ['Algoritmos', 'Sistemas distribuídos', 'Pesquisa'],
    match: '91%',
    icone: 'code-slash-outline',
    corIcone: '#10B981',
    corFundo: '#064E3B',
  },
  {
    id: 3,
    tipo: 'BACHARELADO',
    duracao: '5 anos',
    nome: 'Engenharia de Software',
    descricao: 'Projeto, arquitetura e qualidade de sistemas em larga escala. Forte integração entre lógica e criatividade.',
    tags: ['Arquitetura', 'DevOps', 'Qualidade de Software'],
    match: '88%',
    icone: 'laptop-outline',
    corIcone: '#FFFFFF',
    corFundo: '#4F46E5',
  },
  {
    id: 4,
    tipo: 'TECNÓLOGO',
    duracao: '2,5 anos',
    nome: 'Análise e Desenvolvimento de Sistemas (ADS)',
    descricao: 'Tecnólogo com alta empregabilidade e foco em desenvolvimento web e mobile.',
    tags: ['Desenvolvimento Web', 'Mobile', 'Banco de dados'],
    match: '86%',
    icone: 'phone-portrait-outline',
    corIcone: '#FFFFFF',
    corFundo: '#F59E0B',
  },
];

type AreaType = 'tecnologia' | 'saude' | 'negocios';

interface CursoItem {
  id: number;
  tipo: string;
  duracao: string;
  nome: string;
  descricao: string;
  tags: string[];
  match: string;
  icone: string;
  corIcone: string;
  corFundo: string;
}

export default function CarreirasScreen() {
  const router = useRouter();
  const [areaAtiva, setAreaAtiva] = useState<AreaType>('tecnologia');
  const [busca, setBusca] = useState('');
  const [cursos, setCursos] = useState<CursoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [selectedCurso, setSelectedCurso] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load session statistics dynamically
  const session = apiService.getSession();
  const user = session.user;

  // Load profile details on mount
  useEffect(() => {
    const loadPerfil = async () => {
      try {
        const data = await apiService.getPerfil();
        setPerfil(data);
      } catch (err) {
        console.warn('Failed to load profile in carreiras:', err);
      }
    };
    loadPerfil();
  }, []);

  const userLevel = perfil ? perfil.nivel.numero : (user ? user.nivel : 1);
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
  const levelName = perfil ? perfil.nivel.nome : getLevelLabelName(userLevel);

  const getLevelImage = (lvl: number) => {
    switch (lvl) {
      case 0: return require('../../assets/images/nivel 0 iniciante.png');
      case 1: return require('../../assets/images/nivel 1 despertado.png');
      case 2: return require('../../assets/images/nivel 2 super nexo 1.png');
      case 3: return require('../../assets/images/nivel 3 super nexo 2.png');
      case 4: return require('../../assets/images/nivel 4 super nexo blue.png');
      case 5: return require('../../assets/images/nivel 5 alem do limite.png');
      default: return require('../../assets/images/nivel 1 despertado.png');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSaibaMais = (curso: any) => {
    setSelectedCurso(curso);
    setIsModalOpen(true);
  };

  // Fetch courses from Django backend with area and search params (debounced)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await apiService.getCursos({ area: areaAtiva, busca });
        const mapped = data.map((c: any) => ({
          id: c.id,
          tipo: c.tipo,
          duracao: c.duracao,
          nome: c.nome,
          descricao: c.descricao,
          tags: c.tags,
          match: `${c.match}%`,
          icone: c.icone,
          corIcone: c.corIcone || c.cor_icone,
          corFundo: c.corFundo || c.cor_fundo,
        }));
        setCursos(mapped);
      } catch (err) {
        console.warn('Failed to load courses from API:', err);
        // Fallback to static mock filter (Teconolgia only)
        const filtered = DADOS_CURSOS.filter((curso) =>
          curso.nome.toLowerCase().includes(busca.toLowerCase()) ||
          curso.descricao.toLowerCase().includes(busca.toLowerCase()) ||
          curso.tags.some((tag) => tag.toLowerCase().includes(busca.toLowerCase()))
        );
        setCursos(filtered);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms search debounce

    return () => clearTimeout(delayDebounce);
  }, [areaAtiva, busca]);

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
          <Text style={styles.headerTitleMain}>CURSOS COMPATÍVEIS</Text>
          <Text style={styles.headerSubtitle}>Baseado no seu perfil lógico e criativo.</Text>
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

      {/* ScrollView principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* SEÇÃO 1 — BANNER INFO */}
        <View style={styles.bannerInfoContainer}>
          <View style={styles.bannerInfoCard}>
            <View style={styles.bannerIconBox}>
              <Ionicons name="star-outline" size={24} color="#4F46E5" />
            </View>
            <View style={styles.bannerTexts}>
              <Text style={styles.bannerTitle}>Selecionados para o seu perfil</Text>
              <Text style={styles.bannerDescription}>
                Combinamos suas forças, interesses e desempenho nas disciplinas para sugerir as melhores opções de graduação. Quanto maior o{' '}
                <Text style={styles.bannerHighlightText}>match</Text>, mais alinhado o curso está com você.
              </Text>
            </View>
          </View>
        </View>

        {/* SEÇÃO 2 — FILTROS DE ÁREA */}
        <View style={styles.areaFiltersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.areaScrollContent}
          >
            {/* Card 1 — Tecnologia & Inovação */}
            <TouchableOpacity
              style={[
                styles.areaCard,
                areaAtiva === 'tecnologia' ? styles.areaCardTecnologiaActive : styles.areaCardInactive,
              ]}
              onPress={() => setAreaAtiva('tecnologia')}
              activeOpacity={0.8}
            >
              <View style={styles.areaIconContainer}>
                <Ionicons name="hardware-chip-outline" size={22} color="#4F46E5" />
              </View>
              <Text style={styles.areaTitle}>Tecnologia & Inovação</Text>
              <Text style={styles.areaDesc}>6 cursos • Para perfis lógicos, criativos e curiosos.</Text>
            </TouchableOpacity>

            {/* Card 2 — Saúde & Bem-Estar */}
            <TouchableOpacity
              style={[
                styles.areaCard,
                areaAtiva === 'saude' ? styles.areaCardSaudeActive : styles.areaCardSaudeInactive,
              ]}
              onPress={() => setAreaAtiva('saude')}
              activeOpacity={0.8}
            >
              <View style={styles.areaIconContainer}>
                <Ionicons name="heart-outline" size={22} color="#EC4899" />
              </View>
              <Text style={styles.areaTitle}>Saúde & Bem-Estar</Text>
              <Text style={styles.areaDesc}>5 cursos • Para quem quer cuidar de pessoas.</Text>
            </TouchableOpacity>

            {/* Card 3 — Negócios, Finanças & Gestão */}
            <TouchableOpacity
              style={[
                styles.areaCard,
                areaAtiva === 'negocios' ? styles.areaCardNegociosActive : styles.areaCardNegociosInactive,
              ]}
              onPress={() => setAreaAtiva('negocios')}
              activeOpacity={0.8}
            >
              <View style={styles.areaIconContainer}>
                <Ionicons name="briefcase-outline" size={22} color="#F59E0B" />
              </View>
              <Text style={styles.areaTitle}>Negócios, Finanças & Gestão</Text>
              <Text style={styles.areaDesc}>4 cursos • Para perfis estratégicos e empreendedores.</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* SEÇÃO 3 — CAMPO DE BUSCA */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#64748B" style={styles.searchIcon} />
            <TextInput
              value={busca}
              onChangeText={setBusca}
              placeholder={
                areaAtiva === 'tecnologia'
                  ? 'Buscar em Tecnologia & Inovação...'
                  : areaAtiva === 'saude'
                  ? 'Buscar em Saúde & Bem-Estar...'
                  : 'Buscar em Negócios, Finanças & Gestão...'
              }
              placeholderTextColor="#64748B"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* SEÇÃO 4 — LISTA DE CURSOS */}
        <View style={styles.coursesListContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6B21A8" style={{ marginBottom: 12 }} />
              <Text style={styles.loadingText}>Carregando cursos...</Text>
            </View>
          ) : cursos.length > 0 ? (
            cursos.map((curso) => (
              <View key={curso.id} style={styles.courseCard}>
                {/* LINHA 1 — Topo do card */}
                <View style={styles.courseCardHeader}>
                  <View style={[styles.courseIconBox, { backgroundColor: curso.corFundo }]}>
                    <Ionicons name={curso.icone as any} size={28} color="#FFFFFF" />
                  </View>

                  <View style={styles.matchValueBox}>
                    <Text style={styles.matchPercentText}>{curso.match}</Text>
                    <Text style={styles.matchLabelText}>MATCH</Text>
                  </View>
                </View>

                {/* LINHA 2 — Info do curso */}
                <View style={styles.courseInfoContainer}>
                  <View style={styles.typeDurationRow}>
                    <Text style={styles.courseTypeText}>{curso.tipo}</Text>
                    <Text style={styles.dotDivider}>•</Text>
                    <Ionicons name="time-outline" size={12} color="#94A3B8" style={styles.timeIcon} />
                    <Text style={styles.durationText}>{curso.duracao}</Text>
                  </View>
                  <Text style={styles.courseName}>{curso.nome}</Text>
                  <Text style={styles.courseDescription}>{curso.descricao}</Text>
                </View>

                {/* LINHA 3 — Tags */}
                <View style={styles.tagsContainer}>
                  {curso.tags.map((tag, idx) => (
                    <View key={idx} style={styles.tagBadge}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                {/* LINHA 4 — Rodapé do card */}
                <View style={styles.courseCardFooter}>
                  <View style={styles.starsContainer}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Ionicons key={i} name="star" size={14} color="#F59E0B" style={styles.starIcon} />
                    ))}
                  </View>

                  <TouchableOpacity
                    onPress={() => handleSaibaMais(curso)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.saibaMaisLink}>Saiba mais ›</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#4B5563" />
              <Text style={styles.emptyText}>Nenhum curso encontrado para &quot;{busca}&quot;.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* DETALHES DO CURSO MODAL */}
      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalOpen(false)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            {/* Header */}
            <View style={styles.modalHeaderRow}>
              <View style={[styles.courseIconContainer, { backgroundColor: selectedCurso?.corFundo || '#1E1B4B' }]}>
                <Ionicons name={selectedCurso?.icone || 'school-outline'} size={24} color={selectedCurso?.corIcone || '#8B5CF6'} />
              </View>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalCourseName}>{selectedCurso?.nome}</Text>
                <Text style={styles.modalCourseMeta}>{selectedCurso?.tipo} • {selectedCurso?.duracao}</Text>
              </View>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Match Badge */}
            <View style={styles.modalMatchRow}>
              <LinearGradient
                colors={['#8B5CF6', '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalMatchBadge}
              >
                <Ionicons name="sparkles" size={14} color="#FFFFFF" />
                <Text style={styles.modalMatchText}>{selectedCurso?.match} compatível</Text>
              </LinearGradient>
              <View style={styles.modalTipoMatchBadge}>
                <Text style={styles.modalTipoMatchText}>{selectedCurso?.tipoMatch}</Text>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.modalLabel}>Sobre o Curso</Text>
            <Text style={styles.modalDescription}>{selectedCurso?.descricao}</Text>

            {/* Tags */}
            <Text style={styles.modalLabel}>Disciplinas e Foco</Text>
            <View style={styles.modalTagsList}>
              {selectedCurso?.tags?.map((tag: string, index: number) => (
                <View key={index} style={styles.modalTag}>
                  <Text style={styles.modalTagText}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Interconnected AI Chat Prompt Button */}
            <TouchableOpacity
              style={styles.modalAiBtn}
              onPress={() => {
                setIsModalOpen(false);
                router.push({
                  pathname: '/(tabs)/chat',
                  params: { autoPrompt: `Quero saber mais sobre o curso de ${selectedCurso?.nome}. Quais são as principais matérias, o mercado de trabalho e a média salarial?` }
                } as any);
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalAiGradient}
              >
                <Ionicons name="chatbubbles-outline" size={18} color="#FFFFFF" />
                <Text style={styles.modalAiBtnText}>Perguntar à IA Nexo</Text>
              </LinearGradient>
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
  bannerInfoContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  bannerInfoCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  bannerIconBox: {
    backgroundColor: '#1F2937',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTexts: {
    marginLeft: 12,
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  bannerDescription: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    marginTop: 4,
    fontFamily: 'System',
  },
  bannerHighlightText: {
    color: '#00D4FF',
    fontWeight: 'bold',
  },
  areaFiltersContainer: {
    marginTop: 16,
  },
  areaScrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  areaCard: {
    borderRadius: 14,
    padding: 12,
    width: 150,
  },
  areaCardInactive: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#2D1B69',
  },
  areaCardTecnologiaActive: {
    backgroundColor: '#1a1040',
    borderWidth: 1.5,
    borderColor: '#4F46E5',
  },
  areaCardSaudeInactive: {
    backgroundColor: '#1a0a1a',
    borderWidth: 1,
    borderColor: '#2D1B69',
  },
  areaCardSaudeActive: {
    backgroundColor: '#1a0a1a',
    borderWidth: 1.5,
    borderColor: '#EC4899',
  },
  areaCardNegociosInactive: {
    backgroundColor: '#1a1200',
    borderWidth: 1,
    borderColor: '#2D1B69',
  },
  areaCardNegociosActive: {
    backgroundColor: '#1a1200',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  areaIconContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  areaTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  areaDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 14,
    fontFamily: 'System',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  searchBar: {
    backgroundColor: '#111827',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
    height: '100%',
    padding: 0,
    fontFamily: 'System',
  },
  coursesListContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  courseCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 12,
  },
  courseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchValueBox: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    minWidth: 64,
  },
  matchPercentText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  matchLabelText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
    fontFamily: 'System',
  },
  courseInfoContainer: {
    marginTop: 12,
  },
  typeDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  courseTypeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  dotDivider: {
    fontSize: 11,
    color: '#94A3B8',
    marginHorizontal: 6,
  },
  timeIcon: {
    marginRight: 4,
  },
  durationText: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'System',
  },
  courseName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  courseDescription: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 20,
    fontFamily: 'System',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tagBadge: {
    backgroundColor: '#1F2937',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'System',
  },
  courseCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginRight: 2,
  },
  saibaMaisLink: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '600',
    fontFamily: 'System',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
    fontFamily: 'System',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '600',
  },
  // MODAL DETALHES DO CURSO STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 22, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  courseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalCourseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  modalCourseMeta: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontFamily: 'System',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalMatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  modalMatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modalMatchText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: 'System',
  },
  modalTipoMatchBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTipoMatchText: {
    fontSize: 11,
    color: '#38BDF8',
    fontWeight: '700',
    fontFamily: 'System',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 12,
    fontFamily: 'System',
  },
  modalDescription: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 22,
    fontFamily: 'System',
    marginBottom: 12,
  },
  modalTagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  modalTag: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTagText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontFamily: 'System',
  },
  modalAiBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
  },
  modalAiGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  modalAiBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
});
